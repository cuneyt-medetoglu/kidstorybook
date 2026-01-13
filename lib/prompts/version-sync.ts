/**
 * Prompt Version Sync and Tracking System
 * 
 * This module ensures synchronization between:
 * - lib/prompts/ (code) and docs/prompts/ (documentation)
 * - Version numbers across all prompt files
 * - Changelog consistency
 * 
 * Responsibility: @project-manager
 * Usage: Run this to check sync status and update versions
 */

import type { PromptVersion } from './types'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// ============================================================================
// Version Information from Code
// ============================================================================

export interface PromptModuleVersion {
  module: 'story' | 'image' | 'cover'
  submodule?: string // e.g., 'negative', 'scene', 'character'
  version: string
  releaseDate: Date
  status: 'active' | 'deprecated' | 'experimental'
  changelog: string[]
  author: string
  filePath: string
}

/**
 * Extract version info from a TypeScript file
 */
function extractVersionFromFile(filePath: string): PromptModuleVersion | null {
  try {
    const content = readFileSync(filePath, 'utf-8')
    
    // Extract VERSION export
    const versionMatch = content.match(/export\s+const\s+VERSION[^=]*=\s*({[\s\S]*?});/m)
    if (!versionMatch) return null
    
    // Parse version object (simple regex parsing - for production use a proper TS parser)
    const versionStr = versionMatch[1]
    const versionMatch2 = versionStr.match(/version:\s*['"]([^'"]+)['"]/)
    const releaseDateMatch = versionStr.match(/releaseDate:\s*new\s+Date\(['"]([^'"]+)['"]\)/)
    const statusMatch = versionStr.match(/status:\s*['"]([^'"]+)['"]/)
    const changelogMatch = versionStr.match(/changelog:\s*\[([\s\S]*?)\]/)
    const authorMatch = versionStr.match(/author:\s*['"]([^'"]+)['"]/)
    
    if (!versionMatch2) return null
    
    // Extract changelog items
    const changelog: string[] = []
    if (changelogMatch) {
      const changelogContent = changelogMatch[1]
      const items = changelogContent.match(/['"]([^'"]+)['"]/g) || []
      changelog.push(...items.map(item => item.replace(/['"]/g, '')))
    }
    
    // Determine module type from path
    let module: 'story' | 'image' | 'cover' = 'image'
    let submodule: string | undefined
    
    if (filePath.includes('/story/')) {
      module = 'story'
    } else if (filePath.includes('/cover/')) {
      module = 'cover'
    }
    
    // Extract submodule name from filename
    const filename = filePath.split('/').pop()?.replace('.ts', '') || ''
    if (filename !== 'base' && filename !== 'index') {
      submodule = filename
    }
    
    return {
      module,
      submodule,
      version: versionMatch2[1],
      releaseDate: releaseDateMatch ? new Date(releaseDateMatch[1]) : new Date(),
      status: (statusMatch?.[1] as any) || 'active',
      changelog,
      author: authorMatch?.[1] || '@prompt-manager',
      filePath,
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    return null
  }
}

/**
 * Scan all prompt files and extract versions
 */
export function scanPromptVersions(rootPath: string = join(process.cwd(), 'lib/prompts')): PromptModuleVersion[] {
  const versions: PromptModuleVersion[] = []
  
  // Scan story modules
  const storyPath = join(rootPath, 'story')
  if (existsSync(storyPath)) {
    const storyFiles = ['base.ts']
    storyFiles.forEach(file => {
      const filePath = join(storyPath, 'v1.0.0', file)
      if (existsSync(filePath)) {
        const version = extractVersionFromFile(filePath)
        if (version) versions.push(version)
      }
    })
  }
  
  // Scan image modules
  const imagePath = join(rootPath, 'image')
  if (existsSync(imagePath)) {
    const imageFiles = ['negative.ts', 'scene.ts', 'character.ts']
    imageFiles.forEach(file => {
      const filePath = join(imagePath, 'v1.0.0', file)
      if (existsSync(filePath)) {
        const version = extractVersionFromFile(filePath)
        if (version) versions.push(version)
      }
    })
  }
  
  return versions
}

// ============================================================================
// Documentation Sync Check
// ============================================================================

export interface SyncStatus {
  module: 'story' | 'image'
  codeVersion: string
  docVersion: string | null
  isSynced: boolean
  codeChangelog: string[]
  docChangelog: string[] | null
  lastCodeUpdate: Date
  lastDocUpdate: Date | null
}

/**
 * Check sync status between code and documentation
 */
export function checkSyncStatus(): SyncStatus[] {
  const codeVersions = scanPromptVersions()
  const statuses: SyncStatus[] = []
  
  // Group by module
  const storyVersions = codeVersions.filter(v => v.module === 'story')
  const imageVersions = codeVersions.filter(v => v.module === 'image')
  
  // Check story sync
  if (storyVersions.length > 0) {
    const storyVersion = storyVersions[0] // Assume base.ts is main
    const docPath = join(process.cwd(), 'docs/prompts/STORY_PROMPT_TEMPLATE_v1.0.0.md')
    const docExists = existsSync(docPath)
    
    let docVersion: string | null = null
    let docChangelog: string[] | null = null
    let lastDocUpdate: Date | null = null
    
    if (docExists) {
      try {
        const docContent = readFileSync(docPath, 'utf-8')
        const versionMatch = docContent.match(/v(\d+\.\d+\.\d+)/)
        if (versionMatch) docVersion = versionMatch[1]
        
        // Try to extract changelog from doc
        const changelogMatch = docContent.match(/### v[\d.]+[^#]*/s)
        if (changelogMatch) {
          // Simple extraction - could be improved
          docChangelog = []
        }
      } catch (error) {
        console.error('Error reading story doc:', error)
      }
    }
    
    statuses.push({
      module: 'story',
      codeVersion: storyVersion.version,
      docVersion,
      isSynced: docVersion === storyVersion.version,
      codeChangelog: storyVersion.changelog,
      docChangelog,
      lastCodeUpdate: storyVersion.releaseDate,
      lastDocUpdate,
    })
  }
  
  // Check image sync
  if (imageVersions.length > 0) {
    // Use scene.ts as main image version (or combine all)
    const imageVersion = imageVersions.find(v => v.submodule === 'scene') || imageVersions[0]
    const docPath = join(process.cwd(), 'docs/prompts/IMAGE_PROMPT_TEMPLATE_v1.0.0.md')
    const docExists = existsSync(docPath)
    
    let docVersion: string | null = null
    let docChangelog: string[] | null = null
    let lastDocUpdate: Date | null = null
    
    if (docExists) {
      try {
        const docContent = readFileSync(docPath, 'utf-8')
        const versionMatch = docContent.match(/v(\d+\.\d+\.\d+)/)
        if (versionMatch) docVersion = versionMatch[1]
      } catch (error) {
        console.error('Error reading image doc:', error)
      }
    }
    
    statuses.push({
      module: 'image',
      codeVersion: imageVersion.version,
      docVersion,
      isSynced: docVersion === imageVersion.version,
      codeChangelog: imageVersion.changelog,
      docChangelog,
      lastCodeUpdate: imageVersion.releaseDate,
      lastDocUpdate,
    })
  }
  
  return statuses
}

// ============================================================================
// Semantic Versioning Helpers
// ============================================================================

export interface VersionBump {
  type: 'major' | 'minor' | 'patch'
  current: string
  next: string
}

/**
 * Calculate next version based on semantic versioning
 */
export function calculateNextVersion(currentVersion: string, bumpType: 'major' | 'minor' | 'patch'): string {
  const [major, minor, patch] = currentVersion.split('.').map(Number)
  
  switch (bumpType) {
    case 'major':
      return `${major + 1}.0.0`
    case 'minor':
      return `${major}.${minor + 1}.0`
    case 'patch':
      return `${major}.${minor}.${patch + 1}`
    default:
      return currentVersion
  }
}

/**
 * Determine bump type from changelog entry
 */
export function suggestBumpType(changelogEntry: string): 'major' | 'minor' | 'patch' {
  const lower = changelogEntry.toLowerCase()
  
  // Major: breaking changes, major refactoring
  if (lower.includes('breaking') || lower.includes('refactor') || lower.includes('major change')) {
    return 'major'
  }
  
  // Minor: new features, enhancements
  if (lower.includes('add') || lower.includes('new') || lower.includes('enhance') || lower.includes('improve')) {
    return 'minor'
  }
  
  // Patch: bug fixes, typos, small fixes
  return 'patch'
}

// ============================================================================
// Changelog Management
// ============================================================================

/**
 * Generate changelog entry for a version update
 */
export function generateChangelogEntry(
  version: string,
  bumpType: 'major' | 'minor' | 'patch',
  changes: string[],
  author: string = '@prompt-manager'
): string {
  const date = new Date().toISOString().split('T')[0]
  const dateFormatted = new Date().toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
  
  return `
### v${version} (${dateFormatted}) - ${bumpType.charAt(0).toUpperCase() + bumpType.slice(1)} Update

**Değişiklikler:**
${changes.map(change => `- ${change}`).join('\n')}

**Author:** ${author}
**Release Date:** ${date}
`
}

// ============================================================================
// Export Summary
// ============================================================================

export default {
  scanPromptVersions,
  checkSyncStatus,
  calculateNextVersion,
  suggestBumpType,
  generateChangelogEntry,
}
