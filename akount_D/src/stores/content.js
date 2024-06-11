import { defineStore } from "pinia";
import axios from "axios";

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
                const response = await axios.get("/path/to/db.json");
                this.profile = response.data.profile;
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        },
        async fetchTransactions() {
            try {
                const response = await axios.get("/path/to/db.json");
                this.transactions = response.data.transactions;
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        },
        async fetchCategories() {
            try {
                const response = await axios.get("/path/to/db.json");
                this.categories = response.data.categories;
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },
        async fetchAllData() {
            try {
                const response = await axios.get("/path/to/db.json");
                this.profile = response.data.profile;
                this.transactions = response.data.transactions;
                this.categories = response.data.categories;
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
