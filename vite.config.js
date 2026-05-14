import { defineConfig } from "vite";
import vue from '@vitejs/plugin-vue'
import liveReload from 'vite-plugin-live-reload';
import dotenv from 'dotenv';
import fs from 'fs';

// https://vitejs.dev/config/
export default ({ mode }) => {
    Object.assign(process.env, dotenv.parse(fs.readFileSync(`${__dirname}/.env`)));
    const serverPort = Number(process.env.VITE_PORT_HTTP || 3000);
    const publicPort = Number(process.env.VITE_PORT_HTTPS || 3001);
    const primarySiteUrl = (process.env.PRIMARY_SITE_URL || 'https://localhost').replace(/\/$/, '');
    const origin = `${primarySiteUrl}:${publicPort}`;
    const allowedHost = new URL(primarySiteUrl).hostname;

    return defineConfig({
        plugins: [
            vue(),
            liveReload([
                __dirname + '/templates/**/*.twig',
            ]),
        ],

        resolve: {
            extensions: ['.js', '.vue', '.json'],
            alias: {
                'vue': 'vue/dist/vue.esm-bundler.js',
            },
        },

        build: {
            manifest: "manifest.json",
            outDir: 'web/dist/',
            rollupOptions: {
                input: {
                    site: './resources/js/site.js',
                    phoneticAlphabet: './resources/js/portfolio/phonenticAlphabet/index.js',
                    styles: './resources/scss/site.scss',
                },
                output: {
                    // entryFileNames: `js/site.js`,
                    // assetFileNames: `[ext]/site.[ext]`
                },
            },
        },

        server: {
            cors: {
                origin: primarySiteUrl,
            },
            allowedHosts: [allowedHost],
            host: '0.0.0.0',
            port: serverPort,
            strictPort: true, 
            hmr: {
                host: allowedHost,
                clientPort: publicPort,
                protocol: 'wss',
            },
            
            // Defines the origin of the CSS asset URLs during development
            origin: origin,
            proxy: {
                 '/resources/svg': {
                     target: 'http://localhost/resources/svg/',
                     changeOrigin: true,
                     rewrite: (path) => path.replace(/^\/resources\/svg/, ''),
                 },
             },
        },
    })
}