<template>
  <q-layout view="lHh Lpr lFf">
    <q-header id="header" bordered class="bg-white text-black">
      <Nav />
    </q-header>

    <q-drawer v-model="isDrawerOpen" show-if-above bordered>
      <EssentialLink />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import EssentialLink from 'components/EssentialLink.vue'
import Nav from 'components/Nav.vue'
import { storeToRefs } from 'pinia';
import { useLayoutStore } from 'stores/LayoutStore';

const { isDrawerOpen } = storeToRefs(useLayoutStore());
</script>

<style scoped>
#header {
  height: 60px;
}
</style>
