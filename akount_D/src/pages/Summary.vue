<template>
  <div class="container">
    <div class="row">
      <div class="columns">
        <h2>소비 요약</h2>
      </div>
      <main class="main-content">
        <div class="header">
          <div class="calendar-header">
            <button @click="prevMonth" class="arrow-button">←</button>
            <div @dblclick="enableEditing" class="date-display">
              <input
                v-if="isEditingYear"
                v-model="currentYear"
                @blur="disableEditing"
                class="date-input" />
              <h1 v-else>{{ currentYear }}년</h1>
              <input
                v-if="isEditingMonth"
                v-model="currentMonthDisplay"
                @blur="disableEditing"
                class="date-input" />
              <h1 v-else>{{ currentMonthDisplay }}월</h1>
            </div>
            <button @click="nextMonth" class="arrow-button">→</button>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// 현재 날짜를 기준으로 초기값 설정
const today = new Date();
const currentYear = ref(today.getFullYear());
const currentMonth = ref(today.getMonth() + 1); // 월은 0부터 시작하므로 +1

// 편집 모드 상태
const isEditingYear = ref(false);
const isEditingMonth = ref(false);

// 현재 월 표시 문자열 (0을 포함한 형식)
const currentMonthDisplay = computed(() => {
  return currentMonth.value < 10
    ? `${currentMonth.value}`
    : currentMonth.value.toString();
});

// 이전 달로 이동합니다.
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

// 다음 달로 이동
const nextMonth = () => {
  if (currentMonth.value === 12) {
    currentMonth.value = 1;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};
//?
// 편집 모드 활성화
const enableEditing = (event) => {
  if (event.target.tagName === "H1") {
    if (event.target.innerText.includes("년")) {
      isEditingYear.value = true;
    } else if (event.target.innerText.includes("월")) {
      isEditingMonth.value = true;
    }
  }
};

// 편집 모드 비활성화
const disableEditing = () => {
  isEditingYear.value = false;
  isEditingMonth.value = false;
};
</script>

<style scoped>
/* 스타일 정의 */
.container {
  padding: 20px;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.columns {
  text-align: center;
}

.main-content {
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar-header {
  display: flex;
  align-items: center;
}

.arrow-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.date-display {
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-input {
  font-size: 24px;
  width: 60px;
  text-align: center;
}

h1 {
  margin: 0 10px;
  cursor: pointer;
}
</style>
