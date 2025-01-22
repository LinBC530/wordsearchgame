<template>
  <q-page class="row justify-center">
    <div class="col-12 row justify-center q-gutter-md q-mt-md"
      :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">

      <q-spinner v-show="loading" color="primary" size="3em" />

      <q-card v-show="!loading" class="row justify-center col-12 col-md-5" style="max-width: 500px; max-height: 300px;"
        v-for="area in areas" :key="area">
        <q-card-section class="col-5">
          <q-img :src="area.image || '/src/assets/load_img_error.png'" class="fit" />
        </q-card-section>
        <q-card-section class="col column">
          <div class="text-h5"><span class="title" @click="goto('/area/' + area.id)">{{ area.name }}</span></div>
          <div class="column q-gutter-sm q-mt-sm">
            <div><span class="btn">經典文選</span></div>
            <div><span class="btn">學生作品</span></div>
            <div><span class="btn">參考作品</span></div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { get_school_areas_list } from "src/api/AreasServices";

const router = useRouter();
const route = useRoute();
const areas = ref([])
const loading = ref(true);

onMounted(async () => {
  get_areas_list()
  loading.value = false
})

watch(() => route.params.id, async () => {
  get_areas_list()
  loading.value = false
})

async function get_areas_list() {
  loading.value = true
  areas.value = await (await get_school_areas_list(route.params.id)).data
}

function goto(path) {
  router.push(path)
}
</script>

<style scoped>
.title {
  cursor: pointer;
}

.btn {
  cursor: pointer;
  color: rgb(0, 81, 255);
  font-size: 20px;
}

.btn:hover {
  color: rgb(137, 174, 255);
}
</style>
