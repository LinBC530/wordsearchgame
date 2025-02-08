<template>
  <q-page class="row justify-center">
    <div class="col-12 q-mt-md q-gutter-y-md column"
      :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">
<!-- 
      <q-toolbar class="">
        <q-breadcrumbs class="">
          <q-breadcrumbs-el label="課程遊戲" />
        </q-breadcrumbs>
      </q-toolbar> -->
      <!-- 搜尋欄，關鍵字搜尋文章 -->
      <q-form class="row">
        <div class="col" />
        <q-input bg-color="white" dense rounded outlined v-model="search_text" label="search" class="col-12 col-md-3">
          <template v-slot:append>
            <q-btn type="submit" @click="search_keyword" unelevated rounded dense icon="search" />
          </template>
        </q-input>
      </q-form>

      <!-- 資料列表(載入中效果) -->
      <q-list v-if="isloading" separator>
        <q-item clickable v-ripple v-for="i in 6" :key="i">
          <q-item-section>
            <q-item-label>
              <q-skeleton height="30px" width="200px" animation="fade" />
            </q-item-label>
            <q-item-label class="row q-gutter-xs overflow-hidden" caption>
              <q-skeleton v-for="j in 3" height="18px" width="70px" animation="fade" />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- 查無資料訊息 -->
      <div v-else-if="!items.length" class="text-h5 text-italic text-center text-grey-6 non-selectable">No data found
      </div>
      <!-- 資料列表 -->
      <q-list v-else separator>
        <q-item clickable v-ripple v-for="item in items" :key="i" @click="goto_article(item.article_type.id, item.id)">
          <q-item-section>
            <q-item-label class="text-h6 overflow-hidden">{{ item.title }}</q-item-label>
            <q-item-label class="q-gutter-xs overflow-hidden" caption>
              <span v-if="item.school.id">#{{ item.school.name }}</span>
              <span v-if="item.attraction.id">#{{ item.attraction.name }}</span>
              <span v-if="item.article_type.id">#{{ item.article_type.name }}</span>
              <span v-if="item.tags.length" v-for="tag in item.tags">#{{ tag.name }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <div class="col-grow" />
      <div class="flex justify-center q-mb-md">
        <!-- 分頁切換 -->
        <q-btn-group>
          <q-btn :disable="page.current_page === 1" icon="chevron_left"
            @click="change_page(parseInt(page.current_page) - 1)" />
          <q-form @submit="change_page(parseInt(page.input_page))">
            <q-input borderless dense hide-bottom-space type="number" class="q-px-sm" min="1" :max="page.max_page"
              v-model="page.input_page" input-class="text-right" :suffix="`/${page.max_page}`"
              style="width: fit-content;" />
          </q-form>
          <q-btn :disable="page.current_page === page.max_page" icon="chevron_right"
            @click="change_page(parseInt(page.current_page) + 1)" />
        </q-btn-group>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, reactive, ref, watch } from 'vue';
import * as yup from "yup";
import { get_articles, search_keyword_articles } from 'src/api/ArticeServices';

const route = useRoute();
const router = useRouter();
const search_text = ref('')
const isloading = ref(true);

const page = reactive({
  // 輸入框輸入的頁數
  input_page: 1,
  // 當前頁數
  current_page: 1,
  // 最大頁數
  max_page: 1,
})
// 文章列表
const items = ref([]);

// 驗證查詢參數條件
const article_list_schema = yup.object().shape({
  // 所有欄位皆為必填、正整數、最小值為1
  page: yup.number().required().positive().min(1).integer(),
  limit: yup.number().required().positive().min(1).integer(),
  article_type: yup.number().min(1).integer(),
  attraction: yup.number().positive().min(1).integer(),
  tag: yup.number().positive().min(1).integer(),
  school: yup.number().positive().min(1).integer(),
  keyword: yup.string().trim().min(1).max(50),
}).unknown(true);

// 搜尋符合查詢參數條件的文章列表
async function search_query(query) {
  try {
    await article_list_schema.validate(query).then(() => {
      // 資料格式轉換，避免相同欄位通過驗證問題(如?page=1&page=2&page=3)，相同欄位保留第一個
      query = article_list_schema.cast(query)
    }).catch((err) => {
      // 修改查詢參數，設置為取得經典文選的文章列表的查詢參數 (可能產生無窮迴圈，須注意參數是否符合驗證條件)
      router.replace({ query: { page: 1, limit: 15, article_type: 1 } })
      return;
    });
    // 設置當前頁數
    page.current_page = page.input_page = query.page;
    // 取得文章列表
    if (query.keyword) {
      // 取得符合關鍵字的文章列表
      search_keyword_articles(query).then((res) => {
        console.log(res)
        const page_total = Math.ceil(res.data.total / query.limit);
        page.max_page = page_total ? page_total : 1;
        items.value = res.data.datas;
      });
      return;
    }
    else {
      // 取得文章列表
      get_articles(query).then((res) => {
        console.log(res.data)
        const page_total = Math.ceil(res.data.total / query.limit);
        console.log(page_total)
        page.max_page = page_total ? page_total : 1;
        items.value = res.data.datas;
      });
    }
  } catch (err) {
    console.error(err)
  } finally {
    isloading.value = false;
  }
}

onMounted(() => {
  // 查詢對應文章列表
  search_query(route.query);
});

// 查詢對應文章列表，當查詢參數改變時觸發
watch(() => route.query, async (query) => {
  search_query(query)
});

// 跳轉至指定路徑
function goto_article(article_type, article_id) {
  if (!article_type || !article_id) return;
  switch (article_type) {
    case 1:
    case 2:
    case 3:
      router.push(`/article/${article_id}`);
      break;
    case 4:
      router.push(`/article/img_gen/${article_id}`);
      break;
    default:
      return;
  }
}

// 切換頁數
function change_page(page_number) {
  if (page_number < 1 || page_number > page.max_page) return;
  page.current_page = page.input_page = page_number;
  router.push({ query: { ...route.query, page: page_number } });
}

// 搜尋關鍵字
function search_keyword() {
  if (!search_text.value) return;
  router.push({ query: { keyword: search_text.value, page: 1, limit: 15 } });
}
</script>

<style scoped></style>
