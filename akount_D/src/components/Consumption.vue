<template>
    <div class="daily-summary col-md-4 p-3 border rounded">
        <h2>당일 소비 현황</h2>
        <textarea
            v-if="isEditing"
            v-model="selectedMemo"
            class="form-control content-input mb-2"
        ></textarea>
        <p v-else>{{ selectedMemo }}</p>
        <div class="buttons d-flex justify-content-end">
            <button @click="saveContent" class="btn btn-success me-2">
                저장
            </button>
            <button @click="editContent" class="btn btn-warning">수정</button>
        </div>
        <div class="mt-3">
            <span>{{ selectedAmount }}</span>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useMainStore } from "@/stores/content.js";

const props = defineProps({
    initialMemo: {
        type: String,
        required: true,
    },
    initialAmount: {
        type: Number,
        required: true,
    },
    selectedDate: {
        type: Object,
        required: true,
    },
    onSave: Function,
});

const selectedMemo = ref(props.initialMemo);
const selectedAmount = ref(props.initialAmount);
const isEditing = ref(false);

watch(
    () => props.initialMemo,
    (newVal) => {
        selectedMemo.value = newVal;
    }
);

watch(
    () => props.initialAmount,
    (newVal) => {
        selectedAmount.value = newVal;
    }
);

const saveContent = async () => {
    isEditing.value = false;
    if (props.onSave) {
        await props.onSave(selectedMemo.value, selectedAmount.value);
    }
};

const editContent = () => {
    isEditing.value = true;
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
.edit-button {
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
</style>
