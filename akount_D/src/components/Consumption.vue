<template>
    <div class="daily-summary col-md-4 p-3 border rounded">
        <h2>당일 소비 현황</h2>
        <div v-if="isEditing">
            <div>
                <div class="form-label">날짜</div>
                <input
                    type="date"
                    v-model="localDate"
                    class="form-control mb-2"
                />
                <div class="form-label">금액</div>
                <input
                    type="number"
                    v-model="localAmount"
                    class="form-control mb-2"
                    placeholder="금액 입력"
                />
                <div class="form-label">메모</div>
                <textarea
                    v-model="localMemo"
                    class="form-control content-input mb-2"
                    placeholder="메모 입력"
                ></textarea>
                <div class="form-label">카테고리</div>
                <select v-model="localCategory" class="form-control mb-2">
                    <option
                        v-for="category in categories"
                        :key="category"
                        :value="category"
                    >
                        {{ category }}
                    </option>
                </select>
                <div class="form-label">유형</div>
                <div>
                    <label>
                        <input type="radio" v-model="localType" value="지출" />
                        지출
                    </label>
                    <label>
                        <input type="radio" v-model="localType" value="수입" />
                        수입
                    </label>
                </div>
            </div>
            <div class="buttons d-flex justify-content-end">
                <button @click="saveContent" class="btn btn-success me-2">
                    저장
                </button>
                <button @click="deleteContent" class="btn btn-danger">
                    삭제
                </button>
            </div>
        </div>
        <div v-else>
            <div>
                <div class="form-label">{{ formatDate(selectedDate) }}</div>
                <p>{{ initialAmount }}원</p>
                <p>{{ initialMemo }}</p>
                <p>카테고리: {{ initialCategory }}</p>
                <p>유형: {{ initialType }}</p>
            </div>
            <div class="buttons d-flex justify-content-end">
                <button @click="editContent" class="btn btn-warning">
                    수정
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    initialMemo: {
        type: String,
        required: true,
    },
    initialAmount: {
        type: Number,
        required: true,
    },
    initialCategory: {
        type: String,
        required: true,
    },
    initialType: {
        type: String,
        required: true,
    },
    selectedDate: {
        type: String,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    isEditing: {
        type: Boolean,
        required: true,
    },
});

const emits = defineEmits(["updateIsEditing", "saveContent", "deleteContent"]);

const localMemo = ref(props.initialMemo);
const localAmount = ref(props.initialAmount);
const localCategory = ref(props.initialCategory);
const localType = ref(props.initialType);
const localDate = ref(props.selectedDate);

watch(
    () => props.initialMemo,
    (newMemo) => {
        localMemo.value = newMemo;
    }
);

watch(
    () => props.initialAmount,
    (newAmount) => {
        localAmount.value = newAmount;
    }
);

watch(
    () => props.initialCategory,
    (newCategory) => {
        localCategory.value = newCategory;
    }
);

watch(
    () => props.initialType,
    (newType) => {
        localType.value = newType;
    }
);

watch(
    () => props.selectedDate,
    (newDate) => {
        localDate.value = newDate;
    }
);

const saveContent = () => {
    emits(
        "saveContent",
        localDate.value,
        localAmount.value,
        localMemo.value,
        localCategory.value,
        localType.value
    );
    emits("updateIsEditing", false);
};

const editContent = () => {
    emits("updateIsEditing", true);
};

const deleteContent = () => {
    emits("deleteContent");
    emits("updateIsEditing", false);
};

const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
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

.buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.save-button,
.edit-button,
.delete-button {
    font-size: 1rem;
    padding: 5px 10px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
}

.save-button {
    background-color: #4caf50;
    color: white;
}

.edit-button {
    background-color: #ff9800;
    color: white;
}

.delete-button {
    background-color: #dc3545;
    color: white;
}
</style>
