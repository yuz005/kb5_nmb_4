import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/Home.vue";
import Write from "@/pages/Write.vue";
import Summary from "@/pages/Summary.vue";
import Profile from "@/pages/Profile.vue";
import NotFound from "@/pages/NotFound.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: "/", name: "home", component: Home },
        { path: "/Write", name: "Write", component: About },
        { path: "/Summary", name: "Summary", component: TodoList },
        { path: "/Profile", name: "Profile", component: TodoList },
        { path: "/:paths(.*)*", name: "NotFound", component: NotFound },
    ],
});

export default router;
