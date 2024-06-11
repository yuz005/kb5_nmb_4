import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import axios from "axios";

export const useContentStore = defineStore("contentList", () => {
    const BASEURI = "/api/content";
    const state = reactive({ contentList: [] });

    const fetchContent = async () => {
        try {
            const response = await axios.get(BASEURI);
            if (response.status === 200) {
                state.contentList = response.data; // 변수명 일치하도록 수정
            } else {
                alert("데이터 조회 실패");
            }
        } catch (error) {
            alert("에러발생:" + error);
        }
    };

    const contentList = computed(() => state.contentList);

    return { state, contentList, fetchContent };
});
