<template>
    <div class="home">
        <aside class="sidebar">
            <div class="profile">
                <h2>{{ profile.nickname }}</h2>
                <p>{{ profile.email }}</p>
            </div>
            <nav class="nav">
                <router-link to="/">Home</router-link>
                <router-link to="/write">추가/수정</router-link>
                <router-link to="/summary">소비요약</router-link>
                <router-link to="/profile">마이 페이지</router-link>
            </nav>
        </aside>
        <main class="main-content">
            <div class="calendar-header">
                <button @click="prevMonth">←</button>
                <h1>{{ currentYear }}년 {{ currentMonth + 1 }}월</h1>
                <button @click="nextMonth">→</button>
            </div>
            <CalendarComponent />
            <div class="summary">
                <h2>당일 소비 현황</h2>
                <!-- 당일 소비 현황 컴포넌트 또는 내용 추가 -->
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useMainStore } from "../stores";
import CalendarComponent from "../components/CalendarComponent.vue"; // 캘린더 컴포넌트

const store = useMainStore();
const profile = store.profile;

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const prevMonth = () => {
    if (currentMonth.value === 0) {
        currentMonth.value = 11;
        currentYear.value -= 1;
    } else {
        currentMonth.value -= 1;
    }
};

const nextMonth = () => {
    if (currentMonth.value === 11) {
        currentMonth.value = 0;
        currentYear.value += 1;
    } else {
        currentMonth.value += 1;
    }
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
    padding: 20px;
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.calendar-header h1 {
    margin: 0;
}

.summary {
    margin-top: 20px;
}
</style>
