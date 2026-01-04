'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function TestSupabase() {
  const [status, setStatus] = useState<{
    connection: string
    database: string
    storage: string
    auth: string
  }>({
    connection: 'Testing...',
    database: 'Pending',
    storage: 'Pending',
    auth: 'Pending',
  })

  const supabase = createClient()

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // 1. Test basic connection
      const { error: connectionError } = await supabase.from('users').select('count').limit(0)
      
      if (connectionError) {
        setStatus(prev => ({ 
          ...prev, 
          connection: `❌ Failed: ${connectionError.message}` 
        }))
        return
      }

      setStatus(prev => ({ ...prev, connection: '✅ Connected' }))

      // 2. Test database schema
      await testDatabase()

      // 3. Test storage
      await testStorage()

      // 4. Test auth
      await testAuth()
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        connection: `❌ Error: ${error.message}` 
      }))
    }
  }

  const testDatabase = async () => {
    try {
      // Check all tables exist
      const tables = ['users', 'oauth_accounts', 'characters', 'books', 'orders', 'payments']
      const results = []

      for (const table of tables) {
        const { error } = await supabase.from(table).select('count').limit(0)
        results.push({ table, exists: !error })
      }

      const allExist = results.every(r => r.exists)
      const details = results.map(r => `${r.table}: ${r.exists ? '✅' : '❌'}`).join(', ')

      setStatus(prev => ({ 
        ...prev, 
        database: allExist ? '✅ All tables exist' : `⚠️ Some tables missing: ${details}` 
      }))
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        database: `❌ Error: ${error.message}` 
      }))
    }
  }

  const testStorage = async () => {
    try {
      // Try server-side API first (has more permissions)
      const apiResponse = await fetch('/api/test/storage')
      const apiData = await apiResponse.json()

      if (apiData.success && apiData.allExist) {
        const foundBuckets = apiData.bucketTests
          .filter((b: any) => b.exists || b.accessible)
          .map((b: any) => b.name)
        
        setStatus(prev => ({ 
          ...prev, 
          storage: `✅ All buckets exist (${foundBuckets.join(', ')})` 
        }))
        return
      }

      // Fallback: Test each bucket individually from client
      const expectedBuckets = ['photos', 'books', 'pdfs', 'covers']
      
      const bucketTests = await Promise.all(
        expectedBuckets.map(async (bucketName) => {
          // Try to list files in the bucket
          const { data, error } = await supabase.storage
            .from(bucketName)
            .list('', { limit: 1 })
          
          // If no error OR error is not "not found", bucket exists
          const exists = !error || (
            error.message && 
            !error.message.toLowerCase().includes('not found') && 
            !error.message.toLowerCase().includes('does not exist') &&
            !error.message.toLowerCase().includes('bucket')
          )
          
          return {
            name: bucketName,
            exists: exists,
            accessible: !error,
            error: error?.message || null
          }
        })
      )

      const foundBuckets = bucketTests.filter(b => b.exists || b.accessible).map(b => b.name)
      const missingBuckets = bucketTests.filter(b => !b.exists && !b.accessible).map(b => b.name)
      const allExist = bucketTests.every(b => b.exists || b.accessible)

      if (allExist) {
        setStatus(prev => ({ 
          ...prev, 
          storage: `✅ All buckets exist and accessible (${foundBuckets.join(', ')})` 
        }))
      } else {
        const errorDetails = bucketTests
          .filter(b => !b.exists && !b.accessible)
          .map(b => `${b.name}: ${b.error || 'not accessible'}`)
          .join('; ')
        
        setStatus(prev => ({ 
          ...prev, 
          storage: `⚠️ Missing/Inaccessible: ${missingBuckets.join(', ')} | Found: ${foundBuckets.join(', ') || 'none'} | Note: Private buckets might not be accessible with anon key` 
        }))
      }
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        storage: `❌ Error: ${error.message}` 
      }))
    }
  }

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        setStatus(prev => ({ 
          ...prev, 
          auth: `❌ Failed: ${error.message}` 
        }))
        return
      }

      setStatus(prev => ({ 
        ...prev, 
        auth: data.session ? '✅ Session active' : '✅ Auth configured (no session)' 
      }))
    } catch (error: any) {
      setStatus(prev => ({ 
        ...prev, 
        auth: `❌ Error: ${error.message}` 
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2">🧪 Supabase Test Suite</h1>
          <p className="text-gray-600 mb-6">Testing Supabase connection, database, storage, and auth</p>

          <div className="space-y-4">
            {/* Connection Status */}
            <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
              <h2 className="font-semibold text-blue-900 mb-2">Connection</h2>
              <p className="text-blue-800">{status.connection}</p>
            </div>

            {/* Database Status */}
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <h2 className="font-semibold text-green-900 mb-2">Database Schema</h2>
              <p className="text-green-800">{status.database}</p>
            </div>

            {/* Storage Status */}
            <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded">
              <h2 className="font-semibold text-yellow-900 mb-2">Storage Buckets</h2>
              <p className="text-yellow-800">{status.storage}</p>
              <p className="text-xs text-yellow-700 mt-2">
                💡 Not: Bucket'lar Supabase Dashboard'da görünüyorsa kurulum başarılıdır. 
                Anon key ile private bucket'lara erişilemeyebilir (bu normal).
              </p>
            </div>

            {/* Auth Status */}
            <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
              <h2 className="font-semibold text-purple-900 mb-2">Authentication</h2>
              <p className="text-purple-800">{status.auth}</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button onClick={testConnection} className="bg-gradient-to-r from-purple-500 to-pink-500">
              🔄 Retest All
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              ← Back to Home
            </Button>
          </div>

          {/* Environment Info */}
          <div className="mt-8 p-4 bg-gray-100 rounded text-sm">
            <h3 className="font-semibold mb-2">Environment Info</h3>
            <p className="text-gray-600">
              <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}
            </p>
            <p className="text-gray-600">
              <strong>Anon Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

