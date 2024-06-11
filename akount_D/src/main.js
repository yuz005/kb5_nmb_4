import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";

// FontAwesome 설정
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse, faTree, faDog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 아이콘을 라이브러리에 추가
library.add(faHouse, faTree, faDog);

const app = createApp(App);

// FontAwesome 컴포넌트를 글로벌로 등록
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.use(router);

app.mount("#app");
