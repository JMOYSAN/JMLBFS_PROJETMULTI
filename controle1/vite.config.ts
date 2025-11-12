import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test' ? undefined : {},
    }),
  ],

  // ✅ Add rollup injection for Buffer and process.env
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [
        inject({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
      ],
    },
  },

  // ✅ Resolve Node polyfills cleanly
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
    },
  },

  // ✅ Avoid undefined process/env at runtime
  define: {
    'process.env': {},
  },
})
