<template>
  <q-toolbar class="q-pa-none bg-white text-black" style="height: 100%; min-height: 0">
    <q-btn v-show="$q.screen.lt.md" @click="drawer_switch" flat stretch icon="menu" aria-label="Menu" style="height: 100%; min-height: 0" />

    <q-tabs v-model="tab" shrink style="height: 100%; min-height: 0">
      <q-tab name="tab1" label="南臺科大" />
      <q-tab name="tab2" label="台南大學" />
    </q-tabs>
  </q-toolbar>
</template>

<script setup>
import { ref } from 'vue'
import { useLayoutStore } from 'stores/LayoutStore';

const tab = ref('tab1')
const { drawer_switch } = useLayoutStore();

</script>

<style scoped></style>
