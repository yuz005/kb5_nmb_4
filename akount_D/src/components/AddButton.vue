<!-- AddButton.vue -->
<template>
    <div>
        <button class="btn btn-primary" type="button" @click="toggleForm">
            추가
        </button>

        <!-- Add Form Modal -->
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
                        <div class="radio-group">
                            <div class="radio-item">
                                <input
                                    type="radio"
                                    id="expense"
                                    value="true"
                                    v-model="newData.is_expense"
                                />
                                <label for="expense" class="radio-item"
                                    >지출</label
                                >
                                <input
                                    type="radio"
                                    id="income"
                                    value="false"
                                    v-model="newData.is_expense"
                                />
                                <label for="income" class="radio-item"
                                    >수입</label
                                >
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
                                <label for="cash" class="radio-item"
                                    >현금</label
                                >
                                <input
                                    type="radio"
                                    id="card"
                                    value="false"
                                    v-model="newData.is_cash"
                                />
                                <label for="card" class="radio-item"
                                    >카드</label
                                >
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
    </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

export default {
    props: {
        categories: {
            type: Array,
            required: true,
        },
    },
    emits: ["data-added"],
    setup(props, { emit }) {
        const showForm = ref(false);
        const newData = ref({
            date: "",
            category_id: "",
            is_expense: true,
            is_cash: true,
            amount: 0,
            memo: "",
        });

        const toggleForm = () => {
            showForm.value = !showForm.value;
        };

        const addData = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:3000/content`,
                    {
                        datetime: newData.value.date,
                        category_id: newData.value.category_id,
                        is_expense: newData.value.is_expense === "true",
                        is_cash: newData.value.is_cash === "true",
                        amount: newData.value.amount,
                        memo: newData.value.memo,
                    }
                );
                if (response.status === 201) {
                    alert("데이터가 성공적으로 추가되었습니다.");
                    emit("data-added");
                    toggleForm();
                } else {
                    alert("데이터 추가에 실패했습니다.");
                }
            } catch (error) {
                console.error("Error adding data:", error);
                alert("데이터 추가 중 에러 발생:" + error);
            }
        };

        return {
            showForm,
            newData,
            toggleForm,
            addData,
        };
    },
};
</script>

<style scoped>
.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    color: black;
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
    color: black;
}
.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}
.form-group {
    margin-bottom: 1rem;
    width: 100%;
}
.radio-group {
    display: flex;
    gap: 2rem;
    margin-top: 0.5rem;
    width: 100%;
}
.radio-item {
    display: flex;
    align-items: center;
    width: 50%;
}
.radio-item input {
    margin-right: 0.5rem;
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
.button-group button {
    margin-right: 10px; /* 버튼 사이의 간격 설정 */
}
</style>
