# auth.users ile public.users Farkı

Veritabanında iki ayrı `users` tablosu var: **auth.users** ve **public.users**.

---

## auth.users (auth schema)

- **Nereden gelir:** Eski Supabase kurulumundan kalan **Supabase Auth** tablosu.
- **Ne işe yarar:** Supabase'in kendi kimlik sistemi (giriş, JWT, magic link vb.) bu tabloyu kullanırdı.
- **Şu an:** Proje artık **NextAuth + PostgreSQL** kullandığı için bu tabloyu **kullanmıyorsun**. Supabase'i kaldırdık; auth artık NextAuth ve `public.users` üzerinden.

---

## public.users (public schema)

- **Nereden gelir:** Uygulamanın kendi kullanıcı tablosu (migration'larla veya uygulama ile oluşturulmuş).
- **Ne işe yarar:** NextAuth Credentials provider bu tabloyu kullanır: `getUserByEmail`, `createUser`, `password_hash`, `free_cover_used` vb. Tüm uygulama mantığı (kitaplar, karakterler, siparişler) `user_id` ile buradaki kullanıcıya bağlı.
- **Şu an:** **Bunu kullanıyorsun.** Kayıt/giriş ve tüm API'ler `public.users` ile çalışıyor.

---

## Özet

| Tablo         | Schema | Kullanım                          |
|---------------|--------|------------------------------------|
| **auth.users**   | auth   | Eski Supabase Auth; projede kullanılmıyor. |
| **public.users**| public | NextAuth + uygulama; aktif kullanılan tablo. |

Yeni kullanıcılar **public.users**'a yazılıyor. `auth.users`'ı silmek zorunda değilsin; kullanmıyorsan ileride temizleyebilirsin.
