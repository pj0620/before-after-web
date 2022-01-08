<template>
  <Menubar ref="menuRef" :model="items" id="menu" >
    <template #start>
      <img @click="gotoHome()" alt="logo" src="/images/logo-light-whitebg-vertical.png" height="80" class="p-mr-2">
    </template>
  </Menubar>
  <div id="content w-full">
    <router-view/>
  </div>
</template>

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
    margin: ;
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
</style>

<script setup lang="ts">
  import Menubar from 'primevue/menubar';
  import { computed, ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { provide } from 'vue';
import { SearchParams } from './models';

  const router = useRouter();

  const pageOffset = ref<number>(0);
  const lastSearchParams = ref<Partial<SearchParams>>({});
  const lastClickedPost = ref<number>(-1);

  // store users last search for going back to search page
  provide('pageOffset', pageOffset);
  provide('lastSearchParams', lastSearchParams);
  provide('lastClickedPost', lastClickedPost);

  provide('setPageOffset', (offset:number) => pageOffset.value = offset);
  provide('setLastSearchParams', (searchParams:Partial<SearchParams>) => lastSearchParams.value = searchParams);
  provide('setLastClickedPost', (lastId:number) => lastClickedPost.value = lastId);

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

  watch(menuRef, (currentValue, oldValue) => {
    console.log(menuRef.value);
  });
</script>
