<template>
  <q-toolbar class="q-pa-sm">
    <q-btn class="q-mr-sm" flat dense icon="menu" @click="menu = !menu" v-show="$q.screen.width <= 1024" />

    <div v-show="$q.screen.width > 1024">
      <q-btn size="large" flat label="首頁" @click="goto('/')" />
    </div>

    <q-space />
  </q-toolbar>

  <div class="absolute z-top" id="list" v-show="menu && $q.screen.width <= 1024">
    <q-list dark>
      <q-item clickable v-ripple.stop" @click="goto('/')">
        <q-item-section>首頁</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();
const menu = ref(false);

function goto(path) {
  menu.value = false;
  router.push(path)
}

</script>

<style scoped>
#list {
  width: 100%;
  background-color: rgba(44, 44, 44, 0.8);
}
</style>
