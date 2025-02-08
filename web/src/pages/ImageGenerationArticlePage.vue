<template>
  <q-page class="row justify-center q-pb-md">
    <div class="col-12 q-mt-md column q-gutter-md" :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">
      <q-skeleton v-if="isloading" height="60px" width="250px" animation="fade" />
      <div v-else class="text-h3 full-width q-ma-md text-wrap">
        {{ article.title }}
      </div>

      <q-skeleton v-if="isloading" height="500px" width="100%" animation="fade" />
      <!-- 圖像輪播(手動) -->
      <q-carousel v-else class="full-width carousel" v-model="slide" transition-prev="slide-right" transition-next="slide-left"
        animated swipeable arrows navigation control-color="black">
        <q-carousel-slide :name="'img' + i" v-for="(image, i) in article.images" :key="i">
          <q-img class="fit" :src="image || '/src/assets/load_img_error.png'" fit="contain" />
        </q-carousel-slide>

      </q-carousel>
      <!-- 內容 -->
      <q-skeleton v-if="isloading" height="500px" width="100%" animation="fade" />
      <div v-else class="text-wrap">{{ article.content }}</div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { get_article } from 'src/api/ArticeServices'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isloading = ref(true)
const slide = ref('img1')
const article = reactive({
  title: '',
  content: '',
  images: [],
})

function set_article(data) {
  article.title = data.title
  article.content = data.content
  article.images = data.images
}

function reset_article() {
  article.title = ''
  article.content = ''
  article.images = []
}

onMounted(() => {
  get_article(route.params.id).then((res) => {
    console.log(res)
    if (!res.data) {
      router.push('/404')
      return
    }
    set_article(res.data)
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    isloading.value = false
  })
})

watch(() => route.params.id, () => {
  isloading.value = true
  reset_article()
  get_article(route.params.id).then((res) => {
    if (!res.data) {
      router.push('/404')
      return
    }
    set_article(res.data)
  }).catch((err) => {
    console.log(err)
  }).finally(() => {
    isloading.value = false
  })
})

</script>

<style scoped>
.carousel {
  max-height: 500px;
  min-height: 200px;
  height: auto;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
}
</style>
