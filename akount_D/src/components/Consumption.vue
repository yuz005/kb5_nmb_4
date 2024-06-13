<template>
    <div class="daily-summary col-md-4 p-3 border rounded">
        <h2>오늘의 현황</h2>
        <div v-if="currentData" class="card p-3">
            <div class="mb-2">
                <{{ getExpenseType(currentData.category_id) }}>
            </div>
            <div class="mb-2">{{ formatDate(currentData.datetime) }}</div>
            <div class="mb-2">{{ currentData.amount }}원</div>
            <div class="mb-2">{{ currentData.memo }}</div>
            <div class="mb-2">
                카테고리: {{ getCategoryTitle(currentData.category_id) }}
            </div>
            <div class="mb-2">
                유형: {{ getPaymentType(currentData.category_id) }}
            </div>
        </div>
        <div v-else class="card p-3">
            <div class="mb-2">선택된 날짜에 대한 데이터가 없습니다.</div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";

// db.json 파일 경로 설정
const dbUrl = "./db.json"; // 실제 경로로 수정

const props = defineProps({
    selectedDate: { type: String, required: true },
});

const categories = ref([]);
const currentData = ref(null);

const fetchCategories = async () => {
    try {
        const response = await axios.get(dbUrl);
        if (response.status === 200) {
            categories.value = response.data.category;
        } else {
            console.error("Failed to fetch categories");
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

const fetchData = async (date) => {
    try {
        const response = await axios.get(dbUrl);
        if (response.status === 200) {
            const data = response.data.content;
            currentData.value = data.find((item) =>
                item.datetime.startsWith(date)
            );
        } else {
            currentData.value = null;
            console.error("No data found for the selected date");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        currentData.value = null;
    }
};

watch(
    () => props.selectedDate,
    (newDate) => {
        fetchData(newDate);
    }
);

onMounted(() => {
    fetchCategories();
    fetchData(props.selectedDate);
});

const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
};

const getCategoryTitle = (categoryId) => {
    const category = categories.value.find((cat) => cat.id == categoryId);
    return category ? category.title : "카테고리 없음";
};

const getPaymentType = (categoryId) => {
    const category = categories.value.find((cat) => cat.id == categoryId);
    return category ? (category.is_cash ? "현금" : "카드") : "";
};

const getExpenseType = (categoryId) => {
    const category = categories.value.find((cat) => cat.id == categoryId);
    return category ? (category.is_expense ? "지출" : "수입") : "";
};
</script>

<style scoped>
.daily-summary {
    flex: 1;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}
.daily-summary h2 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
