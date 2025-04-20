<template>
  <!-- <q-img src="~assets/robot_squirrel.jpg" class="absolute fit bg-img" fit="cover" /> -->
  <div class="col row q-px-md q-pb-md q-gutter-y-md">
    <!-- 網格 -->
    <div class="col-md col-12 column">
      <div class="col row no-wrap full-width justify-center" v-for="row in grid_size" :key="row">
        <!-- row, col由1開始，為配合網格資料陣列(grid_chars,cellStatus)，故-1 -->
        <q-btn :class="$q.screen.lt.md ? 'fit' : ''" class="text-box" v-for="col in grid_size" :key="col"
          :color="cellStatus[row - 1][col - 1].color" padding="none" dense
          :outline="!cellStatus[row - 1][col - 1].selected" @click="check_word_place(row - 1, col - 1)"
          :disable="cellStatus[row - 1][col - 1].selected">
          {{ grid_chars[row - 1][col - 1] }}
        </q-btn>
      </div>
    </div>

    <!-- 句子 -->
    <div class="col-md-4 col-12 column justify-center">
      <div class="q-ma-sm text-h5 text-bold" v-for="word in words">{{ word }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, defineProps } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({ datas: Object })
const grid_size = 15
// 方向
const directions = [
  { name: 'up', row_col: [-1, 0] },
  { name: 'down', row_col: [1, 0] },
  { name: 'right', row_col: [0, 1] },
  { name: 'left', row_col: [0, -1] },
  { name: 'up right', row_col: [-1, 1] },
  { name: 'up left', row_col: [-1, -1] },
  { name: 'down right', row_col: [1, 1] },
  { name: 'down left', row_col: [1, -1] },
];
// 句子
let words = props.datas.sentence || []
// 句子座標(句子放置位址)
let words_coordinate = []
// 網格文字(網格內容填充的文字)
let grid_chars = Array.from({ length: grid_size }, () => Array(grid_size).fill(''));
// 網格狀態(選取狀態)
let cellStatus = reactive(Array.from({ length: grid_size }, () => Array.from({ length: grid_size }, () => ({ selected: false, color: 'primary' }))));
// 找到句子數量
let num = 0
// 錯誤次數
let mistake_num = 0

// 取得隨機句子中隨機字元
function getRandomChar() {
  let randomWord = words[Math.floor(Math.random() * words.length)];
  let randomChar = randomWord[Math.floor(Math.random() * randomWord.length)];
  return randomChar;
}

// 檢查放置位置是否衝突，輸入參數句子(word)、座標位置(row, col)、方向(direction)
function canPlaceWord(word, row, col, direction) {
  const { row_col } = directions.find(dir => dir.name === direction);
  const [rowInc, colInc] = row_col;

  for (let i = 0; i < word.length; i++) {
    const newRow = row + i * rowInc;
    const newCol = col + i * colInc;

    // 檢查是否在範圍內
    if (
      newRow < 0 || newRow >= grid_size ||
      newCol < 0 || newCol >= grid_size ||
      grid_chars[newRow][newCol] !== ''
    ) {
      return false;
    }
  }
  return true;
}

// 放置句子至網格，輸入參數句子(word)
function place_word(word) {
  let total = 0;
  let coordinates = [];
  let row, col, direction;

  // 隨機找尋可放置句子的位置，最多執行50次
  while (total < 50) {
    row = Math.floor(Math.random() * grid_size);
    col = Math.floor(Math.random() * grid_size);
    direction = directions[Math.floor(Math.random() * directions.length)];
    if (canPlaceWord(word, row, col, direction.name)) break;
    total++;
  }
  if (total >= 50) {
    console.error('無法放置句子');
    confirm('多次放置句子失敗，是否重新整理頁面？') ? router.go(0) : router.replace('/games');
    return;
  };

  // 放置句子，並記錄座標
  const [rowInc, colInc] = direction.row_col;
  word.split('').forEach((text) => {
    grid_chars[row][col] = text;
    coordinates.push({ row: row, col: col });
    row += rowInc;
    col += colInc;
  });
  words_coordinate.push(coordinates);
}

// 放置句子至網格
words.forEach((word) => place_word(word))

// 填充網格文字
grid_chars.forEach(
  (arr, row) => arr.forEach(
    (text, col) => {
      if (!text) grid_chars[row][col] = getRandomChar()
    }
  )
)

// 檢查選取區塊是否為句子放置區塊
function check_word_place(row, col) {
  const sentence = words_coordinate.find(word =>
    word.some(coordinate => coordinate.row === row && coordinate.col === col)
  );

  // 選取區塊為句子放置區塊，顯示為綠色，否則為紅色
  if (sentence) {
    sentence.forEach((word_coordinate) => {
      cellStatus[word_coordinate.row][word_coordinate.col].color = 'green'
      cellStatus[word_coordinate.row][word_coordinate.col].selected = true
    })
    num++
    // 找到所有句子，顯示提示訊息(延遲顯示，避免alert被覆蓋)
    if (num === words.length) setTimeout(() => {alert(`已找到所有句子\n\n錯誤次數：${mistake_num}`)}, 100)
  }
  else {
    cellStatus[row][col].color = 'red'
    cellStatus[row][col].selected = true
    mistake_num++
  }
}

</script>

<style scoped>
.text-box {
  aspect-ratio: 1;
  font-size: calc(1em + 1vmin);
}

.bg-img {
  z-index: -1;
  opacity: .1;
}
</style>
