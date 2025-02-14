<template>
  <q-page class="row justify-center q-pb-md">
    <div class="col-12 q-mt-md q-gutter-y-md" :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">

      <!-- 標題 -->
      <q-skeleton v-if="isloading" height="60px" width="40%" animation="fade" />
      <div class="text-h3 full-width q-ma-md">{{ article.title }}</div>

      <!-- 作者 -->
      <q-skeleton v-if="isloading" height="35px" width="100px" animation="fade" />
      <div class="text-h5 full-width q-ma-md">{{ article.authers }}</div>

      <!-- 標籤 -->
      <q-skeleton v-if="isloading" height="30px" width="200px" animation="fade" />
      <div class="q-gutter-sm">
        <span class="cursor-pointer text-blue-8" v-for="tag in article.tags"
          @click="goto(`/article/list?page=1&limit=15&tag=${tag.id}`)">
          #{{ tag.name }}
        </span>
      </div>

      <!-- 音訊 -->
      <audio v-if="isloading" src="test.mp3" controls />
      <!-- <audio :src="article.audio" controls /> -->

      <!-- 原文，沒有解析時 -->
      <q-skeleton v-if="isloading" height="500px" width="100%" animation="fade" />
      <div v-else-if="!article.parse" class="text-wrap">
        {{ article.content }}
      </div>

      <!-- 原文與解析 -->
      <q-card v-else>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="article" label="原文" />
          <q-tab name="parse" label="解析" />
        </q-tabs>

        <q-separator />

        <!-- 內容 -->
        <q-tab-panels v-model="tab" animated>
          <!-- 原始文章 -->
          <q-tab-panel class="text-wrap" name="article">
            {{ article.content }}
          </q-tab-panel>

          <!-- 文章解析 -->
          <q-tab-panel class="text-wrap" name="parse">
            <q-expansion-item v-if="article.parse.word" v-model="expanded.item1" label="詞"
              header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  {{ article.parse.word }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-if="article.parse.method" v-model="expanded.item2" label="技法"
              header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  {{ article.parse.method }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-if="article.parse.emotional_narrative" v-model="expanded.item3" label="聲情敘事"
              header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  {{ article.parse.emotional_narrative }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-if="article.parse.emotional_sentences" v-model="expanded.item4" label="聲情句子"
              header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  {{ article.parse.emotional_sentences }}
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-if="article.parse.additional_notes" v-model="expanded.item5" label="補充註釋"
              header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  {{ article.parse.additional_notes }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <q-skeleton v-if="isloading" height="500px" width="100%" animation="fade" />
      <div v-else class="q-gutter-y-md">
        <q-separator />

        <div class="text-h5 text-bold">學生文章</div>

        <!-- 查無資料訊息 -->
        <div v-if="!related_artices.length" class="text-h5 text-italic text-center text-grey-6 non-selectable">No data found</div>
        <!-- 相關文章列表 -->
        <q-list v-else bordered separator>
          <q-item clickable v-ripple v-for="item in related_artices" :key="item">
            <q-item-section @click="goto(`/article/${item.id}`)">
              <q-item-label class="text-h6 overflow-hidden">{{ item.title }}</q-item-label>
              <q-item-label class="q-gutter-xs overflow-hidden" caption>
                <span v-if="item.attraction.id">#{{ item.attraction.name }}</span>
                <span v-if="item.tags.length" v-for="tag in item.tags">#{{ tag.name }}</span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { get_artice_related_artices, get_article } from 'src/api/ArticeService';
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router';

const router = useRouter()
const route = useRoute()
const isloading = ref(true)
// 文章資訊
const article = reactive({
  title: '',
  authers: '',
  audio: '',
  tags: [],
  content: '',
  parse: null,
})
// 相關文章列表
const related_artices = ref([])

// 文章與解析的tab，預設為原文
const tab = ref('article')
// 文章解析的各欄位展開與收合狀態
const expanded = reactive({
  item1: false,
  item2: false,
  item3: false,
  item4: false,
  item5: false
})

// 跳轉至指定路徑
function goto(path) {
  router.push(path)
}

// 取得文章資訊
function get_article_info() {
  try {
    get_article(route.params.id).then(res => {
      if (!res.data) {
        goto('/404')
        return;
      }
      article.title = res.data.title
      article.authers = res.data.auther
      article.tags = res.data.tags
      article.content = res.data.content
      article.audio = res.data.voice_path
      article.parse = res.data.article_parse
      console.log(article)
    })

    get_artice_related_artices(route.params.id, 5, 1).then(res => {
      console.log(res)
      related_artices.value = res.data.datas
    })
  } catch (error) {
    console.log(error)
  } finally {
    isloading.value = false
  }
}

onMounted(() => {
  get_article_info()
})

watch(() => route.params.id, () => {
  console.log("Change router by articlePage")
  get_article_info()
})

</script>

<style scoped>
.text-wrap {
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
}
</style>
