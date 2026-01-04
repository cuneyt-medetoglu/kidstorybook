# 🌿 Git Branching Stratejisi

## Branch Yapısı

### Ana Branch'ler
- **main** - Production kod (Vercel'de deploy edilir)
- **develop** - Development kod (test için staging)
- **feature/** - Yeni özellikler için feature branch'leri

### Branch Naming Convention

```
feature/      - Yeni özellikler (feature/auth-system)
bugfix/       - Bug düzeltmeleri (bugfix/login-error)
hotfix/       - Acil production düzeltmeleri (hotfix/payment-issue)
docs/         - Dokümantasyon (docs/update-readme)
refactor/     - Kod refactoring (refactor/api-structure)
```

## Workflow

### 1. Yeni Özellik Geliştirme
```bash
# develop'tan yeni branch oluştur
git checkout develop
git pull origin develop
git checkout -b feature/yeni-ozellik

# Geliştirme yap, commit'le
git add .
git commit -m "feat: yeni özellik eklendi"

# Push et
git push origin feature/yeni-ozellik

# Pull Request aç (feature/yeni-ozellik → develop)
```

### 2. Bug Fix
```bash
git checkout develop
git checkout -b bugfix/hata-aciklamasi
# Fix yap
git commit -m "fix: hata düzeltildi"
git push origin bugfix/hata-aciklamasi
```

### 3. Production'a Deploy
```bash
# develop test edildi ve hazır
git checkout main
git merge develop
git push origin main
# Vercel otomatik deploy eder
```

## Commit Message Convention

Türkçe, açıklayıcı commit mesajları:

```
feat: yeni özellik eklendi
fix: bug düzeltildi
docs: dokümantasyon güncellendi
style: kod formatı düzenlendi
refactor: kod yeniden düzenlendi
test: test eklendi/güncellendi
chore: bakım işleri (dependency update vb.)
```

### Örnekler
```
feat: kullanıcı kayıt sistemi eklendi
fix: login form validasyon hatası düzeltildi
docs: ROADMAP güncellendi
refactor: API klasör yapısı yeniden düzenlendi
chore: next.js 14'e güncellendi
```

## Pull Request Kuralları

1. **Her özellik ayrı PR olmalı** (küçük PR'lar tercih edilir)
2. **PR description detaylı olmalı** (ne yapıldı, neden yapıldı)
3. **Test edilmiş olmalı** (elle test edildi mi?)
4. **Conflict çözülmüş olmalı**
5. **Review bekleyin** (tek kişi projeyse self-review)

## Vercel Deploy Stratejisi

| Branch | Vercel Ortamı | URL |
|--------|---------------|-----|
| main | Production | kidstorybook.vercel.app |
| develop | Staging | kidstorybook-dev.vercel.app |
| feature/* | Preview | kidstorybook-pr-{id}.vercel.app |

## Git Ignore

`.gitignore` dosyası şunları kapsamalı:
- node_modules/
- .next/
- .env*.local
- build/
- dist/

---

**Not:** Küçük değişiklikler için direkt develop'a commit atılabilir. Büyük özellikler için mutlaka feature branch kullan.

