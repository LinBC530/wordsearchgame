<template>
  <q-page class="flex">
    <q-table v-if="!is_edit_article_page" class="col scroll" title="所有文章" :rows="rows" :columns="columns" row-key="name"
      :pagination="pagination" :rows-per-page-options="[]">
      <template v-slot:top-right>
        <q-toolbar class="q-gutter-md">
          <q-btn flat dense icon="add" color="green" @click="is_edit_article_page = true" />
          <q-btn flat dense icon="delete" color="red" @click="remove" />
        </q-toolbar>
      </template>
    </q-table>

    <div v-else class="col scroll row justify-center q-pa-sm">
      <div class="col-12 col-md-10">
        <q-form>
          <div class="q-mb-md row q-gutter-y-sm">
            <q-input class="col-12 col-md-8" v-model="arricle.title" label="標題" />
            <q-input class="col-12 col-md-5" v-model="arricle.auther" label="作者" />
            <div class="col-12 q-gutter-sm row">
              <q-btn flat dense size="sm" icon="add" label="tag" color="green" @click="show_tags_dialog = true" />
              <q-badge v-for="tag_id in arricle.tags" class="q-pa-xs q-gutter-x-xs text-weight-bold" color="blue"
                text-color="black" :label="tag_id" outline>
                <q-icon class="cursor-pointer" @click="console.log('click')" color="red" size="xs" name="close" />
              </q-badge>
            </div>
            <q-select class="col-12" v-model="arricle.arricle_type" label="文章類型" map-options :emit-value="true"
              :options="[{ id: 0, name: '未定義' }, { id: 1, name: '經典文選' }, { id: 2, name: '學生文章' }, { id: 3, name: '參考文章' }]"
              option-label="name" option-value="id" />
            <q-select class="col-12" v-model="arricle.attraction" label="區域" :options="['未定義']" />
            <div>內容</div>
            <q-editor class="col-12" v-model="arricle.editor" min-height="300px" />
          </div>


          <div v-if="arricle.arricle_type === 1" class="q-mb-md row q-gutter-y-xl">
            <div class="col-12">
              <div>詞</div>
              <q-editor class="col-12" v-model="arricle.editor" min-height="300px" />
            </div>
            <div class="col-12">
              <div>技法</div>
              <q-editor class="col-12" v-model="arricle.editor" min-height="300px" />
            </div>
            <div class="col-12">
              <div>聲情敘事</div>
              <q-editor class="col-12" v-model="arricle.editor" min-height="300px" />
            </div>
            <div class="col-12">
              <div>聲情句子</div>
              <q-editor class="col-12" v-model="arricle.editor" min-height="300px" />
            </div>
            <div class="col-12">
              <div>補充註釋</div>
              <q-editor class="col-12" v-model="arricle.editor" min-height="300px" />
            </div>
          </div>

          <div class="row q-gutter-sm">
            <q-btn type="submit" label="新增" color="green" @click="console.log(arricle.arricle_type)" />
            <q-btn type="reset" label="取消" color="red" @click="is_edit_article_page = false" />
          </div>
        </q-form>
      </div>

      <q-dialog v-model="show_tags_dialog" persistent>
        <q-card style="width: 400px;">
          <q-card-actions align="center" class="row">
            <q-input dense class="col-8" v-model="add_tag" label="創建新標籤" />
            <q-btn class="col-3" flat dense icon="add" label="創建" color="green" />
          </q-card-actions>

          <q-card-section>
            <q-scroll-area class="row" style="height: 300px;">
              <q-checkbox v-for="i in 100" v-model="arricle.tags" :val="i" :label="`tag${i}`" />
            </q-scroll-area>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="確認" color="green" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'

const show_tags_dialog = ref(false)
const is_edit_article_page = ref(false)

const tags = ref(Array(100).fill(0).map((_, i) => { return { id: i, name: `tag${i}` } }))

const pagination = ref({
  page: 1,
  rowsPerPage: 15
});

const add_tag = ref('')
const arricle = reactive({
  title: '',
  auther: '',
  school: '',
  arricle_type: '',
  attraction: '',
  editor: '',
  tags: []
})

const columns = [
  { name: 'title', label: '名稱', align: 'left', field: row => row.title, format: val => `${val}`, sortable: true },
  { name: 'school', label: '學校', align: 'left', field: 'school', sortable: true },
]

const rows = [
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
  { title: 'Title', auther: 'Auther', school: '南臺科大', attraction: '天圓地方' },
]
</script>

<style scoped>
.scroll {
  height: calc(100vh - 60px);
}
</style>
