/**
 * Kitap görsel oluşturma worker — Faz 2: gerçek pipeline.
 *
 * Her job:
 *  1. Kitabı ve karakterleri DB'den okur
 *  2. runImagePipeline çağırır (masters → cover → pages → TTS)
 *  3. Her adımda progress_percent + progress_step güncellenir
 */
import { Worker, Job } from 'bullmq'
import { connection, BOOK_GENERATION_QUEUE_NAME, type BookGenerationJobData } from '../client'
import { runImagePipeline } from '@/lib/book-generation/image-pipeline'
import { getBookById, updateBook } from '@/lib/db/books'
import { getCharacterById } from '@/lib/db/characters'

async function processBookGeneration(job: Job<BookGenerationJobData>): Promise<void> {
  const { bookId, userId, characterIds, illustrationStyle, themeKey, language, customRequests, isFromExampleMode, isCoverOnlyMode, fromExampleId, storyModel, pageCount } = job.data

  console.log(`[Worker] 🚀 Job ${job.id} started — bookId=${bookId}`)

  // 1. Book'u DB'den oku
  const { data: book, error: bookError } = await getBookById(bookId)
  if (bookError || !book) {
    throw new Error(`[Worker] Book not found: ${bookId} (${bookError})`)
  }

  // 2. Karakterleri DB'den oku
  const characters: any[] = []
  for (const charId of characterIds) {
    const { data: char, error: charErr } = await getCharacterById(charId)
    if (charErr || !char) {
      console.warn(`[Worker] Character ${charId} not found — skipping`)
      continue
    }
    characters.push(char)
  }

  if (characters.length === 0) {
    throw new Error(`[Worker] No characters found for book ${bookId}`)
  }

  // 3. From-example: örnek kitabı oku
  let exampleBook: any = null
  if (isFromExampleMode && fromExampleId) {
    const { data: exBook } = await getBookById(fromExampleId)
    exampleBook = exBook || null
  }

  // 4. Pipeline'ı çalıştır (storyData null ise pipeline hikayeyi ilk adım olarak üretir — P3)
  await runImagePipeline({
    bookId,
    userId,
    characters,
    storyData: book.story_data,
    illustrationStyle,
    themeKey,
    language,
    customRequests,
    isFromExampleMode,
    isCoverOnlyMode,
    exampleBook,
    storyModel: storyModel || 'gpt-4o-mini',
    pageCount: pageCount || 4,
    onProgress: async (percent, step) => {
      await job.updateProgress(percent)
      console.log(`[Worker] 📊 Job ${job.id} progress: ${percent}% — ${step}`)
    },
    debugTrace: null,
  })

  console.log(`[Worker] ✅ Job ${job.id} completed — bookId=${bookId}`)
}

export function startBookGenerationWorker(): Worker {
  const worker = new Worker<BookGenerationJobData>(
    BOOK_GENERATION_QUEUE_NAME,
    processBookGeneration,
    {
      connection,
      concurrency: 3,
    }
  )

  worker.on('completed', (job) => {
    console.log(`[Worker] ✅ Job ${job.id} completed`)
  })

  worker.on('failed', (job, err) => {
    const bookId = job?.data?.bookId
    console.error(`[Worker] ❌ Job ${job?.id} failed (bookId=${bookId}):`, err?.message)
    // Book status'u 'failed' olarak güncelle
    if (bookId) {
      updateBook(bookId, { status: 'failed', progress_step: 'failed' }).catch((dbErr) => {
        console.error(`[Worker] DB update failed for ${bookId}:`, dbErr)
      })
    }
  })

  worker.on('error', (err) => {
    console.error('[Worker] Worker error:', err)
  })

  return worker
}
