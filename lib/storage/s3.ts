import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl as getS3SignedUrl } from '@aws-sdk/s3-request-presigner'

const bucket = process.env.AWS_S3_BUCKET
const region = process.env.AWS_REGION || 'eu-central-1'

if (!bucket) {
  throw new Error('AWS_S3_BUCKET environment variable is not set')
}

// Create S3 client
// If running on EC2 with IAM role, credentials are automatically obtained
export const s3Client = new S3Client({
  region,
  // Credentials are automatically obtained from:
  // 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) - for local dev
  // 2. EC2 instance metadata (IAM role) - for production
})

/**
 * Upload file to S3
 * @param prefix - S3 prefix (e.g., 'covers', 'photos', 'books', 'pdfs', 'tts-cache')
 * @param fileName - File name
 * @param buffer - File buffer
 * @param contentType - MIME type
 * @returns S3 key (full path)
 */
export async function uploadFile(
  prefix: string,
  fileName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const key = `${prefix}/${fileName}`
  
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  })
  
  await s3Client.send(command)
  
  if (process.env.DEBUG_LOGGING === 'true') {
    console.log('[S3] Uploaded:', key)
  }
  
  return key
}

/**
 * Get public URL for S3 object
 * @param key - S3 key (full path)
 * @returns Public URL
 */
export function getPublicUrl(key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

/**
 * Get a time-limited signed URL for S3 object
 * @param key - S3 key (full path)
 * @param expiresInSeconds - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getSignedObjectUrl(key: string, expiresInSeconds: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })

  return getS3SignedUrl(s3Client, command, { expiresIn: expiresInSeconds })
}

/**
 * List files in S3 prefix
 * @param prefix - S3 prefix
 * @returns Array of file keys
 */
export async function listFiles(prefix: string): Promise<string[]> {
  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  })
  
  const response = await s3Client.send(command)
  return response.Contents?.map(obj => obj.Key!).filter(Boolean) || []
}

/**
 * Delete file from S3
 * @param key - S3 key (full path)
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  
  await s3Client.send(command)
  
  if (process.env.DEBUG_LOGGING === 'true') {
    console.log('[S3] Deleted:', key)
  }
}

/**
 * Download file from S3 as Buffer (for server-side use, e.g. sending to OpenAI)
 * @param key - S3 key (full path)
 * @returns { buffer, contentType } or null if not found
 */
export async function getObjectBuffer(key: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    const response = await s3Client.send(command)
    const body = response.Body
    if (!body) return null
    const chunks: Uint8Array[] = []
    for await (const chunk of body as any) chunks.push(chunk)
    const buffer = Buffer.concat(chunks)
    const contentType = (response.ContentType as string) || 'image/png'
    return { buffer, contentType }
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) return null
    throw error
  }
}

/**
 * Check if file exists in S3
 * @param key - S3 key (full path)
 * @returns boolean
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
    await s3Client.send(command)
    return true
  } catch (error: any) {
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return false
    }
    throw error
  }
}
