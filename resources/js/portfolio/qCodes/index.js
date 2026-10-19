import { createApp } from 'vue';
import QCodes from './QCodes.vue';

const mountpoint = document.querySelector('[data-qcodes-vue]');

if (mountpoint) {
    const app = createApp(QCodes);
    app.mount(mountpoint);
}
