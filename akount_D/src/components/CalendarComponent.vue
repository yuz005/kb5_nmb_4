<template>
    <div class="calendar">
        <div class="calendar-header">
            <div
                v-for="day in daysOfWeek"
                :key="day"
                class="calendar-day-header"
            >
                {{ day }}
            </div>
        </div>
        <div class="calendar-body">
            <div
                v-for="day in daysInMonth"
                :key="index"
                class="calendar-day"
                :class="{
                    'has-content': hasContent(day),
                    selected: selectedDay === day,
                }"
                @click="selectDay(day)"
                @dblclick="selectDay(day, true)"
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
        type: Object,
        required: true,
    },
});

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
    return props.content[`${props.year}-${props.month + 1}-${day}`];
};

const selectDay = (day, isDoubleClick = false) => {
    if (day) {
        selectedDay.value = day;
        emits("showContent", {
            year: props.year,
            month: props.month,
            day,
            isDoubleClick,
            content:
                props.content[`${props.year}-${props.month + 1}-${day}`] || "",
        });
    }
};
</script>

<style scoped>
.calendar {
    display: flex;
    flex-direction: column;
    gap: 10px;
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
}

.calendar-day {
    min-height: 50px;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
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
</style>
