// Step 1: npm install gh-pages --save-dev
// Step 2: git init (if not done)
// Step 3: git remote add origin https://github.com/YOUR_USERNAME/maxrep.git
// Step 4: npm run deploy
// Step 5: Go to GitHub repo → Settings → Pages → Source: gh-pages branch
// Step 6: Site live at: https://YOUR_USERNAME.github.io/maxrep/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MAXREP/',
})
