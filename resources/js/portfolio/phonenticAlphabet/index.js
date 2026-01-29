import { createApp } from 'vue/dist/vue.esm-bundler.js';
import PhoneticAlphabet from './PhoneticAlphabet.vue';


const mountpoint = document.querySelector('[data-phonetic-alphabet-vue]');

if (mountpoint) {
    const app = createApp(PhoneticAlphabet);
    app.mount(mountpoint);
}