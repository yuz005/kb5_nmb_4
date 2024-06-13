<template>
    <div class="modal">
        <div class="modal-content d-flex flex-column">
            <span class="close" @click="$emit('close')">&times;</span>
            <form @submit.prevent="submitEditForm" class="w-100">
                <div class="form-group">
                    <label for="date">날짜:</label>
                    <input
                        type="date"
                        v-model="localItem.date"
                        required
                        class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="category">카테고리:</label>
                    <select
                        v-model="localItem.category_id"
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
                                id="expense_edit"
                                value="true"
                                v-model="localItem.is_expense"
                            />
                            <label for="expense_edit" class="radio-item"
                                >지출</label
                            >
                            <input
                                type="radio"
                                id="income_edit"
                                value="false"
                                v-model="localItem.is_expense"
                            />
                            <label for="income_edit" class="radio-item"
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
                                id="cash_edit"
                                value="true"
                                v-model="localItem.is_cash"
                            />
                            <label for="cash_edit" class="radio-item"
                                >현금</label
                            >
                            <input
                                type="radio"
                                id="card_edit"
                                value="false"
                                v-model="localItem.is_cash"
                            />
                            <label for="card_edit" class="radio-item"
                                >카드</label
                            >
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="amount">금액:</label>
                    <input
                        type="number"
                        v-model="localItem.amount"
                        required
                        class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="memo">메모:</label>
                    <input
                        type="text"
                        v-model="localItem.memo"
                        class="form-control"
                    />
                </div>
                <div class="d-flex justify-content-end mt-3">
                    <button type="submit" class="btn btn-primary">수정</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    selectedItem: Object,
    categories: Array,
});

const emit = defineEmits(["close", "submit"]);

const localItem = ref({ ...props.selectedItem });

watch(
    () => props.selectedItem,
    (newVal) => {
        localItem.value = { ...newVal };
    }
);

const submitEditForm = () => {
    emit("submit", localItem.value);
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
