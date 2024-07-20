import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {

  if (mode === 'web') {

    return {
      plugins: [react()],
      build: {
        outDir: 'dist/web',
        lib: {
          entry: 'src/web-components/index.ts',
          name: 'WebMCGQRCodes',
          fileName: 'web-mcg-qr-codes',
        },
        rollupOptions: {
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
      },
    }
  }

  return {
    plugins: [react()],
    build: {
      outDir: 'dist/react',
    },
    base: '/mcg-qr-codes/'
  }
})
