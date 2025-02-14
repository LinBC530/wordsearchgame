<template>
  <q-page class="row justify-center content-center">
    <div class="col-md-3 col-10 justify-center">
      <div class="q-gutter-sm">
      <div class="text-h3" align="center">文學音景</div>
      <div class="text-h5" align="center">後臺管理</div>
      </div>
      <q-form @submit="login" class="q-gutter-md">
        <div class="q-gutter-sm">
          <q-input v-model="account" label="帳號" lazy-rules :rules="[val => val && val.length > 0 || '請輸入帳號']" />
          <q-input v-model="account" label="密碼" lazy-rules :rules="[val => val && val.length > 0 || '請輸入密碼']" />
        </div>

        <div class="column justify-center content-center">
          <q-btn type="submit" color="green" unelevated>登入</q-btn>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>

</script>

<style scoped></style>
