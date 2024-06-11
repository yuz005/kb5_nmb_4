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
                v-for="(day, index) in daysInMonth"
                :key="index"
                class="calendar-day"
            >
                <span v-if="day">{{ day }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const daysInMonth = ref([]);

const getDaysInMonth = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    while (date.getMonth() === month) {
        days.push(date.getDate());
        date.setDate(date.getDate() + 1);
    }

    // 첫 주의 시작 요일을 맞추기 위해 앞에 빈 요소를 추가
    const firstDayIndex = new Date(year, month, 1).getDay();
    for (let i = 0; i < firstDayIndex; i++) {
        days.unshift(null);
    }

    return days;
};

watchEffect(() => {
    daysInMonth.value = getDaysInMonth(currentYear.value, currentMonth.value);
});
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
}

.calendar-day {
    min-height: 50px;
    border: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
}

.calendar-day span {
    padding: 5px;
}
</style>
