import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import VueGtag from 'vue-gtag';
import router from './router';
import App from './App.vue';

const app = createApp(App).use(router);
app.use(PrimeVue);
app.use(ToastService);
app.use(VueGtag, {
  config: { id: 'G-4G3B3HMQ1B' },
});
app.component('InputText', InputText);
app.component('Toast', Toast);

window.screen.orientation.lock('portrait');

app.mount('#app');
