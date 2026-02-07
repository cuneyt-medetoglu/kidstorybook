# auth Schema'yı Silmek (Supabase Artığı)

Proje artık **NextAuth + public.users** kullandığı için **auth** schema'sı (Supabase Auth kalıntısı) kullanılmıyor. İstersen silebilirsin.

---

## Silmeden önce

1. **Yedek al:** Önemli veri varsa (auth.users'da hâlâ kayıtlar olabilir) export al veya en azından silmeden önce bir kez kontrol et.
2. **Bağlantı kontrolü:** Hiçbir uygulama veya trigger'ın `auth.users` veya `auth` schema'sına referans vermediğinden emin ol. Bu projede referans yok.

---

## "must be owner of schema auth" hatası

Bu hata, bağlandığın kullanıcının (örn. `kidstorybook`) **auth** schema'sının sahibi olmamasından kaynaklanır. Auth schema'nın sahibi genelde **postgres** süper kullanıcısıdır. Bu yüzden silme işlemini **postgres** ile yapman gerekir.

---

## Nasıl silinir?

### Seçenek 1: EC2'de postgres ile (önerilen)

```bash
sudo -u postgres psql -d kidstorybook -c "DROP SCHEMA IF EXISTS auth CASCADE;"
```

### Seçenek 2: DBeaver'da postgres kullanıcısı ile

Username: **postgres**, sonra SQL Editor'de: `DROP SCHEMA IF EXISTS auth CASCADE;`

### Seçenek 3: kidstorybook kullanıcısına yetki vermek

postgres ile: `ALTER SCHEMA auth OWNER TO kidstorybook;` sonra DBeaver'da kidstorybook ile silinebilir.

---

## Sadece auth.users tablosunu silmek

```sql
DROP TABLE IF EXISTS auth.users CASCADE;
```

(postgres kullanıcısı gerekir.)
