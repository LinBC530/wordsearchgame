<template>
  <q-page class="column">
    <q-toolbar class="q-pa-sm">
      <q-breadcrumbs class="q-mr-sm">
        <q-breadcrumbs-el :label="game.group_name" />
        <q-breadcrumbs-el :label="game.name" />
      </q-breadcrumbs>
    </q-toolbar>

    <Suspense>
      <template #default>
        <WordSerach v-if="game.datas" :datas="game.datas" :key="route.params.id" />
      </template>
      <template #fallback class="col column">
        <div class="flex items-center justify-center q-pa-md fit col">
          <div class="text-h5 text-italic text-center text-grey-6 non-selectable">Loading...</div>
        </div>
      </template>
    </Suspense>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { watch, onMounted, ref, reactive } from 'vue';
import WordSerach from "src/components/WordSearch.vue"
import { get_game } from "src/api/GameService"

const route = useRoute();
const router = useRouter()

const game = reactive({
  id: route.params.id,
  name: null,
  datas: null,
  group_id: null,
  group_name: null,
});

function set_game_data(data) {
  console.log(data)
  game.name = data.name;
  game.datas = data.data;
  game.group_id = data.game_groups.id;
  game.group_name = data.game_groups.name;
}

function reset_game_data() {
  game.name = null;
  game.datas = null;
  game.group_id = null;
  game.group_name = null;
}

function goto(path) {
  router.push(path);
}

onMounted(async () => {
  try {
    const game_data = await get_game(route.params.id);
    if (!game_data.data) goto("/404")
    set_game_data(game_data.data);
    console.log(game.datas)
  } catch (err) {
    console.error(err);
    goto("/404")
  }
});

watch(() => route.params.id, async () => {
  reset_game_data();
  try {
    const game_data = await get_game(route.params.id);
    if (!game_data.data) goto("/404")
    set_game_data(game_data.data);
    console.log(game.datas)
  } catch (err) {
    console.error(err);
    goto("/404")
  }
});
</script>

<style scoped></style>
