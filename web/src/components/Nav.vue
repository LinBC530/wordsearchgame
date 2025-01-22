<template>
  <q-toolbar class="q-pa-sm">
    <q-btn class="q-mr-sm" flat dense icon="menu" @click="menu = !menu" v-show="$q.screen.width <= 1024" />

    <div v-show="$q.screen.width > 1024">
      <q-btn size="large" flat label="地圖" @click="goto('/')" />
      <q-btn size="large" flat label="南臺景觀" @click="goto('/areas/1')" />
      <q-btn size="large" flat label="南大景觀" @click="goto('/areas/2')" />
      <q-btn size="large" flat label="經典文選" @click="goto()" />
      <q-btn size="large" flat label="學生作品" @click="goto()" />
      <q-btn size="large" flat label="參考作品" @click="goto()" />
      <q-btn size="large" flat label="課程遊戲" @click="goto()" />
    </div>

    <q-space />

    <q-avatar class="q-ml-sm cursor-pointer" color="black" text-color="white" icon="person">
      <q-menu>
        <q-list style="min-width: 100px">
          <q-separator />
          <q-item clickable v-close-popup @click="logout">
            <q-item-section>登出</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-avatar>
  </q-toolbar>

  <div class="absolute z-top" id="list" v-show="menu && $q.screen.width <= 1024">
    <q-list dark>
      <q-item clickable v-ripple" @click="goto('/areas/1')">
        <q-item-section>南臺景觀</q-item-section>
      </q-item>
      <q-item clickable v-ripple" @click="goto('/areas/1')">
        <q-item-section>南大景觀</q-item-section>
      </q-item>
      <q-item clickable v-ripple" @click="goto()">
        <q-item-section>經典文選</q-item-section>
      </q-item>
      <q-item clickable v-ripple" @click="goto()">
        <q-item-section>學生作品</q-item-section>
      </q-item>
      <q-item clickable v-ripple" @click="goto()">
        <q-item-section>參考作品</q-item-section>
      </q-item>
      <q-item clickable v-ripple" @click="goto()">
        <q-item-section>課程遊戲</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { useAccountStore } from 'src/stores/Account';

const accountStore = useAccountStore();
const router = useRouter();
const menu = ref(false);

function goto(path) {
  router.push(path)
}

function logout() {
  accountStore.$reset();
  router.push('/login');
}
</script>

<style scoped>
#list {
  width: 100%;
  background-color: rgba(44, 44, 44, 0.8);
}
</style>
