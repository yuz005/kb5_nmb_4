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
            <div class="content-wrapper">
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
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMainStore, useContentStore } from "../stores/content.js";
import CalendarComponent from "../components/CalendarComponent.vue";
import Nav from "../components/Nav.vue";

const mainStore = useMainStore();
const profile = mainStore.profile;

const contentStore = useContentStore();
const content = contentStore.contentList;

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const currentMonthDisplay = ref(currentMonth.value + 1);
const selectedContent = ref("");
const isEditing = ref(false);
const isEditingYear = ref(false);
const isEditingMonth = ref(false);
const selectedDate = ref(null);

onMounted(() => {
    mainStore.fetchAllData();
    contentStore.fetchContent();
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
    align-items: center; /* 중앙 정렬 */
}

.header {
    display: flex;
    justify-content: space-between;
    width: 100%; /* 전체 너비로 확장 */
    max-width: 1200px; /* 원하는 최대 너비로 설정 */
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.arrow-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    margin: 0 10px;
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

.content-wrapper {
    display: flex;
    justify-content: center; /* 가운데 정렬 */
    width: 100%;
}

.content {
    display: flex;
    margin-top: 20px;
    width: 100%;
    max-width: 1200px; /* 원하는 최대 너비로 설정 */
    justify-content: space-between; /* 캘린더와 요약을 양 끝으로 배치 */
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
    text-align: center;
    margin-bottom: 20px;
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
