# Plans

## 1) Sıfırdan kurulum klasörü doğru mu?

**Evet.** Sıfırdan kurulum rehberi **docs/plans/** altında; proje yapısına uygun (plans = altyapı/geçiş planları).

## 2) Diğer dokümanları silebilir miyiz? İşimiz bitti mi?

- **Altyapı (Faz 1–4):** Bitti. EC2, PostgreSQL, S3 kuruldu.
- **Faz 5 (Auth alternatifi), Faz 6 (Uygulama deploy):** Henüz yapılmadı; **SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md** bu yüzden **silinmemeli**.
- **SUPABASE_TO_AWS_ANALYSIS.md**, **AWS_S3_SINGLE_BUCKET_PLAN.md**, **AWS_MIGRATIONS_ORDER.md:** İsteğe bağlı. Master rehber tek başına yeterli; detay/referans istersen tutabilirsin.

## 3) AWS (Supabase → AWS geçiş) dosyaları

**Aktif (docs/plans/):**
- **AWS_ORTAM_SIFIRDAN_KURULUM_REHBERI.md** — Tek dokümanda aynı AWS ortamını (EC2 + PostgreSQL + S3) sıfırdan kurma. Yeni hesap/bölgede **sadece bunu** kullan.
- **SUPABASE_TO_AWS_IMPLEMENTATION_PLAN.md** — Faz bazlı ilerleme (Faz 1–4 ✅; Faz 5–6 kaldı).

**Arşiv (referans için):**  
Geçiş analizi, S3 detay, migration sırası → [docs/archive/2026-02/aws-plans/](../archive/2026-02/README.md)

## Sahne / kompozisyon

Sahne/kompozisyon planları **implementation/IMAGE_QUALITY_IMPROVEMENT_PLAN.md** dosyasına taşındı.  
Tek referans: `docs/implementation/IMAGE_QUALITY_IMPROVEMENT_PLAN.md` (nasıl ilerleyeceğiz bölümü dahil).

Eski planlar: `docs/archive/` (sahne_cesitliligi_iyilestirmesi_plan.md vb.).
