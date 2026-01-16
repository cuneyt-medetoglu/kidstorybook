# PDF Background Patterns

Bu klasör PDF generation için kullanılan arka plan desenlerini içerir.

## Mevcut Desenler

### default-pattern.svg
- **Açıklama:** Hafif, noktalı pattern. Metin okunabilirliğini korur.
- **Renkler:** Pastel tonlar (pembe, mavi, sarı, yeşil)
- **Kullanım:** Varsayılan arka plan deseni

## Gelecek İyileştirmeler

Aşağıdaki arka plan desenleri eklenebilir:
- Yıldız pattern
- Kalp pattern
- Bulut pattern
- Geometrik şekiller
- Tema bazlı desenler (deniz, orman, uzay vb.)

## Tasarım Kuralları

1. **Okunabilirlik:** Arka plan deseni metin okunabilirliğini engellememeli
2. **Opacity:** Desenlerin opacity değeri 0.2-0.4 arasında olmalı
3. **Renkler:** Pastel ve yumuşak tonlar tercih edilmeli
4. **Format:** SVG (vektörel, küçük dosya boyutu) veya PNG
5. **Boyut:** Tekrar eden pattern için 200x200px yeterli

## Kullanım

PDF generator (`lib/pdf/generator.ts`) bu klasördeki desenleri kullanır.
