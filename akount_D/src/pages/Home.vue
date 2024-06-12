<template>
    <div class="home container">
        <Nav
            :profileImage="profile.profileImage"
            :profileNickname="profile.nickname"
            :profileEmail="profile.email"
        />
        <main class="main-content mt-0.1">
            <div
                class="header d-flex justify-content-center align-items-center mb-3"
            >
                <button @click="prevMonth" class="btn btn-light arrow-button">
                    ←
                </button>
                <div
                    @dblclick="enableEditing"
                    class="date-display d-flex align-items-center"
                >
                    <input
                        v-if="isEditingYear"
                        v-model="currentYear"
                        @blur="disableEditing"
                        class="form-control date-input"
                    />
                    <h1 v-else>{{ currentYear }}년</h1>
                    <input
                        v-if="isEditingMonth"
                        v-model="currentMonthDisplay"
                        @blur="disableEditing"
                        class="form-control date-input"
                    />
                    <h1 v-else>{{ currentMonthDisplay }}월</h1>
                </div>
                <button @click="nextMonth" class="btn btn-light arrow-button">
                    →
                </button>
            </div>
            <div class="content-wrapper row">
                <div class="calendar-card col-md-8">
                    <CalendarComponent
                        :year="currentYear"
                        :month="currentMonth"
                        :content="transactions"
                        @showContent="showContent"
                    />
                </div>
                <Consumption
                    :initialMemo="selectedMemo"
                    :initialAmount="selectedAmount"
                    :selectedDate="selectedDate"
                    :isEditing="isEditing"
                    @updateIsEditing="updateIsEditing"
                    :onSave="saveContent"
                />
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMainStore } from "@/stores/content.js";
import CalendarComponent from "../components/CalendarComponent.vue";
import Nav from "../components/Nav.vue";
import Consumption from "../components/Consumption.vue";

const mainStore = useMainStore();
const profile = mainStore.profile;
const transactions = mainStore.transactions;

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const currentMonthDisplay = ref(currentMonth.value + 1);
const selectedMemo = ref("");
const selectedAmount = ref("");
const isEditing = ref(false);
const isEditingYear = ref(false);
const isEditingMonth = ref(false);
const selectedDate = ref(null);

onMounted(() => {
    mainStore.fetchAllData();
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
    if (content) {
        selectedMemo.value = content.memo;
        selectedAmount.value = content.amount;
    } else {
        selectedMemo.value = "";
        selectedAmount.value = "";
    }
    if (isDoubleClick) {
        isEditing.value = true;
    }
};

const updateIsEditing = (value) => {
    isEditing.value = value;
};

const saveContent = async (datetime, amount, memo) => {
    const [year, month, day] = datetime.split("-");
    selectedDate.value = {
        year: parseInt(year),
        month: parseInt(month) - 1,
        day: parseInt(day),
    };
    let transactionDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
    )}`;

    let transaction = transactions.value.find((t) =>
        t.datetime.startsWith(transactionDate)
    );

    if (transaction) {
        transaction.memo = memo;
        transaction.amount = amount;
        await mainStore.updateTransaction(transaction);
    } else {
        transaction = {
            datetime: `${transactionDate}T00:00:00+09:00`,
            category_id: 0, // 적절한 category_id 설정
            amount: amount,
            memo: memo,
        };
        await mainStore.addTransaction(transaction);
        transactions.value.push(transaction); // 트랜잭션 배열을 업데이트하려면 이 행을 추가
    }
};
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 50px;
    padding-left: 20px;
    width: calc(100% - 50px);
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    font-size: 2rem;
    cursor: pointer;
}

.content-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
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
