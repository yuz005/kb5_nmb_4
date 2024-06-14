import { defineStore } from "pinia";
import { reactive, computed, ref, watch } from "vue";
import axios from "axios";

const BASEURI = "http://3.38.169.77:3000"; // JSON 서버 주소

export const useMainStore = defineStore("main", () => {
    const profile = reactive({
        nickname: "",
        account_id: "",
        email: "",
        phone_number: "",
        balance: 0,
    });

    const transactions = reactive([]);
    const categories = reactive([]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${BASEURI}/profile`);
            if (response.status === 200) {
                const profileData = response.data;
                if (profileData) {
                    if (profileData[0]) {
                        Object.assign(profile, profileData[0]);
                    }
                } else {
                    console.error("Profile not found");
                }
            } else {
                console.error(
                    "Failed to fetch profile. Status:",
                    response.status
                );
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    const saveProfile = async () => {
        try {
            const response = await axios.put(`${BASEURI}/profile/1`, profile);
            if (response.status === 200) {
                alert("프로필이 성공적으로 저장되었습니다.");
            } else {
                alert("프로필 저장에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("프로필 저장에 실패했습니다.");
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`${BASEURI}/transactions`);
            transactions.splice(0, transactions.length, ...response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASEURI}/categories`);
            categories.splice(0, categories.length, ...response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchAllData = async () => {
        try {
            await fetchProfile();
            await fetchTransactions();
            await fetchCategories();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const addTransaction = (transaction) => {
        transactions.push(transaction);
    };

    const updateBalance = (amount) => {
        profile.balance += amount;
    };

    return {
        profile,
        transactions,
        categories,
        fetchProfile,
        saveProfile,
        fetchTransactions,
        fetchCategories,
        fetchAllData,
        addTransaction,
        updateBalance,
    };
});

export const useContentStore = defineStore("contentList", () => {
    const state = reactive({ contentList: [], categories: [] });
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
            // console.log("contentList is not an array");
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
