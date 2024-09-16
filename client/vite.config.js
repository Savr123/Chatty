import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    // depending on your application, base can also be "/"
    base: './',
    plugins: [
        react()
    ],

    //build: {
    //    rollupOptions: {
    //        input: './src/index.jsx', // Replace with your actual path
    //    },
    //},

    server: {
        // this ensures that the browser opens upon server start
        open: true
    },
})
