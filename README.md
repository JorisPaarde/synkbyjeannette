# SYNK by Jeanette

Een statische Astro-site met React-islands, Motion en GSAP. De vormgeving, teksten,
lettertypes en beelden zijn lokaal opgenomen op basis van de huidige website.

## Lokaal ontwikkelen

```bash
npm install
npm run dev
```

De productie-build wordt gecontroleerd met:

```bash
npm run build
npm run preview
```

## Deployen

De workflow in `.github/workflows/deploy-pages.yml` publiceert iedere push naar
`master` op GitHub Pages. Kies in GitHub bij **Settings → Pages → Source** voor
**GitHub Actions**.

Vercel en Netlify herkennen Astro rechtstreeks. Importeer daar deze repository;
het build-commando is `npm run build` en de outputmap is `dist`.

Voor het uiteindelijke domein `synkbyjeanette.com` moeten `SITE_URL`, `BASE_PATH`
en de DNS-instellingen bij de gekozen host worden aangepast.
