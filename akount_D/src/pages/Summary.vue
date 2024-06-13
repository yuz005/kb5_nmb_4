<template>
  <div class="container">
    <div class="row">
      <div class="columns">
        <h2>소비 요약</h2>
      </div>
      <main class="main-content">
        <div class="header">
          <MonthNavigator :currentDate="currentDate"
            :isLoading="isLoading" @updateDate="handleUpdateDate" />
            </div>
          <!-- <div class="calendar-header">
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
        </div> -->
      </main>
      <div class="table-responsive">
        <div class="row">
          <div class="col">
            <table class="table table-hover table-bordered">
              <thead class="table-dark">
                <tr>
                  <th colspan="3">소비</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">분류</th>
                  <td>카드</td>
                  <td>현금</td>
                </tr>
                <tr>
                  <th scope="row">식비</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">주거/통신</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">생활용품</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">의복/미용</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">건강/문화</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">교육/육아</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">교통/차량</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">경조사/회비</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">회비</th>
                  <td></td>
                  <td></td>
                </tr>
                <tr class="table-secondary">
                  <th scope="row">합계</th>
                  <td colspan="2"></td>
                </tr>
              </tbody>
            </table>
            <table class="table table-hover table-bordered">
              <thead class="table-dark">
                <tr>
                  <th colspan="3">수입</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">분류</th>
                  <td>금액</td>
                </tr>
                <tr>
                  <th scope="row">월급</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">용돈</th>
                  <td></td>
                </tr>
                <tr>
                  <th scope="row">이자</th>
                  <td></td>
                </tr>
                <tr class="table-secondary">
                  <th scope="row">합계</th>
                  <td v-if="contentList.length > 0">{{ contentList[0].amount }}</td>
                  <td v-else>-</td>
                  <!-- 배열로 가져온 값을 index값으로 분류해서 합산하는 방법 찾기 -->
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch} from "vue";
import { useContentStore } from "@/stores/content.js";
import MonthNavigator from "@/components/MonthNavigator.vue";

const contentStore = useContentStore();
const { fetchContent, updateDate } = contentStore;
const contentList = computed(() => contentStore.contentList || []);
const currentDate = ref(new Date());
const isLoading = computed(() => contentStore.isLoading);

fetchContent();

//test

//날짜 변경 시 데이터 업데이트
watch(currentDate, (newDate) => {
  updateDate(newDate);
  fetchContent();
})

// 날짜 변경 처리 함수
const handleUpdateDate = (newDate) => {
  currentDate.value = newDate;

};

// 현재 날짜를 기준으로 초기값 설정
// const today = new Date();
const currentYear = ref(currentDate.value.getFullYear());
const currentMonth = ref(currentDate.value.getMonth() + 1); // 월은 0부터 시작하므로 +1

// 편집 모드 상태
const isEditingYear = ref(false);
const isEditingMonth = ref(false);

const currentMonthDisplay = computed(() => {
  return currentMonth.value < 10 ? `0${currentMonth.value}` : currentMonth.value.toString();
});

// 현재 월 표시 문자열 (0을 포함한 형식)
// const currentMonthDisplay = computed(() => {
//   return currentMonth.value < 10
//     ? `${currentMonth.value}`
//     : currentMonth.value.toString();
// });

// 이전 달로 이동합니다.
const prevMonth = () => {
  if (currentMonth.value === 1) {
    currentMonth.value = 12;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
  updateCurrentDate();
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
// 현재 날짜 업데이트 함수
const updateCurrentDate = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1);
};


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
