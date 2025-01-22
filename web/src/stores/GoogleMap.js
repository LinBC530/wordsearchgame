import { defineStore } from "pinia";

export const useGoogleMapStore = defineStore("GoogleMapStore", {
  state: () => ({
    stust: { lat: 23.02351883925394, lng: 120.22440539210869 },
    nutn: { lat: 22.98406451445394, lng: 120.20779990000004 },
    google_map: null,
    markers: null,
    cam_is_incline: false,
    areaCoordinates: [
      [
        // 覆蓋區域邊界座標
        // 南台科大
        { lat: 23.025686, lng: 120.222245 },
        { lat: 23.025692, lng: 120.223693 },
        { lat: 23.025774, lng: 120.223894 },
        { lat: 23.025789, lng: 120.224569 },
        { lat: 23.025559, lng: 120.224567 },
        { lat: 23.025475, lng: 120.224779 },
        { lat: 23.025702, lng: 120.224977 },
        { lat: 23.025698, lng: 120.225462 },
        { lat: 23.02566, lng: 120.225531 },
        { lat: 23.025656, lng: 120.225874 },
        { lat: 23.025559, lng: 120.226121 },
        { lat: 23.025574, lng: 120.226504 },
        { lat: 23.02532, lng: 120.226734 },
        { lat: 23.025247, lng: 120.22673 },
        { lat: 23.025063, lng: 120.226863 },
        { lat: 23.024547, lng: 120.226219 },
        { lat: 23.02444, lng: 120.225882 },
        { lat: 23.023447, lng: 120.226252 },
        { lat: 23.023439, lng: 120.226637 },
        { lat: 23.023144, lng: 120.226753 },
        { lat: 23.023011, lng: 120.226427 },
        { lat: 23.022806, lng: 120.226162 },
        { lat: 23.021786, lng: 120.226592 },
        { lat: 23.02164, lng: 120.226366 },
        { lat: 23.020796, lng: 120.225264 },
        { lat: 23.020691, lng: 120.225161 },
        { lat: 23.020754, lng: 120.22499 },
        { lat: 23.020781, lng: 120.224807 },
        { lat: 23.020767, lng: 120.224622 },
        { lat: 23.022258, lng: 120.224248 },
        { lat: 23.022267, lng: 120.224546 },
        { lat: 23.02232, lng: 120.224678 },
        { lat: 23.022458, lng: 120.224651 },
        { lat: 23.022568, lng: 120.224526 },
        { lat: 23.022586, lng: 120.224428 },
        { lat: 23.022622, lng: 120.224369 },
        { lat: 23.0226, lng: 120.224302 },
        { lat: 23.023033, lng: 120.223549 },
        { lat: 23.023181, lng: 120.223626 },
        { lat: 23.023367, lng: 120.223678 },
        { lat: 23.023603, lng: 120.223674 },
        { lat: 23.02371, lng: 120.223634 },
        { lat: 23.024097, lng: 120.223161 },
        { lat: 23.023979, lng: 120.222965 },
        { lat: 23.023874, lng: 120.222979 },
        { lat: 23.023818, lng: 120.22275 },
        { lat: 23.023947, lng: 120.222603 },
        { lat: 23.024021, lng: 120.222432 },
        { lat: 23.02403, lng: 120.222403 },
        { lat: 23.024046, lng: 120.222187 },
        { lat: 23.025045, lng: 120.222052 },
        { lat: 23.025059, lng: 120.222259 },
        { lat: 23.025689, lng: 120.222241 },
      ],
      [
        // 台南大學
        { lat: 22.985558, lng: 120.205941 },
        { lat: 22.985196, lng: 120.208034 },
        { lat: 22.985183, lng: 120.208231 },
        { lat: 22.985272, lng: 120.208253 },
        { lat: 22.985509, lng: 120.208268 },
        { lat: 22.985527, lng: 120.208227 },
        { lat: 22.986209, lng: 120.20836 },
        { lat: 22.986129, lng: 120.20981 },
        { lat: 22.986065, lng: 120.209908 },
        { lat: 22.984956, lng: 120.21089 },
        { lat: 22.984759, lng: 120.211003 },
        { lat: 22.984684, lng: 120.211002 },
        { lat: 22.98442, lng: 120.210403 },
        { lat: 22.984298, lng: 120.210275 },
        { lat: 22.984097, lng: 120.21015 },
        { lat: 22.984064, lng: 120.210062 },
        { lat: 22.984364, lng: 120.209683 },
        { lat: 22.984752, lng: 120.208917 },
        { lat: 22.982816, lng: 120.208531 },
        { lat: 22.982584, lng: 120.208444 },
        { lat: 22.982593, lng: 120.207034 },
        { lat: 22.981869, lng: 120.207014 },
        { lat: 22.981948, lng: 120.205872 },
        { lat: 22.982543, lng: 120.205937 },
        { lat: 22.982646, lng: 120.205893 },
        { lat: 22.984243, lng: 120.206119 },
        { lat: 22.984443, lng: 120.205865 },
        { lat: 22.98495, lng: 120.205812 },
        { lat: 22.984987, lng: 120.205781 },
        { lat: 22.985536, lng: 120.205905 },
        { lat: 22.985557, lng: 120.205941 },
      ],
    ],
  }),
  getters: {},
  actions: {
    set_markers_info_cache(marker_info) {
      this.markers_info_cache.push(marker_info);
    },
    get_marker_info_cache(marker_id) {
      return this.markers_info_cache.find(
        (marker_info) => marker_info.marker_id === 2
      );
    },
    get_areaCoordinates() {
      return this.areaCoordinates;
    },
    set_google_map(map) {
      this.google_map = map;
    },
    set_makers(markers) {
      this.markers = markers;
    },
    get_markers() {
      return this.markers;
    },
    get_stust_latlng() {
      return this.stust;
    },
    get_nutn_latlng() {
      return this.nutn;
    },
    // 接受傳入對應字串使用預設南臺科大及台南大學經緯度資料，或自訂json格式的經緯度資料 { lat, lng }
    change_map_focus(latlng) {
      this.google_map.setCenter(
        latlng === "stust"
          ? this.stust
          : latlng === "nutn"
          ? this.nutn
          : { lat: latlng.lat, lng: latlng.lng }
      );
      this.google_map.setZoom(17);
    },
    // 切換地圖視角
    move_camera() {
      !this.cam_is_incline
        ? this.google_map.moveCamera({
            heading: 30,
            tilt: 50,
          })
        : this.google_map.moveCamera({
            heading: 0,
            tilt: 0,
          });
      this.cam_is_incline = !this.cam_is_incline;
    },
  },
});
