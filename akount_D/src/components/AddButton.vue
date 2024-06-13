<template>
    <div>
        <button
            @click="toggleForm"
            class="btn btn-secondary"
            style="margin-right: 10px"
        >
            추가
        </button>
        <teleport to="body">
            <div v-if="showForm" class="modal">
                <div class="modal-content d-flex flex-column">
                    <span class="close" @click="toggleForm">&times;</span>
                    <form @submit.prevent="addData" class="w-100">
                        <div class="form-group">
                            <label for="date">날짜:</label>
                            <input
                                type="date"
                                v-model="newData.date"
                                required
                                class="form-control"
                            />
                        </div>
                        <div class="form-group">
                            <label for="category">카테고리:</label>
                            <select
                                v-model="newData.category_id"
                                required
                                class="form-control"
                            >
                                <optgroup label="수입">
                                    <option
                                        v-for="category in categories_income"
                                        :key="category.id"
                                        :value="category.id"
                                    >
                                        {{ category.title }}
                                    </option>
                                </optgroup>
                                <optgroup label="지출">
                                    <option
                                        v-for="category in categories_expense"
                                        :key="category.id"
                                        :value="category.id"
                                    >
                                        {{ category.title }}
                                    </option>
                                </optgroup>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>지출 여부:</label>
                            <div class="radio-group">
                                <div class="radio-item">
                                    <input
                                        type="radio"
                                        id="expense"
                                        value="true"
                                        v-model="newData.is_expense"
                                    />
                                    <label for="expense">지출</label>
                                    <input
                                        type="radio"
                                        id="income"
                                        value="false"
                                        v-model="newData.is_expense"
                                    />
                                    <label for="income">수입</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>현금 여부:</label>
                            <div class="radio-group">
                                <div class="radio-item">
                                    <input
                                        type="radio"
                                        id="cash"
                                        value="true"
                                        v-model="newData.is_cash"
                                    />
                                    <label for="cash">현금</label>
                                    <input
                                        type="radio"
                                        id="card"
                                        value="false"
                                        v-model="newData.is_cash"
                                    />
                                    <label for="card">카드</label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="amount">금액:</label>
                            <input
                                type="number"
                                v-model="newData.amount"
                                required
                                class="form-control"
                            />
                        </div>
                        <div class="form-group">
                            <label for="memo">메모:</label>
                            <input
                                type="text"
                                v-model="newData.memo"
                                class="form-control"
                            />
                        </div>
                        <div class="d-flex justify-content-end mt-3">
                            <button type="submit" class="btn btn-primary">
                                추가
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
const BASEURI = "http://localhost:3000";

const categories = ref([]);

const emit = defineEmits(["data-added"]);

const showForm = ref(false);
const newData = ref({
    date: "",
    category_id: "",
    is_expense: "true",
    is_cash: "true",
    amount: 0,
    memo: "",
});

const resetForm = () => {
    newData.value = {
        date: "",
        category_id: "",
        is_expense: "true",
        is_cash: "true",
        amount: 0,
        memo: "",
    };
};

const toggleForm = () => {
    showForm.value = !showForm.value;
    if (!showForm.value) {
        resetForm();
    }
};

const addData = async () => {
    try {
        const response = await axios.post(`${BASEURI}/content`, {
            datetime: newData.value.date,
            category_id: newData.value.category_id,
            is_expense: newData.value.is_expense === "true",
            is_cash: newData.value.is_cash === "true",
            amount: newData.value.amount,
            memo: newData.value.memo,
        });
        if (response.status === 201) {
            alert("데이터가 성공적으로 추가되었습니다.");
            emit("data-added");
            toggleForm();
            resetForm();
        } else {
            alert("데이터 추가에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error adding data:", error);
        alert("데이터 추가 중 에러 발생:" + error);
    }
};

const fetchCategories = async () => {
    try {
        const response = await axios.get(`${BASEURI}/category`);
        if (response.status === 200) {
            categories.value = response.data;
        } else {
            console.error("Failed to fetch categories");
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};

onMounted(() => {
    fetchCategories();
});

const categories_income = computed(() => {
    return categories.value.filter((category) => category.id < 200);
});

const categories_expense = computed(() => {
    return categories.value.filter((category) => category.id >= 210);
});
</script>

<style scoped>
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1050;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
</style>
