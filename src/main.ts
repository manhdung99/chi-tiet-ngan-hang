import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "../src/assets/css/main.css";

const pinia = createPinia();
const app = createApp(App);

app.use(Antd);
app.use(pinia);
app.mount("#app");
