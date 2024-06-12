import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import axios from "axios";

const BASEURI = "http://localhost:3000"; // JSON 서버 주소

export const useMainStore = defineStore("main", () => {
    const profile = reactive({
        nickname: "",
        account_id: "",
        email: "",
        phone_number: "",
        balance: 0
    });

    const transactions = reactive([]);
    const categories = reactive([]);

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${BASEURI}/profile`);
            Object.assign(profile, response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
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

    const setProfile = (newProfile) => {
        Object.assign(profile, newProfile);
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
        fetchTransactions,
        fetchCategories,
        fetchAllData,
        setProfile,
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
