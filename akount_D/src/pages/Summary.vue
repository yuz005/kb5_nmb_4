<template>
    <div class="container mt-4">
        <div class="row">
            <div class="columns">
                <h2 style="text-align:left">소비 요약</h2>
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
            <div class="row">
                <div class="col-md-6">
                    <ExpenseChart
                        :expenses="{ card: expenseCardTotals, cash: expenseCashTotals }"
                        :income="totalIncome"
                    />
                </div>
                <div class="col-md-6">
                    <CategoryPieChart
                        :categories="uniqueOutcomeCategories"
                        :expenses="{ card: expenseCardTotals, cash: expenseCashTotals }"
                    />
                </div>
            </div>

            <div class="table-responsive">
                <div class="row">
                    <div class="col">
                        <!-- Outcome Table -->
                        <table
                            v-if="
                                !isLoading && uniqueOutcomeCategories.length > 0
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
                                    v-for="category in uniqueOutcomeCategories"
                                    :key="category.id"
                                >
                                    <th scope="row">{{ category.title }}</th>
                                    <td>
                                        {{
                                            calculateTotal(
                                                category.title,
                                                true,
                                                false
                                            )
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            calculateTotal(
                                                category.title,
                                                true,
                                                true
                                            )
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
                        <table
                            class="table table-hover table-bordered text-center"
                        >
                            <tbody>
                                <tr class="table-secondary text-white">
                                    <td>잔고</td>
                                    <td>
                                        {{
                                            totalIncome -
                                            totalCardExpenses -
                                            totalCashExpenses
                                        }}
                                    </td>
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
import ExpenseChart from "@/components/ExpenseChart.vue";
import CategoryPieChart from "@/components/CategoryPieChart.vue";


// Content store 사용
const contentStore = useContentStore();
const { fetchContent, fetchCategories, updateDate } = contentStore;

// 상태 및 계산된 속성
const currentDate = ref(new Date());
const isLoading = computed(() => contentStore.isLoading);
const contentList = computed(() => contentStore.state.contentList || []);
const filteredCategories_income = computed(() =>
    contentStore.state.categories.filter((category) => category.id < 200)
);
const filteredCategories_outcome = computed(() =>
    contentStore.state.categories.filter((category) => category.id > 200)
);

// 중복 카테고리명을 제거한 리스트 생성
const uniqueOutcomeCategories = computed(() => {
    const seen = new Set();
    return filteredCategories_outcome.value.filter((category) => {
        const duplicate = seen.has(category.title);
        seen.add(category.title);
        return !duplicate;
    });
});

// 컴포넌트 마운트 시 데이터 로드
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

// 날짜 업데이트 핸들러
const handleUpdateDate = (newDate) => {
    currentDate.value = newDate;
    updateTotal(); // 날짜가 변경될 때 합계를 업데이트
};

// 날짜로부터 시간을 제거하는 함수
const removeTimeFromDate = (date) => {
    date.setHours(0, 0, 0, 0);
    return date;
};

// 특정 카테고리와 유형에 대한 합계 계산
const calculateTotal = (title, isExpense, isCash) => {
    return filteredContentList.value
        .filter((item) => {
            const category = contentStore.state.categories.find(
                (cat) => cat.id === item.category_id
            );
            return (
                category &&
                category.title === title &&
                item.is_expense === isExpense &&
                item.is_cash === isCash
            );
        })
        .reduce((total, item) => total + item.amount, 0);
};

// 특정 월에 해당하는 콘텐츠 리스트 필터링
const filteredContentList = computed(() => {
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
    return contentStore.state.contentList.filter((item) => {
        const itemDate = new Date(Date.parse(item.datetime));
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
    });
});

// 카테고리 합계 계산
const calculateCategoryTotals = (isExpense, isCash) => {
    const totals = {};
    filteredContentList.value.forEach((item) => {
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
    return totals;
};

// 지출 및 수입 합계 계산
const expenseCashTotals = computed(() => calculateCategoryTotals(true, true));
const expenseCardTotals = computed(() => calculateCategoryTotals(true, false));
const incomeTotals = computed(() => calculateCategoryTotals(false, null));

// 카드 지출, 현금 지출 및 수입의 총합 계산
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