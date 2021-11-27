<template>
  <Menubar ref="menuRef" :model="items" id="menu" >
    <template #start>
      <img @click="gotoHome()" alt="logo" src="/images/logo-light-whitebg-vertical.png" height="80" class="p-mr-2">
    </template>
  </Menubar>
  <div id="content">
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
    margin: 0 1rem 0.5rem 1rem;
  }

  .p-menuitem-text {
    font-size: 1.1rem;
  }

  .pi-bars {
    font-size: 1.4rem !important;
  }

  .p-menubar-button {
    right: 2rem;
    position:absolute; 
  }

  .p-menubar-root-list {
    right: 2rem;
    position:absolute; 
  }
</style>

<script setup lang="ts">
  import Menubar from 'primevue/menubar';
import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

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
