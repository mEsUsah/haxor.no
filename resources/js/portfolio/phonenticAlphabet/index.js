import { createApp } from 'vue';
import PhoneticAlphabet from './PhoneticAlphabet.vue';


const mountpoint = document.querySelector('[data-phonetic-alphabet-vue]');

if (mountpoint) {
    const app = createApp(PhoneticAlphabet);
    app.mount(mountpoint);
}