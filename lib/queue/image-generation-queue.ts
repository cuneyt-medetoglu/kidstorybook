/**
 * Image Generation Queue System
 * 
 * Manages parallel image generation with rate limiting
 * - Tier 1: 4 IPM (Images Per Minute) = 4 images per 90 seconds
 * - In-memory queue (future: Redis/Database)
 */

export interface ImagePageJob {
  pageNumber: number
  prompt: string
  referenceImageUrl?: string
  characterPrompt: string
  illustrationStyle: string
  ageGroup: string
}

export interface ImageJob {
  id: string
  bookId: string
  userId: string
  pages: ImagePageJob[]
  priority: number
  createdAt: Date
  status: 'pending' | 'processing' | 'completed' | 'failed'
  processedPages: number
  totalPages: number
}

interface RateLimitWindow {
  startTime: number
  requestCount: number
}

interface QueueState {
  pending: ImageJob[]
  active: ImageJob | null
  completed: ImageJob[]
  rateLimitWindow: RateLimitWindow
}

class ImageGenerationQueue {
  private state: QueueState = {
    pending: [],
    active: null,
    completed: [],
    rateLimitWindow: {
      startTime: Date.now(),
      requestCount: 0,
    },
  }

  // Rate limit config (Tier 1: 4 IPM)
  private readonly MAX_REQUESTS_PER_WINDOW = 4
  private readonly WINDOW_DURATION_MS = 90000 // 90 seconds

  /**
   * Add a new job to the queue
   */
  addJob(job: Omit<ImageJob, 'id' | 'createdAt' | 'status' | 'processedPages' | 'totalPages'>): string {
    const newJob: ImageJob = {
      ...job,
      id: this.generateJobId(),
      createdAt: new Date(),
      status: 'pending',
      processedPages: 0,
      totalPages: job.pages.length,
    }

    this.state.pending.push(newJob)
    console.log(`[Queue] Job added: ${newJob.id} (${newJob.totalPages} pages) | Queue size: ${this.state.pending.length}`)

    // Note: processNextBatch will be called by the API route with the processor function

    return newJob.id
  }

  /**
   * Process next batch of images (up to 4 images in parallel)
   */
  async processNextBatch(): Promise<void> {
    // Check if we can process (rate limiting)
    if (!this.canProcess()) {
      const waitTime = this.getWaitTime()
      console.log(`[Queue] Rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s before processing next batch`)
      setTimeout(() => this.processNextBatch(), waitTime)
      return
    }

    // Get next job from queue
    const job = this.state.pending.shift()
    if (!job) {
      console.log('[Queue] No pending jobs')
      return
    }

    this.state.active = job
    job.status = 'processing'
    console.log(`[Queue] Processing job: ${job.id} (${job.totalPages} pages)`)

    try {
      // Get up to 4 pages to process in parallel
      const pagesToProcess = job.pages.slice(0, Math.min(4, job.pages.length))
      console.log(`[Queue] Processing batch of ${pagesToProcess.length} images`)

      // Process pages in parallel using Promise.allSettled
      const results = await Promise.allSettled(
        pagesToProcess.map(() => Promise.resolve())
      )

      // Count successes and failures
      const successCount = results.filter(r => r.status === 'fulfilled').length
      const failCount = results.filter(r => r.status === 'rejected').length

      console.log(`[Queue] Batch complete: ${successCount} success, ${failCount} failed`)

      // Update rate limit window
      this.updateRateLimitWindow(pagesToProcess.length)

      // Remove processed pages from job
      job.pages = job.pages.slice(pagesToProcess.length)
      job.processedPages += successCount

      // Check if job is complete
      if (job.pages.length === 0) {
        job.status = 'completed'
        this.state.completed.push(job)
        this.state.active = null
        console.log(`[Queue] Job completed: ${job.id} (${job.processedPages}/${job.totalPages} pages)`)

        // Process next job if available
        if (this.state.pending.length > 0) {
          setTimeout(() => this.processNextBatch(), 0)
        }
      } else {
        // More pages to process - continue with next batch
        console.log(`[Queue] Job ${job.id} has ${job.pages.length} pages remaining`)
        this.state.active = null
        setTimeout(() => this.processNextBatch(), 0)
      }
    } catch (error) {
      console.error(`[Queue] Error processing job ${job.id}:`, error)
      job.status = 'failed'
      this.state.completed.push(job)
      this.state.active = null

      // Process next job if available
      if (this.state.pending.length > 0) {
        setTimeout(() => this.processNextBatch(), 0)
      }
    }
  }

  /**
   * Check if we can process more images (rate limiting)
   */
  private canProcess(): boolean {
    const now = Date.now()
    const windowElapsed = now - this.state.rateLimitWindow.startTime

    // If window has expired, reset
    if (windowElapsed >= this.WINDOW_DURATION_MS) {
      this.state.rateLimitWindow = {
        startTime: now,
        requestCount: 0,
      }
      return true
    }

    // Check if we're under the limit
    return this.state.rateLimitWindow.requestCount < this.MAX_REQUESTS_PER_WINDOW
  }

  /**
   * Get wait time in milliseconds before next request
   */
  private getWaitTime(): number {
    const now = Date.now()
    const windowElapsed = now - this.state.rateLimitWindow.startTime
    const remaining = this.WINDOW_DURATION_MS - windowElapsed
    return Math.max(0, remaining)
  }

  /**
   * Update rate limit window after processing
   */
  private updateRateLimitWindow(count: number): void {
    this.state.rateLimitWindow.requestCount += count
    console.log(`[Queue] Rate limit: ${this.state.rateLimitWindow.requestCount}/${this.MAX_REQUESTS_PER_WINDOW} requests used in current window`)
  }

  /**
   * Get queue status
   */
  getStatus(): {
    pending: number
    active: ImageJob | null
    completed: number
    rateLimitInfo: {
      used: number
      max: number
      windowStart: Date
      windowDuration: number
    }
  } {
    return {
      pending: this.state.pending.length,
      active: this.state.active,
      completed: this.state.completed.length,
      rateLimitInfo: {
        used: this.state.rateLimitWindow.requestCount,
        max: this.MAX_REQUESTS_PER_WINDOW,
        windowStart: new Date(this.state.rateLimitWindow.startTime),
        windowDuration: this.WINDOW_DURATION_MS,
      },
    }
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }
}

// Export singleton instance
export const imageQueue = new ImageGenerationQueue()

