import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import InputText from 'primevue/inputtext';
import App from './App.vue';
import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';
import 'primeicons/primeicons.css';
import router from './router';

const app = createApp(App).use(router);
app.use(PrimeVue);
app.component('InputText', InputText);

app.mount('#app');
