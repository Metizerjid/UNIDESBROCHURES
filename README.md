# The Poster Room

A full-screen poster viewer designed for a single shared link. Visitors see one
random poster when the page opens and can move through the collection using:

- Left/right buttons
- Keyboard arrow keys
- Touch swipe
- Mouse drag
- The position dots at the bottom

The page has no class/category labels and no vertical scrolling.

## Project files

```text
brochure-gallery/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── brochures/    Local fallback poster images
│   └── favicon.svg
└── README.md
```

## Preview locally

Run this command inside the project folder:

```powershell
py -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

## Connect your poster API

GitHub Pages is a static hosting service, so database usernames, passwords, and
private keys must never be placed in this repository. Your database should be
accessed through a public read-only API endpoint that returns the posters.

Open `script.js` and set:

```js
const POSTER_API_URL = "https://api.example.com/posters";
```

The API may return an array:

```json
[
  {
    "id": "poster-1",
    "title": "Poster title",
    "imageUrl": "https://cdn.example.com/posters/poster-1.jpg"
  }
]
```

Or an object containing a `posters` array:

```json
{
  "posters": [
    {
      "id": "poster-1",
      "title": "Poster title",
      "imageUrl": "https://cdn.example.com/posters/poster-1.jpg"
    }
  ]
}
```

Accepted image fields are `image`, `imageUrl`, `url`, or `src`. The
`title` field is optional. Class/category fields are ignored and never shown
to visitors.

The API must:

- Be accessible through HTTPS
- Allow browser requests from
  `https://metizerjid.github.io` using CORS
- Return public image URLs
- Expose only information that visitors are allowed to see

If the API URL is empty or the API cannot be reached, the viewer uses the 12
local sample posters defined in `localPosterGroups` inside `script.js`.

## Use local images instead

1. Copy poster images into `assets/brochures/`.
2. Update the matching `image` paths inside `localPosterGroups` in
   `script.js`.
3. Keep `POSTER_API_URL` empty.

Poster images are displayed with `object-fit: contain`, so portrait, landscape,
and square artwork is shown without cropping.

## First GitHub push

For a new local copy of this project, run these commands inside the project
folder:

```powershell
git init
git add .
git commit -m "Create full-screen poster viewer"
git branch -M main
git remote add origin https://github.com/Metizerjid/UNIDESBROCHURES.git
git push -u origin main
```

If the `origin` remote already exists, update it instead:

```powershell
git remote set-url origin https://github.com/Metizerjid/UNIDESBROCHURES.git
git push -u origin main
```

## GitHub Pages

In the GitHub repository, open **Settings → Pages**. Under **Build and
deployment**, select **Deploy from a branch**, then choose `main` and `/(root)`.
Save the setting. GitHub will publish the site at the live address below.

## Push future updates

```powershell
git add .
git commit -m "Update poster viewer"
git push
```

Live site:

<https://metizerjid.github.io/UNIDESBROCHURES/>
