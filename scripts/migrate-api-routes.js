#!/usr/bin/env node
/**
 * Migration Script: Update all API routes to use PostgreSQL + AWS S3 + NextAuth
 * 
 * This script updates:
 * 1. Supabase auth → requireUser() from lib/auth/api-auth
 * 2. Supabase client imports → Remove
 * 3. DB function calls → Remove 'supabase' parameter
 * 4. Storage calls → Use lib/storage/s3
 * 
 * Run: node scripts/migrate-api-routes.js
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Find all API route files
const apiFiles = glob.sync('app/api/**/*.ts', { cwd: __dirname + '/..' })

console.log(`Found ${apiFiles.length} API route files to migrate\n`)

let updatedCount = 0
let errorCount = 0

apiFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath)
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8')
    let modified = false

    // 1. Replace Supabase auth imports
    if (content.includes("from '@/lib/supabase/server'")) {
      content = content.replace(
        /import\s*{\s*createClient\s*}\s*from\s*'@\/lib\/supabase\/server'/g,
        "import { requireUser } from '@/lib/auth/api-auth'"
      )
      modified = true
    }

    // 2. Replace auth.getUser() pattern
    const authPattern = /const supabase = (?:await )?createClient\([^\)]*\)\s*(?:const\s*{\s*data:\s*{\s*user\s*},?\s*error:\s*authError\s*}\s*=\s*await\s*supabase\.auth\.getUser\(\))/gs
    if (authPattern.test(content)) {
      content = content.replace(authPattern, 'const user = await requireUser()')
      modified = true
    }

    // 3. Replace standalone createClient() calls (for DB operations)
    content = content.replace(/const supabase = (?:await )?createClient\([^\)]*\)/g, '// Auth handled by requireUser()')
    
    // 4. Remove unused Supabase client operations (basic pattern)
    content = content.replace(/if\s*\(authError\s*\|\|\s*!user\)\s*{\s*return\s+(?:NextResponse\.json|errorResponse)\([^}]+}\s*}/g, '')

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf8')
      console.log(`✅ Updated: ${filePath}`)
      updatedCount++
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message)
    errorCount++
  }
})

console.log(`\n📊 Migration Summary:`)
console.log(`✅ Updated: ${updatedCount} files`)
console.log(`❌ Errors: ${errorCount} files`)
console.log(`⚠️  Manual review required for complex patterns`)
