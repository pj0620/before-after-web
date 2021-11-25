import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import ProgressPicsSearch from '../components/ProgressPicsSearch.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Progress Pics Search',
    component: ProgressPicsSearch,
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import('../components/PrivacyPolicy.vue'),
  },
  {
    path: '/contact-info',
    name: 'Contact Info',
    component: () => import('../components/ContactInfo.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
