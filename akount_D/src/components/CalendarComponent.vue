<template>
    <div class="calendar card p-3">
        <div class="calendar-header row">
            <div
                v-for="day in daysOfWeek"
                :key="day"
                class="calendar-day-header col text-center"
            >
                {{ day }}
            </div>
        </div>
        <div class="calendar-body row mt-2">
            <div
                v-for="(day, index) in daysInMonth"
                :key="index"
                class="calendar-day col border p-2"
                :class="{
                    'has-content bg-info text-white': hasContent(day),
                    'selected bg-primary text-white': selectedDay === day,
                }"
                @click="selectDay(day)"
                @dblclick="handleDoubleClick(day)"
            >
                <span v-if="day">{{ day }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watchEffect } from "vue";

const props = defineProps({
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
    content: {
        type: Array,
        required: true,
    },
});
const handleDoubleClick = (day) => {
    selectDay(day, true);
    isEditing.value = true; // Enable editing on double click
};

const emits = defineEmits(["showContent"]);

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
const daysInMonth = ref([]);
const selectedDay = ref(null);

const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        days.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }

    const firstDayIndex = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDayIndex; i++) {
        days.unshift(null);
    }

    return days;
};

watchEffect(() => {
    daysInMonth.value = getDaysInMonth(props.year, props.month);
});

const hasContent = (day) => {
    if (!day) return false;
    const dateStr = `${props.year}-${String(props.month + 1).padStart(
        2,
        "0"
    )}-${String(day).padStart(2, "0")}`;
    return props.content.some((item) => item.datetime.startsWith(dateStr));
};

const selectDay = (day, isDoubleClick = false) => {
    if (day) {
        selectedDay.value = day;
        const dateStr = `${props.year}-${String(props.month + 1).padStart(
            2,
            "0"
        )}-${String(day).padStart(2, "0")}`;
        const content = props.content.find((item) =>
            item.datetime.startsWith(dateStr)
        );
        emits("showContent", {
            year: props.year,
            month: props.month,
            day,
            isDoubleClick,
            content,
        });
    }
};
</script>
<style scoped>
.calendar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
}

.calendar-header,
.calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}

.calendar-day-header {
    font-weight: bold;
    text-align: center;
    justify-content: center;
    padding: 10px 0;
    background: #f0f0f0;
    border-radius: 5px;
}

.calendar-day {
    min-height: 80px;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: transform 0.3s ease, background-color 0.3s ease;
    background: white;
    border-radius: 5px;
}

.calendar-day:hover {
    transform: scale(1.05);
    cursor: pointer;
}

.calendar-day.has-content {
    background-color: #1bddf7;
}

.calendar-day.selected {
    background-color: #7710d6;
}

.calendar-day span {
    padding: 5px;
}

.calendar-day.has-content::after {
    content: "";
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    top: 5px;
    right: 5px;
}
</style>
