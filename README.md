# The Poster Room

Site dört ayrı klasörden çalışır. Her klasörde üç poster seçeneği bulunur.
Sayfa her açıldığında:

1. Her klasörden rastgele bir poster seçilir.
2. Seçilen dört poster kendi arasında rastgele sıralanır.
3. Ziyaretçi yalnızca bu dört posteri oklarla, klavyeyle veya kaydırarak gezer.

Klasör ve kategori adları ziyaretçiye gösterilmez. Sayfada aşağı-yukarı kaydırma
yoktur.

## Poster klasörleri

```text
assets/
└── posters/
    ├── klasor-1/
    │   ├── poster-1.svg
    │   ├── poster-2.svg
    │   └── poster-3.svg
    ├── klasor-2/
    │   ├── poster-1.svg
    │   ├── poster-2.svg
    │   └── poster-3.svg
    ├── klasor-3/
    │   ├── poster-1.svg
    │   ├── poster-2.svg
    │   └── poster-3.svg
    └── klasor-4/
        ├── poster-1.svg
        ├── poster-2.svg
        └── poster-3.svg
```

Şu anda bu klasörlerde örnek SVG posterler bulunmaktadır.

## Kendi görsellerini ekleme

JPG, JPEG, PNG, WebP veya SVG kullanabilirsin. Her klasöre tam olarak üç görsel
ekle.

Örnek olarak birinci klasöre şu dosyaları koyabilirsin:

```text
assets/posters/klasor-1/afis-1.jpg
assets/posters/klasor-1/afis-2.jpg
assets/posters/klasor-1/afis-3.jpg
```

Ardından `script.js` dosyasının başındaki `posterFolders` bölümünü dosya
adlarınla eşleştir:

```js
{
  path: "assets/posters/klasor-1",
  posters: [
    { id: "1-1", title: "Birinci afiş", file: "afis-1.jpg" },
    { id: "1-2", title: "İkinci afiş", file: "afis-2.jpg" },
    { id: "1-3", title: "Üçüncü afiş", file: "afis-3.jpg" },
  ],
},
```

Aynı işlemi `klasor-2`, `klasor-3` ve `klasor-4` için de yap. `file` alanı,
klasördeki dosya adı ve uzantısıyla birebir aynı olmalıdır. Büyük/küçük harf
farkı GitHub Pages üzerinde önemlidir.

GitHub Pages güvenlik nedeniyle bir klasörün içindeki dosyaları kendiliğinden
listeleyemez. Bu nedenle yeni görsel eklediğinde dosya adını `script.js`
içerisinde de belirtmen gerekir.

Örnek SVG dosyalarını kullanmayacaksan kendi dosyalarını ekledikten sonra
silebilirsin. Dosya adlarında boşluk ve Türkçe karakter kullanmamak işleri
kolaylaştırır; örneğin `proje-afisi-1.jpg` uygundur.

## Yerel önizleme

Proje klasöründe terminal açıp çalıştır:

```powershell
py -m http.server 8000
```

Sonra tarayıcıdan [http://localhost:8000](http://localhost:8000) adresini aç.

## Değişiklikleri GitHub'a gönderme

```powershell
git add .
git commit -m "Kendi posterlerimi ekle"
git push origin main
```

GitHub Pages birkaç dakika içinde güncellenir.

Canlı site:

<https://metizerjid.github.io/UNIDESBROCHURES/>

GitHub deposu:

<https://github.com/Metizerjid/UNIDESBROCHURES.git>
