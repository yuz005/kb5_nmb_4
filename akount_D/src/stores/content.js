import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import axios from "axios";

const BASEURI = "http://localhost:3000"; // JSON 서버 주소

export const useMainStore = defineStore("main", () => {
    // const profile = reactive({
    //     nickname: "",
    //     account_id: "",
    //     email: "",
    //     phone_number: "",
    //     balance: 0,
    // });

    const profile = reactive([]);

    const transactions = reactive([]);
    const categories = reactive([]);

    const fetchProfile = async () => {
        console.log("Fetching profile...");
        try {
            const response = await axios.get(`${BASEURI}/profile`);
        if (response.status === 200) {
            const profileData = response.data;
            if (profileData) {
                console.log("Profile fetched successfully:", profileData);
                if(profileData[0]) {      // 검수
                }
                Object.assign(profile, profileData[0]);
            } else {
                console.error("Profile not found");
            }
        } else {
            console.error("Failed to fetch profile. Status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

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

    // const setProfile = (newProfile) => {
    //     Object.assign(profile, newProfile);
    // };

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
        // setProfile,
        addTransaction,
        updateBalance,
    };
});

export const useContentStore = defineStore("contentList", () => {
    const state = reactive({ contentList: [] });

    const fetchContent = async () => {
        try {
            const response = await axios.get(`${BASEURI}/content`);
            if (response.status === 200) {
                state.contentList = response.data;
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
