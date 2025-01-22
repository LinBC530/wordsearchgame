<template>
  <q-page class="row justify-center">
    <div class="col-12 q-mt-md q-gutter-y-md"
      :style="$q.screen.width > 1024 ? 'max-width: 80%;' : 'max-width: 95%;'">

      <!-- 標題 -->
      <div class="text-h3 full-width q-ma-md">標題</div>

      <!-- 作者 -->
      <div class="text-h5 full-width q-ma-md">作者</div>

      <!-- 音訊 -->
      <audio src="/src/assets/test.mp3" controls />

      <div>
        content
      </div>

      <q-card>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
          narrow-indicator>
          <q-tab name="article" label="原文" />
          <q-tab name="parse" label="解析" />
        </q-tabs>

        <q-separator />

        <!-- 內容 -->
        <q-tab-panels v-model="tab" animated>
          <!-- 原始文章 -->
          <q-tab-panel name="article">
            <div class="text-h6">原文</div>
            content
          </q-tab-panel>

          <!-- 文章解析 -->
          <q-tab-panel name="parse">
            <q-expansion-item v-model="expanded.item1" label="詞" header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  content content content content content content content content content content content content content content
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-model="expanded.itme2" label="技法" header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  content content content content content content content content content content content content content content
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-model="expanded.item3" label="聲情敘事" header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  content content content content content content content content content content content content content content
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-model="expanded.item4" label="聲情句子" header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  content content content content content content content content content content content content content content
                </q-card-section>
              </q-card>
            </q-expansion-item>

            <q-expansion-item v-model="expanded.item5" label="補充註釋" header-style="font-weight: bold; font-size: 20px;">
              <q-card>
                <q-card-section>
                  content content content content content content content content content content content content content content
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>

      <q-separator />

      <div class="text-h4">學生文章</div>

      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item1</q-item-label>
            <q-item-label caption>#Caption #Caption</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item2</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item3</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item4</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label>Item5</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { ref,reactive } from 'vue'

const tab = ref('article')
const standard = ref(0)
const expanded = reactive({
  item1: false,
  itme2: false,
  item3: false,
  item4: false,
  item5: false
})
</script>

<style scoped></style>
