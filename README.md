# abdurrahmanyesilyurt.com

Kişisel CV sitesi. [Astro](https://astro.build) + Tailwind CSS ile yazılmış statik bir site; Vercel'de ücretsiz barınır.

- `/` → Türkçe, `/en/` → İngilizce
- Açık / koyu tema, Ctrl+P ile tek sayfalık PDF CV çıktısı
- Fontlar build sırasında indirilip siteyle birlikte sunulur (çalışma anında Google'a istek gitmez)

## Geliştirme

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ klasörüne statik çıktı
npx astro check  # tip kontrolü
```

## İçeriği güncelleme

Tüm CV içeriği tek dosyada: [`src/data/cv.ts`](src/data/cv.ts). Deneyim, proje, yetenek, eğitim ve iletişim bilgilerini buradan düzenle; iki dildeki metinler yan yana durur. Arayüz metinleri (menü, başlıklar) [`src/i18n/ui.ts`](src/i18n/ui.ts) içinde.

`projects` dizisine proje eklediğinde "Projeler" bölümü kendiliğinden görünür.

## Yayına alma (Vercel)

1. Kodu GitHub'a gönder.
2. [vercel.com](https://vercel.com) → **Add New → Project** → bu repoyu seç → **Deploy**. Astro otomatik tanınır, ek ayar gerekmez.
3. Proje → **Settings → Domains** → `abdurrahmanyesilyurt.com` ve `www.abdurrahmanyesilyurt.com` ekle. Vercel'in gösterdiği DNS kayıtlarını (A ve CNAME) domain firmasının panelinde gir.

Bundan sonra `main` dalına her push otomatik olarak yayına çıkar.
