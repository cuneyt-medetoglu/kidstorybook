import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Try to list buckets (server-side, might have more permissions)
    const { data: buckets, error } = await supabase.storage.listBuckets()

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          buckets: [],
          note: 'listBuckets() might require service_role key. Testing individual buckets...'
        },
        { status: 200 } // Don't fail, just report
      )
    }

    const bucketNames = buckets?.map(b => b.name) || []
    const expectedBuckets = ['photos', 'books', 'pdfs', 'covers']
    
    // Test each bucket individually
    const bucketTests = await Promise.all(
      expectedBuckets.map(async (bucketName) => {
        const { error: listError } = await supabase.storage
          .from(bucketName)
          .list('', { limit: 1 })
        
        return {
          name: bucketName,
          exists: bucketNames.includes(bucketName),
          accessible: !listError || !listError.message.includes('not found')
        }
      })
    )

    return NextResponse.json({
      success: true,
      buckets: bucketNames,
      expectedBuckets,
      bucketTests,
      allExist: bucketTests.every(b => b.exists || b.accessible)
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

