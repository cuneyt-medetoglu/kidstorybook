-- ============================================================================
-- Migration 029 — payments.user_id (sipariş sahibi ile hizalı)
--
-- Bazı ortamlarda payments tablosunda user_id zorunlu tutulmuş; kod INSERT'te
-- göndermiyordu → NOT NULL ihlali. Bu dosya sütunu ekler (yoksa), orders'dan
-- doldurur, NOT NULL yapar.
--
-- Sıra: 028b sonrası. Zaten user_id NOT NULL ise ADD COLUMN atlanır.
-- ============================================================================

ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE RESTRICT;

UPDATE payments p
SET user_id = o.user_id
FROM orders o
WHERE p.order_id = o.id
  AND p.user_id IS NULL;

-- Tüm satırlar eşleştirilebildiyse NOT NULL (aksi halde hata verir — orphan satır var demektir)
ALTER TABLE payments ALTER COLUMN user_id SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
