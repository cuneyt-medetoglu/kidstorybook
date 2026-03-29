# Kuyruk + worker: kitap oluşturma (BullMQ)

Create Book **fast path**: API kitap kaydı + kuyruk job’u; worker `runImagePipeline` çalıştırır. Detaylı adım sırası: `CREATE_BOOK_FLOW_SEQUENCE.md`.

## İlgili dokümanlar ve kod

| Konu | Dosya |
|------|--------|
| Adım sırası, TTS paralelliği, sayfa batch (15) | `docs/analysis/CREATE_BOOK_FLOW_SEQUENCE.md` |
| Redis + PM2 web + worker kurulum | `docs/implementation/FAZ0_REDIS_PM2.md` |
| Sunucuda worker kontrolü | `docs/checklists/EC2_DEPLOY_POST_PULL_2026.md` |
| Kuyruk adı, `enqueueBookGeneration` | `lib/queue/client.ts` |
| Worker concurrency, job işleyici | `lib/queue/workers/book-generation.worker.ts` |
| Görsel pipeline (masters → kapak → sayfa batch) | `lib/book-generation/image-pipeline.ts` |
| Fast path: DB + kuyruk | `app/api/books/route.ts` (~satır 884–958) |

## Mermaid — çok kullanıcı aynı anda kitap istedi

```mermaid
flowchart TB
  subgraph clients["10 kullanıcı"]
    U1[İstek 1]
    U2[İstek 2]
    U10[İstek 10]
  end

  subgraph next["Next.js API POST /api/books"]
    API["Her istek: createBook DB<br/>status: generating<br/>story_data: null"]
    ENQ["enqueueBookGeneration()<br/>BullMQ job: generate-images"]
    RET["Hemen yanıt: bookId<br/>kullanıcı polling / generating UI"]
  end

  subgraph redis["Redis — kuyruk: book-generation"]
    Q[("Bekleyen job'lar<br/>10 job sıraya girer")]
  end

  subgraph worker_proc["PM2: herokidstory-worker"]
    W["BullMQ Worker<br/>concurrency: 3"]
    J1["Job A: runImagePipeline"]
    J2["Job B: runImagePipeline"]
    J3["Job C: runImagePipeline"]
    W --> J1
    W --> J2
    W --> J3
  end

  subgraph one_job["Tek kitap içi (özet)"]
    ST["Gerekirse hikaye GPT"]
    M["Master görseller sıralı / entity paralel"]
    CV["Kapak 1 istek"]
    PG["Sayfa görselleri:<br/>batch başına en fazla 15<br/>paralel GPT Image isteği"]
    ST --> M --> CV --> PG
  end

  U1 & U2 & U10 --> API --> ENQ --> Q
  ENQ --> RET
  Q --> W
  J1 & J2 & J3 -.-> one_job

  NOTE["Not: Aynı anda en çok 3 kitap<br/>pipeline çalışır. 7 job kuyrukta bekler.<br/>Her aktif kitapta sayfa aşamasında<br/>teorik üst sınır ~3×15 görsel API çağrısı"]
```

### Kısa yorum

- **Job:** Her kitap için Redis’te bir BullMQ job (`generate-images`); payload’da `bookId`, `characterIds`, tema vb.
- **Worker:** Tek worker süreci, **eşzamanlı en fazla 3 job** (`concurrency: 3`).
- **GPT Image paralelliği:** Kitaplar arası değil, **tek kitap içinde** sayfa üretiminde batch başına **15 paralel** istek (`image-pipeline.ts`, `BATCH_SIZE = 15`).
- **Debug / pre-generated story:** `route.ts` içinde bu fast path atlanıp uzun senkron yol kullanılabilir; prod varsayılanı yukarıdaki gibi.
