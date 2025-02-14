<template>
  <q-page class="row justify-center">
    <div class="col-12 row justify-center q-gutter-md q-mt-md"
      :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">

      <q-spinner v-show="isloading" color="primary" size="3em" />

      <q-card v-show="!isloading" class="row justify-center col-12 col-md-5"
        style="max-width: 500px; max-height: 300px;" v-for="attraction in attractions" :key="attraction">
        <q-card-section class="col-5">
          <q-img :src="attraction.image_path || 'load_img_error.png'" class="fit" fit="contain" style="max-height: 200px" />
        </q-card-section>
        <q-card-section class="col column">
          <div class="text-h5"><span class="title" @click="goto('/attractions/' + attraction.id)">{{ attraction.name }}</span></div>
          <div class="column q-gutter-sm q-mt-sm">
            <div><span class="btn" @click="goto(`/article/list?page=1&limit=15&school=${route.params.id}&attraction=${attraction.id}&article_type=1`)">經典文選</span></div>
            <div><span class="btn" @click="goto(`/article/list?page=1&limit=15&school=${route.params.id}&attraction=${attraction.id}&article_type=2`)">學生作品</span></div>
            <div><span class="btn" @click="goto(`/article/list?page=1&limit=15&school=${route.params.id}&attraction=${attraction.id}&article_type=3`)">參考作品</span></div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { get_school_attraction_list } from "src/api/AttractionService";

const router = useRouter();
const route = useRoute();
const attractions = ref([])
const isloading = ref(true);

onMounted(async () => {
  get_attraction_list()
  isloading.value = false
})

watch(() => route.params.id, async () => {
  isloading.value = true
  get_attraction_list()
  isloading.value = false
})

// 取得學校景點列表
async function get_attraction_list() {
  try {
    attractions.value = await (await get_school_attraction_list(route.params.id)).data
  } catch (error) {
    console.error(error)
  } finally {
    isloading.value = false
  }
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
