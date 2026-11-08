# The Brochure Room

A complete static brochure gallery with four classes, three brochures per
class, and twelve brochures total. It is ready for GitHub Pages and does not
need a build step, package manager, or framework.

## What is included

- Four class sections with three brochure cards in each section
- Three cards side by side on desktop, two on tablet, and a swipeable single
  card view on mobile
- Previous/next arrow controls, keyboard arrow support, touch swipe, and mouse
  drag support
- Random brochure order on every page load, plus a **Shuffle brochures** button
- Accessible headings, focus styles, labels, reduced-motion support, and a skip
  link
- Twelve clearly labeled sample SVG cover images
- A clearly marked PDF folder and one-line PDF paths in `script.js`
- No external dependencies, fonts, trackers, or network requests

## Project structure

```text
brochure-gallery/
├── index.html                 Page structure and visible text
├── styles.css                 Colors, layout, cards, and responsive design
├── script.js                  Brochure content, randomization, and carousel behavior
├── .nojekyll                  Keeps GitHub Pages publishing simple
├── assets/
│   ├── favicon.svg
│   ├── brochures/             Replaceable cover-image placeholders
│   └── pdfs/                  Put your brochure PDFs here
└── README.md                  This guide
```

## Preview the website locally

The simplest option is to double-click `index.html`. For a more accurate local
preview, open PowerShell or a terminal in this folder and run:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). Stop the preview with
`Ctrl+C` in the terminal.

If `python` is not recognized on Windows, try:

```powershell
py -m http.server 8000
```

## Customize the brochures

### 1. Change a title, description, or page count

Open `script.js`. The editable `brochureClasses` list is at the very top. Each
brochure looks like this:

```js
{
  id: "01",
  kicker: "Patterns & play",
  title: "Numbers in Nature",
  description: "Your brochure summary goes here.",
  pages: "12 pages",
  image: "assets/brochures/01-numbers-in-nature.svg",
  pdf: "",
}
```

Edit the text between quotation marks. Keep three brochure objects inside each
class to preserve the requested 4 × 3 layout.

### 2. Replace a cover image

Either:

1. Replace an SVG file inside `assets/brochures/` and keep its current filename;
   or
2. Add a JPG, PNG, WebP, or SVG image and update that brochure's `image` path in
   `script.js`.

Portrait artwork around a 3:4 ratio and at least 900 px wide works best. Keep
important words near the center because the gallery card uses a landscape crop.

### 3. Add a PDF

1. Copy the PDF into `assets/pdfs/`, for example:
   `assets/pdfs/numbers-in-nature.pdf`.
2. Find that brochure in `script.js`.
3. Change its empty PDF value to the matching path:

```js
pdf: "assets/pdfs/numbers-in-nature.pdf",
```

The **Add your PDF** placeholder automatically becomes an **Open brochure PDF**
link. Repeat for each brochure you want visitors to open.

### 4. Rename the four classes

Update the visible class names in `index.html`. The internal keys
`class-one`, `class-two`, `class-three`, and `class-four` connect the page to the
data in `script.js`; keep those keys unchanged unless you update them in both
files.

### 5. Change colors and branding

Open `styles.css` and edit the variables at the top:

```css
:root {
  --ink: #183247;
  --paper: #f7f1e7;
  --coral: #ee6f57;
  --sky: #c8e6e8;
}
```

Change **The Brochure Room** and its subtitle in the header and footer of
`index.html` to use your organization or school name.

## Create a GitHub repository and push with Git

First, create an empty repository on [GitHub](https://github.com/new). Do not add
a README, license, or `.gitignore` on GitHub because this project already has
those files. Copy the repository URL, then run the following commands from this
project folder.

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` in the URL before running the
`git remote add` command.

```powershell
git init
git add .
git commit -m "Create responsive brochure gallery"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

If Git asks you to sign in, complete GitHub's browser sign-in or use a GitHub
personal access token instead of a password.

### Push future updates

After changing brochures, images, or PDFs, run:

```powershell
git add .
git commit -m "Update brochure collection"
git push
```

## Deploy with GitHub Pages

After the first push:

1. Open your repository on GitHub.
2. Select **Settings**.
3. Select **Pages** in the left sidebar.
4. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
5. Choose the `main` branch and the `/(root)` folder.
6. Select **Save**.

GitHub will publish the site at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

The first deployment can take a few minutes. The **Pages** screen will show the
live link when it is ready. Future pushes to `main` will redeploy automatically.

## Quick pre-publish checklist

- Replace all twelve placeholder cover images.
- Add the intended PDF files and update their `pdf` paths.
- Check every PDF link in a private/incognito browser window.
- Test the site at phone and desktop widths.
- Replace the site title, introductory text, and class labels.
- Confirm you have permission to publish every brochure and image.

## Browser support

The site works in current versions of Chrome, Edge, Firefox, and Safari. If
JavaScript is disabled, the page framing still loads, but brochure cards and
carousel controls require JavaScript.
