import { defineStore } from "pinia";
import { reactive, computed, ref, watch } from "vue";
import axios from "axios";

const BASEURI = "http://localhost:3000"; // JSON 서버 주소

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
        // console.log("Fetching profile...");
        try {
            const response = await axios.get(`${BASEURI}/profile`);
            if (response.status === 200) {
                const profileData = response.data;
                if (profileData) {
                    // console.log("Profile fetched successfully:", profileData);
                    if (profileData[0]) {
                        //검수
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
    const state = reactive({ contentList: [] });
    const currentDate = ref(new Date());
    const isLoading = ref(false);

    // Inside useContentStore
    const fetchContent = async () => {
        isLoading.value = true;
        try {
            const response = await axios.get(`${BASEURI}/content`);
            if (response.status === 200) {
                // console.log("Data fetched successfully", response.data);
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

    function removeTimeFromDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const filteredContentList = computed(() => {
        if (!Array.isArray(state.contentList)) {
            console.log("contentList is not an array");
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
    // Ensure watch on currentDate triggers fetchContent
    watch(currentDate, () => {
        fetchContent();
    });

    const updateDate = (newDate) => {
        currentDate.value = newDate;
    };

    return {
        state,
        fetchContent,
        filteredContentList,
        currentDate,
        updateDate,
        isLoading,
    };
});
