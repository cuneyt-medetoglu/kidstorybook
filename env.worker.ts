/**
 * BullMQ worker ve tsx CLI için ortam değişkenleri.
 * Next.js ile aynı sıra: önce `.env`, sonra `.env.local` (override).
 * `REDIS_URL` veya DB sadece `.env.local` içindeyse worker'ın bunları görmesi gerekir.
 */
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })
dotenv.config({ path: '.env.local', override: true })
