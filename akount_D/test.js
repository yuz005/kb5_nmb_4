import { defineStore } from "pinia";
import { reactive, computed, ref, watch } from "vue";
import axios from "axios";

const BASEURI = "http://localhost:3000"; // JSON 서버 주소
export const useContentStore = defineStore("contentList", () => {
    const state = reactive({
        contentList: [],
        categories: [], // categories 상태 추가
    });
    const currentDate = ref(new Date());
    const isLoading = ref(false);

    const fetchContent = async () => {
        isLoading.value = true;
        try {
            const response = await axios.get(`${BASEURI}/content`);
            if (response.status === 200) {
                state.contentList = response.data || [];
            } else {
                console.error("Failed to fetch data");
                alert("데이터 조회 실패");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("에러 발생:" + error);
        } finally {
            isLoading.value = false;
        }
    };

    const fetchCategories = async () => {
        isLoading.value = true;
        try {
            const response = await axios.get(`${BASEURI}/category`);
            if (response.status === 200) {
                state.categories = response.data || [];
            } else {
                console.error("Failed to fetch categories");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            isLoading.value = false;
        }
    };

    const saveContent = async (date, amount, memo) => {
        try {
            await axios.post(`${BASEURI}/content`, { date, amount, memo });
            fetchContent();
        } catch (error) {
            console.error("Error saving content:", error);
            alert("에러 발생:" + error);
        }
    };

    const deleteContent = async (id) => {
        try {
            await axios.delete(`${BASEURI}/content/${id}`);
            fetchContent();
        } catch (error) {
            console.error("Error deleting content:", error);
            alert("에러 발생:" + error);
        }
    };

    function removeTimeFromDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const filteredContentList = computed(() => {
        if (!Array.isArray(state.contentList)) {
            return [];
        }
        const startOfMonth = removeTimeFromDate(
            new Date(
                currentDate.value.getFullYear(),
                currentDate.value.getMonth(),
                1
            )
        );
        const endOfMonth = removeTimeFromDate(
            new Date(
                currentDate.value.getFullYear(),
                currentDate.value.getMonth() + 1,
                0
            )
        );
        return state.contentList.filter((item) => {
            if (!item.datetime) return false;
            const itemDate = new Date(Date.parse(item.datetime));
            if (isNaN(itemDate)) {
                console.log(`Invalid date: ${item.datetime}`);
                return false;
            }
            return itemDate >= startOfMonth && itemDate <= endOfMonth;
        });
    });

    watch(currentDate, () => {
        fetchContent();
    });

    const updateDate = (newDate) => {
        currentDate.value = newDate;
    };

    return {
        state,
        fetchContent,
        fetchCategories,
        saveContent,
        deleteContent,
        filteredContentList,
        currentDate,
        updateDate,
        isLoading,
    };
});
