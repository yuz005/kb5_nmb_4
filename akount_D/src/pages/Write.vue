<template>
    <div class="container mt-5">
        <div class="row">
            <div class="columns">
                <h2>소비 현황</h2>
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
                                    <th>구분</th>
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
                                    @click="selectItem(item)"
                                    :class="{
                                        'selected-row':
                                            selectedItem &&
                                            selectedItem.id === item.id,
                                    }"
                                >
                                    <Contents :contents="item" />
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="button-group d-flex justify-content-end mt-3">
                        <AddButton
                            :categories="categories"
                            @data-added="fetchContent"
                        />
                        <button
                            class="btn btn-secondary"
                            type="button"
                            @click="toggleEditForm"
                            :disabled="!selectedItem"
                        >
                            수정
                        </button>
                        <button
                            class="btn btn-secondary"
                            type="button"
                            @click="deleteData"
                            :disabled="!selectedItem"
                        >
                            삭제
                        </button>
                    </div>
                </div>
                <!-- Edit Form Modal -->
                <EditFormModal
                    v-if="showEditForm && selectedItem"
                    :selectedItem="selectedItem"
                    :categories="categories"
                    @close="showEditForm = false"
                    @submit="editData"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import Contents from "../components/contents.vue";
import MonthNavigator from "../components/MonthNavigator.vue";
import AddButton from "../components/AddButton.vue";
import EditFormModal from "../components/EditFormModal.vue";
import { useContentStore } from "@/stores/content.js";

const BASEURI = "http://localhost:3000";
const contentStore = useContentStore();
const currentDate = ref(new Date());
const isLoading = ref(false);
const categories = ref([]);

const showEditForm = ref(false);
const selectedItem = ref(null);

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

const fetchContent = async () => {
    isLoading.value = true;
    try {
        const response = await axios.get(`${BASEURI}/content`);
        if (response.status === 200) {
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

const editData = async () => {
    try {
        const response = await axios.put(
            `${BASEURI}/content/${selectedItem.value.id}`,
            {
                datetime: selectedItem.value.date,
                category_id: selectedItem.value.category_id,
                is_expense: selectedItem.value.is_expense === "true",
                is_cash: selectedItem.value.is_cash === "true",
                amount: selectedItem.value.amount,
                memo: selectedItem.value.memo,
            }
        );
        if (response.status === 200) {
            alert("데이터가 성공적으로 수정되었습니다.");
            fetchContent();
            showEditForm.value = false;
            selectedItem.value = null;
        } else {
            alert("데이터 수정에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error editing data:", error);
        alert("데이터 수정 중 에러 발생:" + error);
    }
};

const deleteData = async () => {
    if (!selectedItem.value) return;
    try {
        const response = await axios.delete(
            `${BASEURI}/content/${selectedItem.value.id}`
        );
        if (response.status === 200) {
            alert("데이터가 성공적으로 삭제되었습니다.");
            fetchContent();
            selectedItem.value = null;
        } else {
            alert("데이터 삭제에 실패했습니다.");
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        alert("데이터 삭제 중 에러 발생:" + error);
    }
};

const selectItem = (item) => {
    selectedItem.value = { ...item };
};

const toggleEditForm = () => {
    showEditForm.value = !showEditForm.value;
};

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

const updateDate = (newDate) => {
    currentDate.value = newDate;
};

watch(currentDate, fetchContent);

function removeTimeFromDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

onMounted(() => {
    fetchContent();
    fetchCategories();
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
.selected-row {
    background-color: #e0f7fa; /* 원하는 배경색으로 변경하세요 */
}
</style>
