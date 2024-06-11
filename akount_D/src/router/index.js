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
        { path: "/write", name: "Write", component: Write },
        { path: "/summary", name: "Summary", component: Summary },
        { path: "/profile", name: "Profile", component: Profile },
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
    ],
});

export default router;
