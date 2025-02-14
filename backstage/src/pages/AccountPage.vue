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

const person = reactive({
  name: '',
  account: '',
  school: '',
  group: '',
})

const add_person_rows = reactive([
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
  { name: 'name', label: '姓名', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true },
  { name: 'account', label: '帳號', align: 'left', field: 'account', sortable: true },
  { name: 'school', label: '學校', align: 'left', field: 'school', sortable: true },
  { name: 'group', label: '群組', align: 'left', field: 'group', sortable: true },
]

const rows = [
  { id: 1, name: 'UserA', account: '0X0X0000', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 2, name: 'UserB', account: '0X0X0001', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 3, name: 'UserC', account: '0X0X0002', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 4, name: 'UserD', account: '0X0X0003', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 5, name: 'UserE', account: '0X0X0004', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 6, name: 'UserF', account: '0X0X0005', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 7, name: 'UserG', account: '0X0X0006', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 8, name: 'UserH', account: '0X0X0007', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 9, name: 'UserI', account: '0X0X0008', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 10, name: 'UserJ', account: '0X0X0009', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 11, name: 'UserK', account: '0X0X0010', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 12, name: 'UserL', account: '0X0X0011', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 13, name: 'UserM', account: '0X0X0012', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 14, name: 'UserN', account: '0X0X0013', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 15, name: 'UserO', account: '0X0X0014', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 16, name: 'UserP', account: '0X0X0015', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 17, name: 'UserQ', account: '0X0X0016', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 18, name: 'UserR', account: '0X0X0017', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 19, name: 'UserS', account: '0X0X0018', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 20, name: 'UserT', account: '0X0X0019', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 21, name: 'UserU', account: '0X0X0020', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 22, name: 'UserV', account: '0X0X0021', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 23, name: 'UserW', account: '0X0X0022', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 24, name: 'UserX', account: '0X0X0023', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 25, name: 'UserY', account: '0X0X0024', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
  { id: 26, name: 'UserZ', account: '0X0X0025', school: { id: 1, name: '南臺科大' }, group: { id: 1, name: '資工一甲' } },
]
</script>

<style scoped>
.scroll {
  height: calc(100vh - 60px);
}
</style>
