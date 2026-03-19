/**
 * GET /api/admin/queues
 * BullMQ job queue istatistikleri ve job listesi (admin only)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { bookGenerationQueue } from '@/lib/queue/client'

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const statusFilter = searchParams.get('status') || 'all'

  try {
    const [counts, activeJobs, waitingJobs, completedJobs, failedJobs, delayedJobs] =
      await Promise.all([
        bookGenerationQueue.getJobCounts(
          'active',
          'waiting',
          'completed',
          'failed',
          'delayed',
          'paused'
        ),
        statusFilter === 'all' || statusFilter === 'active'
          ? bookGenerationQueue.getJobs(['active'], 0, 20)
          : [],
        statusFilter === 'all' || statusFilter === 'waiting'
          ? bookGenerationQueue.getJobs(['waiting'], 0, 20)
          : [],
        statusFilter === 'all' || statusFilter === 'completed'
          ? bookGenerationQueue.getJobs(['completed'], 0, 20)
          : [],
        statusFilter === 'all' || statusFilter === 'failed'
          ? bookGenerationQueue.getJobs(['failed'], 0, 20)
          : [],
        statusFilter === 'all' || statusFilter === 'delayed'
          ? bookGenerationQueue.getJobs(['delayed'], 0, 10)
          : [],
      ])

    const formatJob = (job: any, status: string) => ({
      id: job.id,
      status,
      bookId: job.data?.bookId,
      userId: job.data?.userId,
      progress: typeof job.progress === 'number' ? job.progress : 0,
      attemptsMade: job.attemptsMade ?? 0,
      createdAt: job.timestamp ? new Date(job.timestamp).toISOString() : null,
      processedAt: job.processedOn ? new Date(job.processedOn).toISOString() : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
      failReason: job.failedReason ?? null,
    })

    const jobs = [
      ...activeJobs.map((j) => formatJob(j, 'active')),
      ...waitingJobs.map((j) => formatJob(j, 'waiting')),
      ...delayedJobs.map((j) => formatJob(j, 'delayed')),
      ...completedJobs.map((j) => formatJob(j, 'completed')),
      ...failedJobs.map((j) => formatJob(j, 'failed')),
    ]

    return NextResponse.json({
      counts,
      jobs,
      queueName: 'book-generation',
    })
  } catch (error: any) {
    console.error('[Admin Queues] Error fetching queue stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch queue stats', detail: error?.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/queues?jobId=xxx — Job'u sil (failed/completed)
 * POST /api/admin/queues?action=retry&jobId=xxx — Failed job'u yeniden dene
 */
export async function DELETE(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const jobId = searchParams.get('jobId')
  if (!jobId) return NextResponse.json({ error: 'jobId required' }, { status: 400 })

  try {
    const job = await bookGenerationQueue.getJob(jobId)
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    await job.remove()
    return NextResponse.json({ success: true, jobId })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((token as { role?: string }).role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const jobId = searchParams.get('jobId')

  if (action === 'retry' && jobId) {
    try {
      const job = await bookGenerationQueue.getJob(jobId)
      if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
      await job.retry()
      return NextResponse.json({ success: true, jobId })
    } catch (error: any) {
      return NextResponse.json({ error: error?.message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
