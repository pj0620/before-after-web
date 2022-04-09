<template>
  <Menubar ref="menuRef" :model="items" id="menu" class="mb-0" :class="{'notch-padding': addNotchPadding}">
    <template #start>
      <img 
        @click="gotoHome()" 
        alt="logo" 
        src="/images/logo.png"
        style="max-width:80vw; height: 80px; aspect-ratio: 	3352 / 890;" 
        class="ml-0"
      >
    </template>
  </Menubar>
  <div id="content w-full">
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { provide } from 'vue';
import { SearchParams } from './models';
import { Constants, Environment } from './constants';

const addNotchPadding = ref(Constants.ENV === Environment.IOS);

const router = useRouter();

const pageOffset = ref<number>(0);
const lastSearchParams = ref<Partial<SearchParams>>({});
const lastClickedPost = ref<number>(-1);
const useLbs = ref<boolean>(true);
const useFt = ref<boolean>(true);

// store users last search for going back to search page
provide('pageOffset', pageOffset);
provide('lastSearchParams', lastSearchParams);
provide('lastClickedPost', lastClickedPost);
provide('useLbs', useLbs);
provide('useFt', useFt);

provide('setPageOffset', (offset:number) => pageOffset.value = offset);
provide('setLastSearchParams', (searchParams:Partial<SearchParams>) => lastSearchParams.value = searchParams);
provide('setLastClickedPost', (lastId:number) => lastClickedPost.value = lastId);
provide('setUseLbs', (useLbsIn:boolean) => useLbs.value = useLbsIn);
provide('setUseFt', (useFtIn:boolean) => useFt.value = useFtIn);

// Refs
const menuRef = ref(null);

const items = [
  {
    label:'Home',
    icon:'pi pi-fw pi-home',
    command:() => router.push('/')
  },
  {
    label:'Contact Info',
    icon:'pi pi-fw pi-envelope',
    command:() => router.push('/contact-info')
  },
  {
    label:'Privacy Policy',
    icon:'pi pi-fw pi-lock',
    command:() => router.push('/privacy-policy')
  },
]

const gotoHome = () => router.push('/');
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#menu {
  /* background-color: var(--color-primary); */
  background-color: white;
  padding: 0.5rem 0 0.3rem 1rem;
}

#menu .p-menubar {
  width: 100%;
}

.p-menuitem-text {
  font-size: 1.1rem;
}

.pi-bars {
  font-size: 1.3rem !important;
}

.p-menubar-button {
  right: 0.2rem;
  position:absolute; 
}

.p-menubar-root-list {
  right: 2rem;
  position:absolute; 
}

.notch-padding {
  padding-top: 2.5rem !important;
}
</style>