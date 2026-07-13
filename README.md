# 🍹 Cheers O Bar – Menu v2

Digital menu for **Cheers O Bar**, Viseu, Portugal.

Built with **React + TypeScript + Vite**.

## ✨ Features

- 🌐 **Bilingual** — Português (PT-PT) and American English, language saved on device
- ⭐ **Highlights section** — curated featured items at the top
- 🔍 **Live search** — searches name, description and category in the active language
- 🖼️ **Photo modal** — tap any item to open a full modal with large image, description and price
- 🏷️ **Badges** — Best Seller, New, Recommended, Sold Out (per item)
- 👻 **Hide items** — set `available: false` on any item to instantly hide it from the menu
- 📱 **Mobile-first dark UI** — premium dark theme, safe-area aware
- 📸 **Instagram link** — footer button to `@cheers_o_bar`
- 📍 **Directions** — footer button opens Waze navigation to the bar

## 🛠️ Setup

```bash
npm install
npm run dev
```

## ➕ How to add a photo to an item

In `src/data.ts`, find the item and paste an image URL in the `image` field:

```ts
{
  id: 'cock-moj',
  name: { en: 'Mojito', pt: 'Mojito' },
  ...
  image: 'https://example.com/mojito.jpg', // ← paste URL here
}
```

## 🏷️ How to set a badge

```ts
badge: 'bestseller' | 'new' | 'recommended' | 'soldout'
```

## ⭐ How to feature an item in Highlights

```ts
featured: true
```

## 👻 How to hide an item

```ts
available: false
```

## 🔧 Tech Stack

- React 18
- TypeScript 5
- Vite 4
- No external UI libraries — 100% custom CSS-in-JS

---

> Rua Engenheiro Beirão do Carmo 84, Viseu 🇵🇹  
> [instagram.com/cheers_o_bar](https://www.instagram.com/cheers_o_bar/)
