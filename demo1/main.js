const APP = {
  setup() {
    return {
    }
  },
};
// 1. 引入组件：Home,About
// 2. 定义一些路由
const routes = [
  { path: "/", component: Home },
  { path: "/about/:num", component: About },
];

// 3. 创建路由实例并传递 `routes` 配置
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
});

// 4. 创建并挂载根实例
const app = Vue.createApp(APP);
//确保 _use_ 路由实例使整个应用支持路由。
app.use(router);
app.mount("#app");