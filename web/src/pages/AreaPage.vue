<template>
  <q-page class="row justify-center">
    <div :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'" style="width: 1024px;">

      <!-- 景點介紹 -->
      <div class="row q-mt-md q-col-gutter-x-md">
        <div class="col-12 col-md-5 row justify-center">
          <!-- 影像 -->
          <q-img :src="area.image || '/src/assets/load_img_error.png'" class="img" fit="contain" />
        </div>
        <div class="col-12 col-md q-col-gutter-md q-mt-md">
          <!-- 標題 -->
          <div class="text-h3">{{ area.name }}</div>

          <!-- 音訊 -->
          <audio v-if="area.audio" :src="area.audio" controls />

          <!-- 內容 -->
          <div>{{ area.introduce }}</div>
        </div>
      </div>

      <!-- 相關作品 -->
      <div class="q-my-md row q-gutter-y-md">
        <div class="q-mr-md column col-12 col-md" style="min-height: 300px;">
          <q-card class="col">
            <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary"
              align="justify" narrow-indicator>
              <q-tab name="item1" label="經典文選" @mouseover="change_tab('item1')" />
              <q-tab name="item2" label="學生作品" @mouseover="change_tab('item2')" />
              <q-tab name="item3" label="參考文章" @mouseover="change_tab('item3')" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated swipeable>
              <!-- 經典文選 -->
              <q-tab-panel name="item1" class="q-px-none q-pt-none">
                <q-list separator>
                  <q-item clickable v-ripple v-for="item in articles.item1">
                    <q-item-section>item{{ item }}</q-item-section>
                  </q-item>
                </q-list>
                <a href="/#/area" class="q-ml-md">更多</a>
              </q-tab-panel>

              <!-- 學生作品 -->
              <q-tab-panel name="item2" class="q-px-none q-pt-none">
                <q-list separator>
                  <q-item clickable v-ripple v-for="item in articles.item2">
                    <q-item-section>item{{ item }}</q-item-section>
                  </q-item>
                </q-list>
                <a href="/#/area" class="q-ml-md">更多</a>
              </q-tab-panel>

              <!-- 參考文章 -->
              <q-tab-panel name="item3" class="q-px-none q-pt-none">
                <q-list separator>
                  <q-item clickable v-ripple v-for="item in articles.item3">
                    <q-item-section>item{{ item }}</q-item-section>
                  </q-item>
                </q-list>
                <a href="/#/area" class="q-ml-md">更多</a>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

        <!-- 地理位址 -->
        <div class="col column" style="min-height: 300px;">
          <q-card class="col q-pa-md column">
            <div class="text-h5">地理位址</div>
            <q-separator />
            <div class="col">
              <iframe class="fit"
                src="https://www.google.com/maps?q=23.023102787270403,120.22504449021335&hl=zh-TW&z=16&output=embed"
                style="border:0;" allowfullscreen loading="lazy">
              </iframe>
              <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; z-index: 10;" />
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { get_areas_info } from "src/api/AreasServices"
import { useRoute } from 'vue-router';

const route = useRoute()
const tab = ref("item1")
const area = reactive({
  id: route.params.id,
  name: '',
  audio: null,
  image: null,
  introduce: ''
})
const articles = reactive({
  item1: [],
  item2: [],
  item3: []
})

articles.item1 = Array(5).fill(0).map((_, i) => i + 1)
articles.item2 = Array(5).fill(0).map((_, i) => i + 1)
articles.item3 = Array(5).fill(0).map((_, i) => i + 1)

function change_tab(value) {
  if (tab.value != value)
    tab.value = value
}

function set_area_info(data) {
  area.name = data.name || 'title'
  area.audio = data.audio || '/src/assets/test.mp3'
  area.image = data.image || '/src/assets/load_img_error.png'
  area.introduce = data.introduce || "content"
}

onMounted(async () => {
  get_areas_info(route.params.id).then((info) => {
    info.success ? set_area_info(info.data) : alert(info.message)
  });
})

watch(() => route.params.id, async () => {
  get_areas_info(route.params.id).then((info) => {
    info.success ? set_area_info(info.data) : alert(info.message)
  });
})
</script>

<style scoped>
.img {
  max-width: 450px;
  max-height: 450px;
}
</style>
