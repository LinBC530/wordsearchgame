<template>
  <q-page class="flex">
    <!-- 表格 -->
    <q-table v-if="!is_add_person_page" class="col scroll" title="所有帳戶" :rows="rows" :columns="columns" row-key="name" :pagination="pagination" :rows-per-page-options="[]"
      @row-click="edit_row_data">
      <template v-slot:top-right>
        <q-toolbar class="q-gutter-md">
          <q-btn flat dense icon="add" color="green" @click="is_add_person_page = true" />
          <q-btn flat dense icon="delete" color="red" />
        </q-toolbar>
      </template>
      <template v-slot:body-cell-school="props">
        <q-td :props="props">
          <q-truncate :max-lines="1">{{ props.value.name }}</q-truncate>
        </q-td>
      </template>
      <template v-slot:body-cell-group="props">
        <q-td :props="props">
          <q-truncate :max-lines="1">{{ props.value.name }}</q-truncate>
        </q-td>
      </template>
    </q-table>

    <!-- 新增人員 -->
    <div v-else class="col scroll row justify-center q-pa-md">
      <div class="col-12 col-md-6">
        <div class="q-gutter-md">
          <q-btn flat dense icon="add" color="green" label="新增人員" />
          <q-btn flat dense icon="add" color="blue" label="匯入" />
        </div>
        <q-form class="q-gutter-md">
          <div class="q-my-xl row q-gutter-sm" v-for="i in 10">
            <div class="col">人員 1</div>
            <q-btn class="col-1" flat dense icon="delete" color="red" />
            <q-input class="col-12" v-model="name" label="姓名" />
            <q-input class="col-12" v-model="account" label="學號" />
            <q-select class="col" v-model="school" label="學校" :options="['未定義', '南臺科大', '台南大學']" />
            <q-select class="col" v-model="group" label="群組" :options="['未定義', '資工一甲', '資工二甲']" />
          </div>
          <div class="row q-gutter-sm">
            <q-btn type="submit" label="新增" color="green" />
            <q-btn type="reset" label="取消" color="red" @click="is_add_person_page = false" />
          </div>
        </q-form>
      </div>
    </div>

    <q-dialog v-model="show_edit_dialog" persistent>
      <q-card style="width: 400px;">
        <q-card-section class="row">
          <q-form @submit="submit" class="col row q-gutter-md">
            <q-input class="col-12" v-model="person.name" label="姓名" />
            <q-input class="col-12" v-model="person.account" label="學號" />
            <q-select class="col" v-model="person.school" label="學校" :options="['未定義', '南臺科大', '台南大學']" />
            <q-select class="col" v-model="person.group" label="群組" :options="['未定義', '資工一甲', '資工二甲']" />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="red" v-close-popup />
          <q-btn flat label="確認" color="green" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { reactive, ref } from 'vue'

const is_add_person_page = ref(false)
const show_edit_dialog = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 15
});

const game = reactive({
  title: '',
  account: '',
  school: '',
  group: '',
})

const add_game_rows = reactive([
  {
    name: 'UserA',
    account: '0X0X0000',
    school: '南臺科大',
    group: '資工一甲',
  }
])

function edit_row_data(event, row) {
  show_edit_dialog.value = true
  const index = rows.findIndex(r => r.id === row.id)
  console.log({ index: index, row: row})
}

const columns = [
  { name: 'title', label: '標題', align: 'left', field: row => row.title, format: val => `${val}`, sortable: true },
  { name: 'group', label: '群組', align: 'left', field: 'group', sortable: true },
]

const rows = [
  { id: 1, title: 'titleA', group: {id: 1 ,name:'groupA'} },
  { id: 2, title: 'titleB', group: {id: 2 ,name:'groupB'} },
  { id: 3, title: 'titleC', group: {id: 3 ,name:'groupC'} },
  { id: 4, title: 'titleD', group: {id: 4 ,name:'groupD'} },
  { id: 5, title: 'titleE', group: {id: 5 ,name:'groupE'} },
  { id: 6, title: 'titleF', group: {id: 6 ,name:'groupF'} },
  { id: 7, title: 'titleG', group: {id: 7 ,name:'groupG'} },
  { id: 8, title: 'titleH', group: {id: 8 ,name:'groupH'} },
  { id: 9, title: 'titleI', group: {id: 9 ,name:'groupI'} },
  { id: 10, title: 'titleJ', group: {id: 10 ,name:'groupJ'} },
  { id: 11, title: 'titleK', group: {id: 11 ,name:'groupK'} },
  { id: 12, title: 'titleL', group: {id: 12 ,name:'groupL'} },
  { id: 13, title: 'titleM', group: {id: 13 ,name:'groupM'} },
  { id: 14, title: 'titleN', group: {id: 14 ,name:'groupN'} },
  { id: 15, title: 'titleO', group: {id: 15 ,name:'groupO'} },
  { id: 16, title: 'titleP', group: {id: 16 ,name:'groupP'} },
  { id: 17, title: 'titleQ', group: {id: 17 ,name:'groupQ'} },
  { id: 18, title: 'titleR', group: {id: 18 ,name:'groupR'} },
  { id: 19, title: 'titleS', group: {id: 19 ,name:'groupS'} },
  { id: 20, title: 'titleT', group: {id: 20 ,name:'groupT'} },
]
</script>

<style scoped>
.scroll {
  height: calc(100vh - 60px);
}
</style>
