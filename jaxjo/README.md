# JAXJO LLC — marketing site (v1)

Static one-page site for JAXJO, a local landscaping company. Built to show a weekend proposal: services, service area, merch, and a way to call or request a quote.

Live content (phone, services, merch prices, Stripe links, photos) lives in **`src/siteConfig.js`**. Change that file first.

## Stack

React + Vite + plain CSS. No router, no backend, no database. Same general approach as [jacksonelliott.netlify.app](https://jacksonelliott.netlify.app/) (React on Vite), kept simpler: one scrolling page and CSS instead of Tailwind.

## Run locally

```bash
cd jaxjo
npm install
npm run dev
```

Open http://localhost:5173

## Swap placeholder content

In `src/siteConfig.js`:

| Field | What to put |
| --- | --- |
| `phone`, `phoneHref`, `email` | Real contact info |
| `serviceArea`, `about` | Towns you actually cover and a short bio |
| `services` | Real service names and one-line descriptions |
| `merch[].image` | Paths like `/merch/hat.jpg` after dropping files in `public/merch/` |
| `merch[].buyUrl` | Stripe Payment Link (`https://buy.stripe.com/...`) |
| `merch[].price` | Real prices |
| `heroImage.src` | A yard photo, e.g. `/photos/hero.jpg` |
| `social[].href` | Facebook / Instagram URLs (hidden until filled in) |

Buy Now uses the Stripe URL when it looks like a real `http` link. Until then it points at the contact form.

## Deploy on Netlify

This folder is the app. In Netlify:

1. New site from git (or drag-and-drop the `jaxjo` folder after `npm run build`)
2. Base directory: `jaxjo` if this folder sits inside a larger repo
3. Build command: `npm run build`
4. Publish directory: `dist`

`netlify.toml` already sets command and publish. The contact form uses [Netlify Forms](https://docs.netlify.com/forms/setup/) (`name="contact"`). After the first deploy, submissions show up under **Forms** in the Netlify dashboard.

## Build

```bash
npm run build
npm run preview
```
