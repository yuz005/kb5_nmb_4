<template>
    <div class="home">
        <Nav
            :profileImage="profile.profileImage"
            :profileNickname="profile.nickname"
            :profileEmail="profile.email"
        />
        <main class="main-content">
            <div class="header">
                <div class="calendar-header">
                    <button @click="prevMonth" class="arrow-button">←</button>
                    <div @dblclick="enableEditing" class="date-display">
                        <input
                            v-if="isEditingYear"
                            v-model="currentYear"
                            @blur="disableEditing"
                            class="date-input"
                        />
                        <h1 v-else>{{ currentYear }}년</h1>
                        <input
                            v-if="isEditingMonth"
                            v-model="currentMonthDisplay"
                            @blur="disableEditing"
                            class="date-input"
                        />
                        <h1 v-else>{{ currentMonthDisplay }}월</h1>
                    </div>
                    <button @click="nextMonth" class="arrow-button">→</button>
                </div>
            </div>
            <div class="content">
                <CalendarComponent
                    :year="currentYear"
                    :month="currentMonth"
                    :content="content"
                    @showContent="showContent"
                />
                <div class="daily-summary" :class="{ editing: isEditing }">
                    <h2>당일 소비 현황</h2>
                    <textarea
                        v-if="isEditing"
                        v-model="selectedContent"
                        class="content-input"
                    ></textarea>
                    <p v-else>{{ selectedContent }}</p>
                    <div class="buttons">
                        <button @click="saveContent" class="save-button">
                            저장
                        </button>
                        <button @click="editContent" class="edit-button">
                            수정
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMainStore } from "../stores/content.js"; // 경로를 content.js로 수정
import CalendarComponent from "../components/CalendarComponent.vue"; // 캘린더 컴포넌트
import Nav from "../components/Nav.vue"; // 네비게이션 컴포넌트

const store = useMainStore();
const profile = store.profile;

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const currentMonthDisplay = ref(currentMonth.value + 1);
const selectedContent = ref("");
const isEditing = ref(false);
const isEditingYear = ref(false);
const isEditingMonth = ref(false);
const selectedDate = ref(null);

const content = ref({
    // 예시: 내용이 있는 날짜들
    // '2024-6-1': '6월 1일 내용',
});

onMounted(() => {
    store.fetchAllData();
});

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
    currentMonthDisplay.value = currentMonth.value + 1;
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
    currentMonthDisplay.value = currentMonth.value + 1;
};

const showContent = ({ year, month, day, isDoubleClick, content }) => {
    selectedDate.value = { year, month, day };
    selectedContent.value = content;
    if (isDoubleClick) {
        isEditing.value = true;
    }
};

const saveContent = () => {
    if (selectedDate.value) {
        const { year, month, day } = selectedDate.value;
        // 여기에 내용을 저장하는 로직을 추가합니다 (예: 로컬 스토리지 또는 API 호출)
        content.value[`${year}-${month + 1}-${day}`] = selectedContent.value;
        console.log(
            `Content for ${year}-${month + 1}-${day} saved: ${
                selectedContent.value
            }`
        );
        isEditing.value = false;
    }
};

const editContent = () => {
    isEditing.value = true;
};

const enableEditing = () => {
    isEditingYear.value = true;
    isEditingMonth.value = true;
};

const disableEditing = () => {
    isEditingYear.value = false;
    isEditingMonth.value = false;
    currentMonth.value = parseInt(currentMonthDisplay.value, 10) - 1;
};
</script>

<style scoped>
.home {
    display: flex;
}

.sidebar {
    width: 250px;
    background-color: #f8f9fa;
    padding: 20px;
    border-right: 1px solid #ddd;
}

.profile {
    text-align: center;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
}

.nav {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
}

.nav a {
    margin: 10px 0;
    text-decoration: none;
    color: #333;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: center; /* 가운데 정렬 */
    width: 100%;
}

.arrow-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    margin: 0 10px; /* 화살표 버튼 간격 */
}

.date-display {
    display: flex;
    align-items: center;
    justify-content: center;
}

.date-input {
    width: 60px;
    text-align: center;
    margin: 0 5px;
    font-size: 1.2rem;
}

.calendar-header h1 {
    margin: 0 5px;
    font-size: 1.5rem;
    cursor: pointer;
}

.content {
    display: flex;
    margin-top: 20px;
}

.calendar {
    flex: 2;
}

.daily-summary {
    flex: 1;
    margin-left: 20px;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s;
}

.daily-summary h2 {
    text-align: center; /* 제목을 가운데 정렬 */
    margin-bottom: 20px; /* 아래쪽 여백 추가 */
}

.daily-summary.editing {
    background-color: #f0f4c3;
}

.content-input {
    width: 100%;
    height: 100px;
    border: 1px solid #ddd;
    padding: 10px;
    box-sizing: border-box;
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
    border: 1px solid #ddd;
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
