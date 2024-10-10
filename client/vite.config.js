import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    // depending on your application, base can also be "/"
    base: './',
    plugins: [
        react(), // Enables React Fast Refresh and JSX support
        viteTsconfigPaths() // Enables support for TypeScript path mappings
    ],

    build: {
        outDir: 'dist', // Specify the output directory
    },

    server: {
        // this ensures that the browser opens upon server start
        open: true,
        port: 3000,
    },
})
