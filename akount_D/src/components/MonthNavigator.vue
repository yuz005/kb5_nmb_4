NonthNavigator.vue
<template>
    <div class="d-flex justify-content-center mb-3">
        <button @click="prevMonth" class="arrow-button" :disabled="isLoading">
            ←
        </button>
        <span class="mx-3">{{ currentMonthLabel }}</span>
        <button @click="nextMonth" class="arrow-button" :disabled="isLoading">
            →
        </button>
    </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from "vue";

const props = defineProps({
    currentDate: {
        type: Date,
        required: true,
    },
    isLoading: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(["updateDate"]);

const currentMonthLabel = computed(() => {
    const options = { year: "numeric", month: "long" };
    return props.currentDate.toLocaleDateString("ko-KR", options);
});

const prevMonth = () => {
    const newDate = new Date(
        props.currentDate.getFullYear(),
        props.currentDate.getMonth() - 1,
        1
    );
    emit("updateDate", newDate);
};

const nextMonth = () => {
    const newDate = new Date(
        props.currentDate.getFullYear(),
        props.currentDate.getMonth() + 1,
        1
    );
    emit("updateDate", newDate);
};
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
</style>
