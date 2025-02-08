<template>
  <q-page class="row justify-center">
    <div :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'" style="width: 1024px;">

      <!-- 景點介紹 -->
      <div class="row q-mt-md q-col-gutter-x-md">
        <div class="col-12 col-md-5 row justify-center">
          <!-- 影像 -->
          <q-skeleton v-if="isloading" class="q-mx-md" size="100%" animation="fade" />
          <q-img v-else :src="attraction.image || '/src/assets/load_img_error.png'" class="img" fit="contain" />
        </div>
        <div class="col-12 col-md q-col-gutter-md q-mt-md">
          <!-- 標題 -->
          <q-skeleton v-if="isloading" class="q-mx-md text-warp" height="60px" width="60%" animation="fade" />
          <div v-else class="text-h3">{{ attraction.name }}</div>

          <!-- 音訊 -->
          <q-skeleton v-if="isloading" class="q-ma-md" height="40px" width="280px" type="QChip" animation="fade" />
          <audio v-else-if="attraction.audio" :src="attraction.audio" controls />

          <!-- 內容 -->
          <q-skeleton v-if="isloading" class="q-ma-md text-warp" height="200px" width="100%" animation="fade" />
          <div v-else>{{ attraction.introduce }}</div>
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
                  <q-item v-if="isloading" clickable v-ripple v-for="i in 5">
                    <q-item-section>
                      <q-skeleton width="150px" animation="fade" />
                    </q-item-section>
                  </q-item>
                  <div v-else-if="!articles.item1 || !articles.item1.length" class="text-h6 text-italic text-center text-grey-6 non-selectable q-pa-md">No data found</div>
                  <q-item v-else clickable v-ripple v-for="item in articles.item1">
                    <q-item-section @click="goto(`/article/${item.id}`)">
                      <q-item-label class="overflow-hidden">{{ item.title }}</q-item-label>
                      <q-item-label class="q-gutter-xs overflow-hidden" caption>
                        <span v-if="item.tags.length" v-for="tag in item.tags">#{{ tag.name }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <a v-if="articles.item1 && articles.item1.length > 0"
                  :href="`/#/article/list?page=1&limit=15&attraction=${route.params.id}&article_type=1`" class="q-ml-md">更多</a>
              </q-tab-panel>

              <!-- 學生作品 -->
              <q-tab-panel name="item2" class="q-px-none q-pt-none">
                <q-list separator>
                  <q-item v-if="isloading" clickable v-ripple v-for="i in 5">
                    <q-item-section>
                      <q-skeleton width="150px" animation="fade" />
                    </q-item-section>
                  </q-item>
                  <div v-else-if="!articles.item2 || !articles.item2.length" class="text-h6 text-italic text-center text-grey-6 non-selectable q-pa-md">No data found</div>
                  <q-item v-else clickable v-ripple v-for="item in articles.item2">
                    <q-item-section @click="goto(`/article/${item.id}`)">
                      <q-item-label class="overflow-hidden">{{ item.title }}</q-item-label>
                      <q-item-label class="q-gutter-xs overflow-hidden" caption>
                        <span v-if="item.tags.length" v-for="tag in item.tags">#{{ tag.name }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <a v-if="articles.item2 && articles.item2.length > 0"
                  :href="`/#/article/list?page=1&limit=15&attraction=${route.params.id}&article_type=2`" class="q-ml-md">更多</a>
              </q-tab-panel>

              <!-- 參考文章 -->
              <q-tab-panel name="item3" class="q-px-none q-pt-none">
                <q-list separator>
                  <q-item v-if="isloading" clickable v-ripple v-for="i in 5">
                    <q-item-section>
                      <q-skeleton width="150px" animation="fade" />
                    </q-item-section>
                  </q-item>
                  <div v-else-if="!articles.item3 || !articles.item3.length" class="text-h6 text-italic text-center text-grey-6 non-selectable q-pa-md">No data found</div>
                  <q-item v-else clickable v-ripple v-for="item in articles.item3">
                    <q-item-section @click="goto(`/article/${item.id}`)">
                      <q-item-label class="overflow-hidden">{{ item.title }}</q-item-label>
                      <q-item-label class="q-gutter-xs overflow-hidden" caption>
                        <span v-if="item.tags.length" v-for="tag in item.tags">#{{ tag.name }}</span>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <a v-if="articles.item3 && articles.item3.length > 0"
                  :href="`/#/article/list?page=1&limit=15&attraction=${route.params.id}&article_type=3`" class="q-ml-md">更多</a>
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
              <q-skeleton v-if="!attraction.coordinate" size="100%" animation="fade" />
              <div v-else-if="!attraction.coordinate.lat && attraction.coordinate.lng" class="text-h6 text-italic text-center text-grey-6 non-selectable q-pa-md">Unable to get coordinates</div>
              <iframe v-else class="fit"
                :src="`https://www.google.com/maps?q=${attraction.coordinate.lat},${attraction.coordinate.lng}&hl=zh-TW&z=16&output=embed`"
                style="border:0;" allowfullscreen loading="lazy">
              </iframe>
            </div>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from 'vue';
import { get_attraction_info } from "src/api/AreasServices"
import { get_articles } from "src/api/ArticeServices"
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const tab = ref("item1")
const isloading = ref(true)

// 景點資訊
const attraction = reactive({
  id: route.params.id,
  name: '',
  audio: null,
  image: null,
  introduce: '',
  coordinate: null
})

// 相關文章列表
const articles = reactive({
  item1: null,
  item2: null,
  item3: null
})

// 切換分頁
function change_tab(value) {
  if (tab.value != value)
    tab.value = value
}

// 設定景點資訊
function set_attraction_info(data) {
  attraction.name = data.name || ''
  attraction.audio = data.audio || ''
  attraction.image = data.image || '/src/assets/load_img_error.png'
  attraction.introduce = data.introduce || ""
  attraction.coordinate = data.coordinate
}

// 重置景點資訊
function reset_attraction_info() {
  attraction.name = null
  attraction.audio = null
  attraction.image = null
  attraction.introduce = null
  attraction.coordinate = null
}

// 重置相關文章列表
function reset_articles() {
  articles.item1 = null
  articles.item2 = null
  articles.item3 = null
}

// 重置景點資訊及相關文章
function reset_attraction() {
  isloading.value = true
  reset_attraction_info()
  reset_articles()
}

// 跳轉頁面
function goto(path) {
  router.push(path)
}

// 取得景點資訊及相關文章
function set_attraction() {
  try {
    // 取得景點資訊
    get_attraction_info(route.params.id).then((info) => {
      info.success ? set_attraction_info(info.data) : console.log(info.message)
    });

    // 取得景點相關文章
    get_articles({ attraction: route.params.id, limit: 5, article_type: [1, 2, 3], page: 1 }).then((data) => {
      if (data.success) {
        articles.item1 = data.data.datas.filter((item) => item.article_type.id == 1);
        articles.item2 = data.data.datas.filter((item) => item.article_type.id == 2);
        articles.item3 = data.data.datas.filter((item) => item.article_type.id == 3);
      } else {
        console.log(data.message)
      }
    });
  } catch (err) {
    console.error(err)
  } finally {
    isloading.value = false
  }
}

onMounted(async () => {
  set_attraction()
})

watch(() => route.params.id, async () => {
  isloading.value = true
  reset_attraction()
  set_attraction()
})
</script>

<style scoped>
.img {
  max-width: 450px;
  max-height: 450px;
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
}
</style>
