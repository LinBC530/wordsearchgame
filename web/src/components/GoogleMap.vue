<template>
  <!-- 自訂義google地圖 -->
  <div class="col" ref="map" />

  <!-- 景點資訊卡(彈出式) -->
  <q-dialog v-model="alert">
    <q-card class="fit">
      <q-scroll-area class="fit">
        <q-card-section align="right" class="q-pa-none q-pt-md q-px-md">
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-card flat>
            <!-- 景點圖片 -->
            <q-card-section align="center">
              <div><q-img :src="article.img" style="max-width: 450px;" />
              </div>
            </q-card-section>

            <!-- 景點名稱 -->
            <q-card-section class="q-py-none q-pt-sm" align="center">
              <div class="text-h5">{{ article.title }}</div>
            </q-card-section>

            <!-- 景點介紹 -->
            <q-card-section class="q-pt-none">
              <p>{{ article.content }}</p>
            </q-card-section>

            <!-- 景點頁面連結 -->
            <q-card-section class="q-pt-none">
              <div class="row justify-center"><q-btn color="green" style="width: 80%;">更多</q-btn></div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader"
import { useGoogleMapStore } from "src/stores/GoogleMap"
import { get_markers_latlng, get_marker_info } from "src/api/MapService"

const { get_areaCoordinates, set_google_map, get_markers, get_stust_latlng, get_nutn_latlng } = useGoogleMapStore()
const map = ref();
const alert = ref(false)

// 檢測是否關閉景點資訊卡，若是則重置景點資訊內容
watch(alert, () => { if (!alert.value) reset_article() })

// 區域卡內容
const article = reactive({ title: '', content: '', img: '' })

// 重置景點資訊內容
function reset_article() {
  article.content = '';
  article.title = '';
  article.img = '';
}

// 設定景點資訊內容
function set_article(title, content, img) {
  article.title = title;
  article.content = content || '無介紹內容';
  article.img = img || 'src/assets/load_img_error.png';
}

// 顯示景點資訊
async function show_area_info(area_id) {
  alert.value = true
  const { introduce, name, image } = await get_marker_info(area_id)
  set_article(name, introduce, image)
}

onMounted(async () => {
  const markers = get_markers() || (await get_markers_latlng());
  const loader = new Loader({ apiKey: "" });
  const { AdvancedMarkerElement } = await loader.importLibrary("marker");
  const { Map, Polygon } = await loader.importLibrary("maps");


  // 加入自訂google地圖
  function initMap() {
    const google_map = new Map(map.value, {
      center: get_stust_latlng(),
      zoom: 17,
      disableDefaultUI: true,
      zoomControl: true,
      mapId: "",
    });

    // 將google地圖物件加入至狀態管理
    set_google_map(google_map);

    // 加入自訂標記點
    console.log('markers', markers)
    markers.forEach(({ id, name, coordinate }) => create_marker(google_map, coordinate.lat, coordinate.lng, name, id))

    // 加入自訂區域
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

  // 在地圖新增標記
  function create_marker(map, lat, lng, title, area_id) {
    // 新增自訂的標記元素
    const markerContent = document.createElement('div');
    markerContent.className = 'custom-marker';
    markerContent.style.textAlign = 'center';

    // 新增圖片元素
    const icon = document.createElement('img');
    icon.className = 'marker-icon';
    icon.src = '/src/assets/location.png';
    icon.width = 40;
    icon.height = 40;

    // 新增文字元素
    const text = document.createElement('div');
    text.className = 'marker-text';
    text.textContent = title;
    text.style.fontSize = '14px';
    text.style.backgroundColor = 'rgb(200, 200, 200)';
    text.style.borderRadius = '100px';
    text.style.padding = '3px 6px';

    // 加入圖片及文字至標記元素
    markerContent.appendChild(text);
    markerContent.appendChild(icon);

    // 新增標記至地圖
    const marker = new AdvancedMarkerElement({
      map: map,
      position: { lat: lat, lng: lng },
      content: markerContent,
    });

    // 對標記新增點擊事件
    marker.addListener("click", () => show_area_info(area_id));
  }

  initMap();

})

</script>

<style scoped>
.marker-text {
  background-color: grey;
  border-radius: 30px;
}
</style>
