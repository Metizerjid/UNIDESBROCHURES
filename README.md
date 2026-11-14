# The Poster Room — 3 QR Yapısı

Site artık üç farklı QR bağlantısıyla çalışır. Her bağlantı yalnızca kendisine
ait klasördeki görselleri, mevcut sağa-sola kaydırmalı carousel içinde gösterir.
Rastgele seçim tamamen kaldırılmıştır.

## QR kodlarında kullanılacak bağlantılar

### Afiş 1

```text
https://metizerjid.github.io/UNIDESBROCHURES/?afis=1
```

Bu bağlantı `assets/posters/klasor-1/` içindeki görselleri gösterir.

### Afiş 2

```text
https://metizerjid.github.io/UNIDESBROCHURES/?afis=2
```

Bu bağlantı `assets/posters/klasor-2/` içindeki görselleri gösterir.

### Afiş 3

```text
https://metizerjid.github.io/UNIDESBROCHURES/?afis=3
```

Bu bağlantı `assets/posters/klasor-3/` içindeki görselleri gösterir.

QR kodlarını oluştururken yukarıdaki bağlantıları birebir kullan.

## Görselleri ekleme

Her klasörde aşağıdaki dört dosya adı kullanılmalıdır:

```text
poster-1
poster-2
poster-3
poster-4
```

Dosya uzantısı `.jpg`, `.jpeg`, `.png`, `.webp` veya `.svg` olabilir. Örnek:

```text
assets/posters/klasor-1/poster-1.jpg
assets/posters/klasor-1/poster-2.png
assets/posters/klasor-1/poster-3.webp
assets/posters/klasor-1/poster-4.svg
```

Site dosya uzantısını otomatik olarak bulur. Bu standart adları kullandığında
`script.js` dosyasını tekrar değiştirmen gerekmez.

Görseller `poster-1`, `poster-2`, `poster-3`, `poster-4` sırasıyla gösterilir;
rastgele sıralama yapılmaz.

Şu anda `klasor-1`, `klasor-2` ve `klasor-3` içinde dörder görsel bulunur.

`assets/posters/klasor-4/` eski yapıdan kalmıştır ve artık QR bağlantılarında
kullanılmaz.

## Yerel önizleme

Proje klasöründe terminal açıp çalıştır:

```powershell
py -m http.server 8000
```

Ardından şu adreslerle ayrı ayrı test et:

```text
http://localhost:8000/?afis=1
http://localhost:8000/?afis=2
http://localhost:8000/?afis=3
```

## GitHub'a gönderme

```powershell
git add .
git commit -m "Poster görsellerini güncelle"
git push origin main
```

GitHub Pages birkaç dakika içinde güncellenir.

Canlı site:

<https://metizerjid.github.io/UNIDESBROCHURES/>

GitHub deposu:

<https://github.com/Metizerjid/UNIDESBROCHURES.git>
