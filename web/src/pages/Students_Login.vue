<template>
  <q-page class="row justify-center content-center">
    <div id="card" class="col justify-center">
      <h3 align="center">文學音景</h3>
      <q-form @submit="login" class="q-gutter-md">
        <div>
          <q-input v-model="account" label="帳號" lazy-rules :rules="[val => val && val.length > 0 || '請輸入帳號']" />
        </div>

        <div class="column justify-center content-center q-gutter-md">
          <q-btn type="submit" color="green" unelevated>進入</q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { login_account } from 'src/api/AccountService';
import { useAccountStore } from 'src/stores/Account';
import { useRouter, useRoute } from "vue-router";

const { set_account } = useAccountStore()
const router = useRouter();
const route = useRoute();
const account = ref('')

async function login() {
  const login = account.value ? await login_account(account.value) : alert("請輸入帳號")
  if (login.success) {
    const { id, school_number, name } = login.data
    // 暫時儲存使用者資訊
    set_account(id, school_number, name)
    router.push(route.query.redirect || '/')
  } else {
    alert(login.message)
  }
}
</script>

<style scoped>
#card {
  padding: 30px;
  max-width: 350px;
  user-select: none;
}
</style>
