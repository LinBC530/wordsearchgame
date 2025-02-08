<template>
  <q-page class="column">
    <!-- 自訂義google地圖 -->
    <div class="col" ref="map" />

    <!-- 景點資訊卡(彈出式) -->
    <q-dialog v-model="alert">
      <q-card class="fit">
        <q-card-section align="right" class="q-pa-none q-pt-md q-px-md">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-card flat>
            <!-- 景點圖片 -->
            <q-card-section align="center">
              <div>
                <q-skeleton v-if="isloading" height="450px" width="450px" animation="fade" />
                <q-img v-else :src="article.img || 'src/assets/load_img_error.png'" fit="contain"
                  style="max-width: 450px; max-height: 500px" />
              </div>
            </q-card-section>

            <!-- 景點名稱 -->
            <q-card-section class="q-py-none q-pt-sm" align="center">
              <q-skeleton v-if="isloading" height="35px" width="200px" animation="fade" />
              <div v-else class="text-h5 overflow-hidden">{{ article.title }}</div>
            </q-card-section>

            <!-- 景點介紹 -->
            <q-card-section class="q-pt-none q-pt-sm">
              <q-skeleton v-if="isloading" height="150px" width="100%" animation="fade" />
              <div v-else class="overflow-hidden">{{ article.content
                }}
              </div>
            </q-card-section>

            <!-- 景點頁面連結 -->
            <q-card-section class="q-pt-none">
              <div class="row justify-center"><q-btn color="green" style="width: 80%;"
                  @click="goto(`/attractions/${article.id}`)">更多</q-btn></div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div class="absolute q-ma-xs q-gutter-sm">
      <q-btn-group push>
        <q-btn color="white" text-color="black" label="南台科大" @click="change_map_focus('stust')" />
        <q-btn color="white" text-color="black" label="台南大學" @click="change_map_focus('nutn')" />
      </q-btn-group>
      <q-btn color="white" text-color="black" label="視角" @click="move_camera()" />
    </div>
  </q-page>
</template>

<script setup>
import { useGoogleMapStore } from "src/stores/GoogleMap"
import { ref, onMounted, reactive, watch } from "vue"
import { Loader } from "@googlemaps/js-api-loader"
import { get_all_coordinate, get_attractions_card_info } from "src/api/MapService"
import { useRouter } from "vue-router"

// 引入路由
const router = useRouter()
// 引入狀態管理
const { get_areaCoordinates, set_google_map, get_markers, get_stust_latlng, change_map_focus, move_camera } = useGoogleMapStore()
// 地圖元素
const map = ref();
// 是否顯示景點資訊卡
const alert = ref(false)
// 是否載入中(景點資訊卡)
const isloading = ref(true)

// 檢測是否關閉景點資訊卡，若是則重置景點資訊內容
watch(alert, () => { if (!alert.value) reset_article() })

// 區域卡內容
const article = reactive({ id: null, title: null, content: null, img: null })

// 重置景點資訊內容
function reset_article() {
  article.id = null;
  article.content = null;
  article.title = null;
  article.img = null;
  isloading.value = true;
}

// 設定景點資訊內容
function set_article(id, title, content, img) {
  article.id = id;
  article.title = title;
  article.content = content;
  article.img = img;
  isloading.value = false;
}

// 顯示景點資訊
async function show_area_info(area_id) {
  alert.value = true
  const { id, introduce, name, image } = await get_attractions_card_info(area_id)
  set_article(id, name, introduce, image)
}

// 跳轉至指定路徑
function goto(path) {
  router.push(path)
}

onMounted(async () => {
  // 取得所有標記點
  const markers = get_markers() || (await get_all_coordinate());
  // 載入google map javascript api服務
  const loader = new Loader({ apiKey: process.env.GOOGLE_MAP_API_KEY });
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const { Map, Polygon } = await loader.importLibrary("maps");


  // 加入自訂google地圖
  function initMap() {
    const google_map = new Map(map.value, {
      center: get_stust_latlng(),
      zoom: 17,
      disableDefaultUI: true,
      zoomControl: true,
      mapId: process.env.GOOGLE_MAP_ID,
    });

    // 將google地圖物件加入至狀態管理
    set_google_map(google_map);

    // 加入自訂標記點
    markers.forEach(({ id, name, coordinate }) => create_marker(google_map, coordinate.lat, coordinate.lng, name, id))

    // 加入自訂區域(校園範圍)
    const areaPolygon = new Polygon({
      map: google_map,
      paths: get_areaCoordinates(),
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeWeight: 2,
      fillOpacity: 0,
      clickable: false
    });

  }

  // 新增地圖標記點
  function create_marker(map, lat, lng, title, area_id) {
    // 新增自訂的標記元素
    const markerContent = document.createElement('div');
    markerContent.className = 'custom-marker';
    markerContent.style.textAlign = 'center';

    // 創建圖片元素(標記點)
    const icon = document.createElement('img');
    icon.className = 'marker-icon';
    icon.src = '/src/assets/location.png';
    icon.width = 40;
    icon.height = 40;

    // 創建文字元素(景點名稱)
    const text = document.createElement('div');
    text.className = 'marker-text';
    text.textContent = title;
    text.style.fontSize = '14px';
    text.style.backgroundColor = 'rgb(200, 200, 200)';
    text.style.borderRadius = '100px';
    text.style.padding = '3px 6px';

    // 加入圖片及文字至自訂的標記元素
    markerContent.appendChild(text);
    markerContent.appendChild(icon);

    // 新增標記至地圖
    const marker = new AdvancedMarkerElement({
      map: map,
      position: { lat: lat, lng: lng },
      content: markerContent,
    });

    // 對標記建立點擊事件(顯示自訂景點資訊)
    marker.addListener("click", () => show_area_info(area_id));
  }

  // 初始化地圖
  initMap();

})
</script>

<style scoped>
.card {
  max-width: 500px;
  width: 100%;
  height: 100%;
}

.marker-text {
  background-color: grey;
  border-radius: 30px;
}
</style>
