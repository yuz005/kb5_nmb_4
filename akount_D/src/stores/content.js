import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useContentStore = defineStore("content", () => {
    const BASEURI = "/api/content";
    const state = reactive({ content: [] });
    const count = ref(0);

    return {};
});
