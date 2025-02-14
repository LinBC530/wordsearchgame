<template>
  <q-list>
    <q-item-label header>
      <div class="text-h5 text-bold text-center text-primary">文學音景</div>
      <div class="text-bold text-center text-primary">後臺管理</div>
    </q-item-label>

    <q-separator spaced />

    <q-item clickable v-ripple @click="goto('/')">
      <q-item-section avatar>
        <q-icon name="group" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-bold">帳戶管理</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable tv-ripple @click="goto('/article')">
      <q-item-section avatar>
        <q-icon name="article" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-bold">文章管理</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="goto('/attraction')">
      <q-item-section avatar>
        <q-icon name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-bold">景點管理</q-item-label>
      </q-item-section>
    </q-item>

    <q-item clickable v-ripple @click="goto('/game')">
      <q-item-section avatar>
        <q-icon name="sports_esports" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-bold">遊戲管理</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function goto(path) {
  router.push(path)
}
</script>
