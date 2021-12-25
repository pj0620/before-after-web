import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import ProgressPicsSearch from '../components/search-page/ProgressPicsSearch.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Progress Pics Search',
    component: ProgressPicsSearch,
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    component: () => import('../components/info-pages/PrivacyPolicy.vue'),
  },
  {
    path: '/contact-info',
    name: 'Contact Info',
    component: () => import('../components/info-pages/ContactInfo.vue'),
  },
  {
    path: '/post/:id',
    name: 'Before After Picture',
    component: () => import('../components/post-details/SinglePost.vue'),
    props: true
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
