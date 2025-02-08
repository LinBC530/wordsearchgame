const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [{ path: "", component: () => import("pages/MapPage.vue") }],
  },
  {
    path: "/login",
    component: () => import("layouts/EmptyLayout.vue"),
    children: [
      { path: "", component: () => import("pages/LoginPage.vue") },
    ],
  },
  {
    path: "/attractions",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/error" },
      { path: ":id(\\d+)", component: () => import("pages/AttractionPage.vue")},
      { path: "school/:id(\\d+)", component: () => import("pages/AttractionsPage.vue")},
    ],
  },
  {
    path: "/article",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", redirect: "/error" },
      { path: ":id(\\d+)", component: () => import("pages/ArticlePage.vue") },
      { path: "img_gen/:id(\\d+)", component: () => import("pages/ImageGenerationArticlePage.vue") },
      { path: "list", component: () => import("pages/ArticleListPage.vue") },
    ],
  },
  {
    path: "/games",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/GameListPage.vue") },
      { path: ":id(\\d+)", component: () => import("pages/GamePage.vue") },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
