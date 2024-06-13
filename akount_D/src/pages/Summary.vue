<template>
    <div class="container">
        <div class="row">
            <div class="columns">
                <h2>소비 요약</h2>
            </div>
            <main class="main-content">
                <div class="header">
                    <MonthNavigator
                        :currentDate="currentDate"
                        :isLoading="isLoading"
                        @updateDate="handleUpdateDate"
                    />
                </div>
            </main>
            <div class="table-responsive">
                <div class="row">
                    <div class="col">
                        <!-- Outcome Table -->
                        <table
                            v-if="
                                !isLoading &&
                                filteredCategories_outcome.length > 0
                            "
                            class="table table-hover table-bordered"
                        >
                            <thead class="table-dark">
                                <tr>
                                    <th colspan="3">소비</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="table-info">
                                    <th scope="row">분류</th>
                                    <td>카드</td>
                                    <td>현금</td>
                                </tr>
                                <tr
                                    v-for="category in filteredCategories_outcome"
                                    :key="category.id"
                                >
                                    <th scope="row">
                                        {{ category.title }}
                                        <!-- 
                                        {{
                                            console.log(
                                                "Expense Card Total for Category:",
                                                expenseCardTotals[category.id]
                                            )
                                        }}
                                        {{
                                            console.log(
                                                "Expense Cash Total for Category:",
                                                expenseCashTotals[category.id]
                                            )
                                        }} -->
                                    </th>
                                    <td>
                                        {{
                                            expenseCardTotals[category.id] || 0
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            expenseCashTotals[category.id] || 0
                                        }}
                                    </td>
                                </tr>
                                <tr class="table-secondary">
                                    <th scope="row">합계</th>
                                    <td>{{ totalCardExpenses }}</td>
                                    <td>{{ totalCashExpenses }}</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- Income Table -->
                        <table
                            v-if="
                                !isLoading &&
                                filteredCategories_income.length > 0
                            "
                            class="table table-hover table-bordered"
                        >
                            <thead class="table-dark">
                                <tr>
                                    <th colspan="2">수입</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="table-info">
                                    <th scope="row">분류</th>
                                    <td>금액</td>
                                </tr>
                                <tr
                                    v-for="category in filteredCategories_income"
                                    :key="category.id"
                                >
                                    <th scope="row">{{ category.title }}</th>
                                    <td>
                                        {{ incomeTotals[category.id] || 0 }}
                                    </td>
                                </tr>
                                <tr class="table-secondary">
                                    <th scope="row">합계</th>
                                    <td>{{ totalIncome }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-if="isLoading">로딩 중...</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useContentStore } from "@/stores/content.js";
import MonthNavigator from "@/components/MonthNavigator.vue";

// Using content store
const contentStore = useContentStore();
const { fetchContent, fetchCategories, updateDate } = contentStore;

// State and computed properties
const currentDate = ref(new Date());
const isLoading = computed(() => contentStore.isLoading);
const contentList = computed(() => contentStore.state.contentList || []);
const filteredCategories_income = computed(() =>
    contentStore.state.categories.filter((category) => category.id < 200)
);
const filteredCategories_outcome = computed(() =>
    contentStore.state.categories.filter(
        (category) => (category.id > 200) & (category.id < 210)
    )
);
console.log(filteredCategories_outcome);
// Fetch data on component mount
const loadData = async () => {
    await fetchCategories();
    await fetchContent();
};
onMounted(loadData);

// Watch for date changes
watch(currentDate, (newDate) => {
    updateDate(newDate);
    fetchContent();
});

// Update date handler
const handleUpdateDate = (newDate) => {
    currentDate.value = newDate;
};

// Calculate category totals
const calculateCategoryTotals = (isExpense, isCash) => {
    const totals = {};
    contentList.value.forEach((item) => {
        if (
            item.is_expense === isExpense &&
            (isCash === null || item.is_cash === isCash)
        ) {
            const category = item.category_id;
            if (!totals[category]) {
                totals[category] = 0;
            }
            totals[category] += item.amount;
        }
    });
    console.log("Calculated Totals:", totals);
    return totals;
};

// Computed totals for expenses and income
const expenseCashTotals = computed(() => calculateCategoryTotals(true, true));
const expenseCardTotals = computed(() => calculateCategoryTotals(true, false));
const incomeTotals = computed(() => calculateCategoryTotals(false, null));

// Computed total sums for card expenses, cash expenses, and income
const totalCardExpenses = computed(() =>
    Object.values(expenseCardTotals.value).reduce((a, b) => a + b, 0)
);
const totalCashExpenses = computed(() =>
    Object.values(expenseCashTotals.value).reduce((a, b) => a + b, 0)
);
const totalIncome = computed(() =>
    Object.values(incomeTotals.value).reduce((a, b) => a + b, 0)
);
</script>
<style scoped>
.container {
    padding: 20px;
}

.row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.columns {
    text-align: center;
}

.main-content {
    margin-top: 20px;
}

.header {
    display: flex;
    justify-content: center;
    align-items: center;
}

.calendar-header {
    display: flex;
    align-items: center;
}

.arrow-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.date-display {
    display: flex;
    align-items: center;
    justify-content: center;
}

.date-input {
    font-size: 24px;
    width: 60px;
    text-align: center;
}

h1 {
    margin: 0 10px;
    cursor: pointer;
}
</style>
