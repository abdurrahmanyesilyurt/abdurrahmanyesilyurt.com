---
title: Statik bir sitede A+ güvenlik notu
description: "Bu sitenin Mozilla Observatory'de 140 puanla A+ almasını sağlayan ayarlar: 'unsafe-inline' olmadan CSP, Vercel'de güvenlik başlıkları ve bunları CI'da koruyan kontrol."
date: 2026-09-11
tags: [güvenlik, astro, vercel]
translationKey: a-plus-security
---

Statik bir site yapınca "güvenlik başlıklarına ne gerek var?" diye düşünmek kolay: veritabanı yok, form yok, kullanıcı girişi yok. Ama tarayıcıya neyi yükleyip neyi yükleyemeyeceğini söyleyen başlıklar, ileride yapılabilecek bir hatanın etkisini baştan sınırlıyor. Üstelik bir backend geliştiricinin kendi sitesi, bu işi nasıl yaptığını gösterebileceği ilk yer.

Bu yazıda sitemin [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/analyze?host=www.abdurrahmanyesilyurt.com)'de **A+ (140/100)**, securityheaders.com'da da **A+** almasını sağlayan ayarları anlatıyorum. Site Astro ile yazıldı, Vercel'de barınıyor ve kaynak kodu [GitHub'da](https://github.com/abdurrahmanyesilyurt/abdurrahmanyesilyurt.com) açık.

## Hedef: `'unsafe-inline'` olmayan bir CSP

İçerik Güvenlik Politikası (CSP), tarayıcıya script, stil, font ve görselleri hangi kaynaktan yükleyebileceğini söyler. Bu sitenin politikası şu:

```text
default-src 'none'; script-src 'self'; style-src 'self';
img-src 'self' data:; font-src 'self'; connect-src 'self';
base-uri 'none'; form-action 'none'; frame-ancestors 'none';
upgrade-insecure-requests
```

`default-src 'none'` her şeyi varsayılan olarak yasaklıyor; ardından sadece gerçekten kullanılan türlere kendi alan adımdan izin veriyorum. Asıl önemli olan `'unsafe-inline'` olmaması: sayfaya bir şekilde bir `<script>` enjekte edilse bile tarayıcı onu çalıştırmıyor.

Bunun bedeli, sayfada **hiç satır içi kod kalmaması** gerekmesi. Bu sitede bunun dört kaynağı vardı:

1. **Tema script'i.** Açık/koyu tema tercihinin sayfa boyanmadan önce uygulanması için genelde `<head>` içine küçük bir satır içi script konur. Onu `public/site.js` dosyasına taşıdım ve `<script src="/site.js">` ile yüklüyorum. Aynı dosya tema ve PDF düğmelerinin tıklamalarını da olay delegasyonuyla dinliyor.
2. **Font tanımları.** Astro'nun font bileşeni `@font-face` kurallarını satır içi bir `<style>` olarak basıyordu. Fontları Fontsource paketlerinden içe aktardım; kurallar artık paketlenmiş CSS dosyasının içinde.
3. **`style=""` öznitelikleri.** Animasyon gecikmeleri için kullandığım `style="--i: 3"` gibi öznitelikleri Tailwind'in keyfi özellik sınıflarıyla (`[--i:3]`) değiştirdim; değer CSS dosyasına yazılıyor.
4. **Stil basan araçlar.** Kod renklendirmede Shiki her token için satır içi stil üretiyor. Bu blogda Prism kullanıyorum, çünkü yalnızca sınıf adı basıyor. Proje kartlarındaki QR kodlar da build sırasında tek bir SVG `path` olarak üretiliyor.

`<script type="application/ld+json">` ile eklenen yapısal veri bir istisna: çalıştırılmayan bir veri bloğu olduğu için CSP'ye takılmıyor.

## Diğer başlıklar

Başlıkların hepsi `vercel.json` içinde tanımlı:

```json
{ "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains" },
{ "key": "X-Content-Type-Options", "value": "nosniff" },
{ "key": "X-Frame-Options", "value": "DENY" },
{ "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
{ "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
{ "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
{ "key": "Cross-Origin-Resource-Policy", "value": "same-origin" }
```

- **HSTS**, tarayıcıya siteye iki yıl boyunca yalnızca HTTPS ile gelmesini söyler.
- **`X-Frame-Options: DENY`** ve CSP'deki `frame-ancestors 'none'`, sitenin başka bir sayfada çerçeve içinde açılmasını (clickjacking) engeller.
- **`nosniff`**, tarayıcının dosya türünü tahmin etmeye çalışmasını kapatır.
- **Referrer-Policy**, başka sitelere giden linklerde tam adresi değil, yalnızca alan adını paylaşır.
- **Permissions-Policy**, kamera, mikrofon ve konum gibi özellikleri bu sayfa için tamamen kapatır.

## Regresyona karşı: CI'da CSP kontrolü

Katı bir CSP'nin en büyük riski, bir gün farkında olmadan satır içi bir `style=""` eklemek ve canlıda bir şeyin sessizce bozulması. Bunu önlemek için build çıktısını tarayan küçük bir script yazdım (`scripts/check-csp.mjs`). Her HTML dosyasında satır içi `<script>`, `<style>`, `style` özniteliği, `on*=` olay işleyicisi ve `javascript:` linki arıyor; bulursa build'i kırıyor:

```js
const rules = [
  { name: 'inline <script>', pattern: /<script\b(?![^>]*\bsrc=)(?![^>]*\btype=["']?application\/(?:ld\+)?json)[^>]*>/gi },
  { name: 'inline <style>', pattern: /<style\b[^>]*>/gi },
  { name: 'style attribute', pattern: /<[^>]+\sstyle=["'][^>]*>/gi },
  { name: 'inline event handler', pattern: /<[^>]+\son[a-z]+=["'][^>]*>/gi },
];
```

GitHub Actions her push'ta tip kontrolünü, build'i ve bu kontrolü çalıştırıyor. Yanlışlıkla eklenen satır içi bir kod böylece canlıya çıkmadan yakalanıyor.

## Deponun kendisi

Güvenlik yalnızca HTTP başlıklarından ibaret değil. Depoda şunlar da açık:

- Dependabot sürüm ve güvenlik güncellemeleri,
- CodeQL kod taraması, gizli anahtar taraması ve push koruması,
- commit SHA'sına sabitlenmiş GitHub Actions ve salt okunur bir workflow token'ı,
- `SECURITY.md` ve `/.well-known/security.txt` ile özel güvenlik açığı bildirimi.

## Sonuç

Statik bir sitede A+ almak zor değil. Asıl iş, satır içi kodu sistematik olarak sayfadan çıkarmak ve bunu bir kontrolle kalıcı hâle getirmek. Kendi sitenizi [Mozilla Observatory](https://developer.mozilla.org/en-US/observatory/) ile tarayıp nereden başlayacağınızı görebilirsiniz.
