<template>
  <q-page class="row justify-center">
    <div class="col-12 q-mt-md q-gutter-y-md" :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">

      <q-from @submit="search" class="row">
        <div class="col" />
        <q-input bg-color="white" dense rounded outlined v-model="search_text" label="search" class="col-12 col-md-3">
          <template v-slot:append>
            <q-btn type="submit" unelevated rounded dense icon="search" />
          </template>
        </q-input>
      </q-from>

      <q-list separator >
        <q-item clickable v-ripple v-for="i in num" :key="i">
          <q-item-section>
            <q-item-label class="text-h6">Item{{ i }}</q-item-label>
            <q-item-label caption>#Caption #Caption</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

let num = Array(30).fill(0).map((_, i) => i + 1);
</script>

<style scoped></style>
