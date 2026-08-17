import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://synkbyjeanette.com',
  base,
  trailingSlash: 'always',
  output: 'static',
  integrations: [react()],
});
