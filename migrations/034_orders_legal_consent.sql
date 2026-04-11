-- ============================================================================
-- Migration 034 — orders tablosuna yasal onay alanları
--
-- Türk tüketici hukuku gereği (TKHK + Mesafeli Sözleşmeler Yönetmeliği):
--   - Ön Bilgilendirme Formu (ÖBF) onayı kaydedilmeli
--   - Mesafeli Satış Sözleşmesi (MSS) onayı kaydedilmeli
--   - Dijital ürün cayma hakkı feragatı kaydedilmeli
--   - Hangi sözleşme versiyonuyla onay verildiği saklanmalı
--
-- Sadece TR locale siparişleri için doldurulur (nullable).
-- Global siparişler için bu alanlar NULL kalır.
-- ============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS preliminary_info_accepted_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS contract_accepted_at          TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS digital_waiver_accepted       BOOLEAN     DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS contract_version              VARCHAR(20);

COMMENT ON COLUMN orders.preliminary_info_accepted_at IS
  'Ön Bilgilendirme Formu (ÖBF) onay zamanı — TR locale siparişler için zorunlu';

COMMENT ON COLUMN orders.contract_accepted_at IS
  'Mesafeli Satış Sözleşmesi (MSS) onay zamanı — TR locale siparişler için zorunlu';

COMMENT ON COLUMN orders.digital_waiver_accepted IS
  'Dijital ürün cayma hakkı feragatı onayı (Mesafeli Sözleşmeler Yönetmeliği Md. 15/1-ğ)';

COMMENT ON COLUMN orders.contract_version IS
  'Onaylanan sözleşme versiyonu (örn: "1.1") — ileride belge güncellendiğinde hangi versiyonun onaylandığını takip eder';
