import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import axios from "axios";

const BASEURI = "http://localhost:3000"; // JSON 서버 주소

export const useMainStore = defineStore({
    id: "main",
    state: () => ({
        profile: {
            nickname: "",
            email: "",
            profileImage: "",
            balance: 0,
        },
        transactions: [],
        categories: [],
    }),
    actions: {
        async fetchProfile() {
            try {
                const response = await axios.get(`${BASEURI}/profile`);
                this.profile = response.data;
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        },
        async fetchTransactions() {
            try {
                const response = await axios.get(`${BASEURI}/transactions`);
                this.transactions = response.data;
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get(`${BASEURI}/categories`);
                this.categories = response.data;
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },
        async fetchAllData() {
            try {
                const profileResponse = await axios.get(`${BASEURI}/profile`);
                this.profile = profileResponse.data;
                const transactionsResponse = await axios.get(
                    `${BASEURI}/transactions`
                );
                this.transactions = transactionsResponse.data;
                const categoriesResponse = await axios.get(
                    `${BASEURI}/categories`
                );
                this.categories = categoriesResponse.data;
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        setProfile(profile) {
            this.profile = profile;
        },
        addTransaction(transaction) {
            this.transactions.push(transaction);
        },
        updateBalance(amount) {
            this.profile.balance += amount;
        },
    },
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
