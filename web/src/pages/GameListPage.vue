<template>
  <q-page class="row justify-center">
    <div class="col-10 col-md-8">
      <q-card bordered class="card q-mx-auto q-my-xl" v-for="group in games_by_group" :key="i">
        <q-card-section>
          <div class="text-h5 text-bold">{{group.name}}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="q-gutter-xl">
            <q-btn flat v-for="game in group.games" @click="goto(`/games/${game.id}`)">{{game.name}}</q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
import { get_games_by_group } from "src/api/GameService";
import { onMounted, ref } from "vue";

const router = useRouter();
const games_by_group = ref([]);

onMounted(async () => {
  games_by_group.value = await (await get_games_by_group()).data
})

function goto(path) {
  router.push(path)
}
</script>

<style scoped>
.card, .nav {
  max-width: 1024px;
  min-height: 150px;
}
</style>
