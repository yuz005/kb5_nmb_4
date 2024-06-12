<template>
    <div class="container d-flex">
        <div class="row">
            <div class="columns">
                <p>소비 현황</p>
                <MonthNavigator
                    :currentDate="currentDate"
                    :isLoading="isLoading"
                    @updateDate="updateDate"
                />
            </div>

            <div class="container">
                <div class="row">
                    <div class="col">
                        <table>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>날짜</th>
                                    <th>카테고리</th>
                                    <th>금액</th>
                                    <th>메모</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="isLoading">
                                    <td colspan="5">데이터 로딩 중...</td>
                                </tr>
                                <tr
                                    v-else-if="filteredContentList.length === 0"
                                >
                                    <td colspan="5">데이터가 없습니다.</td>
                                </tr>
                                <tr
                                    v-else
                                    v-for="item in filteredContentList"
                                    :key="item.id"
                                >
                                    <Contents :contents="item" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="button-group d-flex justify-content-end mt-3">
                        <button
                            class="btn btn-secondary"
                            type="button"
                            @click="showAddForm = !showAddForm"
                        >
                            추가
                        </button>
                        <button class="btn btn-secondary">수정</button>
                        <button class="btn btn-secondary">삭제</button>
                    </div>
                </div>
                <!-- Add Form Modal -->
                <div v-if="showAddForm" class="modal">
                    <div class="modal-content d-flex flex-column">
                        <span class="close" @click="showAddForm = false"
                            >&times;</span
                        >
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
                                    <option
                                        v-for="category in categories"
                                        :key="category.id"
                                        :value="category.id"
                                    >
                                        {{ category.title }}
                                    </option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>지출 여부:</label>
                                <div>
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
                            <div class="form-group">
                                <label>현금 여부:</label>
                                <div>
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
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios"; // Import axios
import Contents from "../components/contents.vue"; // Assuming Contents.vue is in the same directory
import MonthNavigator from "../components/MonthNavigator.vue"; // Import MonthNavigator component
import { useContentStore } from "@/stores/content.js"; // Adjust the path as necessary

const BASEURI = "http://localhost:3000"; // Ensure the BASEURI is defined

const contentStore = useContentStore();
const currentDate = ref(new Date());
const isLoading = ref(false);
const categories = ref([]); // Add categories ref

const showAddForm = ref(false);
const newData = ref({
    date: "",
    category_id: "",
    is_expense: true,
    is_cash: true,
    amount: 0,
    memo: "",
});

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
    console.log(categories);
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
            fetchContent();
            showAddForm.value = false;
        } else {
            alert("데이터 추가에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error adding data:", error);
        alert("데이터 추가 중 에러 발생:" + error);
    }
};

const fetchContent = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${BASEURI}/content`);
        if (response.status === 200) {
            // console.log("Data fetched successfully", response.data);
            contentStore.state.contentList = response.data || [];
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

const filteredContentList = computed(() => {
    if (!Array.isArray(contentStore.state.contentList)) {
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
    return contentStore.state.contentList.filter((item) => {
        if (!item.datetime) return false;
        const itemDate = new Date(Date.parse(item.datetime));
        if (isNaN(itemDate)) {
            console.log(`Invalid date: ${item.datetime}`);
            return false;
        }
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
    });
});

const updateDate = (newDate) => {
    currentDate.value = newDate;
};

watch(currentDate, () => {
    fetchContent();
});

// Utility function to remove time from date
function removeTimeFromDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

onMounted(() => {
    fetchContent();
    fetchCategories(); // Fetch categories on mount
});
</script>

<style scoped>
.arrow-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}
.arrow-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
p {
    text-align: center;
    font-size: 2rem;
}
table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}
th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
}
th {
    text-align: center;
    background-color: #f2f2f2;
}
.button-group button {
    margin-right: 10px; /* 버튼 사이의 간격 설정 */
}
.modal {
    display: block;
    position: fixed;
    z-index: 1;
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
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.form-group {
    width: 100%;
    margin-bottom: 15px;
}
.form-group label {
    display: block;
    margin-bottom: 5px;
}
.form-group input,
.form-group select {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
.close {
    align-self: flex-end;
    color: #aaa;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}
.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
}
</style>
