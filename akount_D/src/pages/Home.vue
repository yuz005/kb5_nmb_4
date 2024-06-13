<template>
    <div class="home">
        <MonthNavigator
            :currentDate="currentDate"
            :isLoading="isLoading"
            @updateDate="updateDate" class="mt-5"
        />
        <div class="content-wrapper mt-5">
            <div class="main-content">
                <CalendarComponent
                    :year="currentDate.getFullYear()"
                    :month="currentDate.getMonth()"
                    :content="contentStore.state.contentList"
                    @showContent="handleShowContent"
                />
            </div>
            <div class="consumption-component">
                <Consumption
                    :initialMemo="selectedMemo"
                    :initialAmount="selectedAmount"
                    :selectedDate="selectedDate"
                    :isEditing="isEditing"
                    @updateIsEditing="handleUpdateIsEditing"
                    @saveContent="handleSaveContent"
                    @deleteContent="handleDeleteContent"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useContentStore } from "@/stores/content";
import MonthNavigator from "@/components/MonthNavigator.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import Consumption from "@/components/Consumption.vue";

const currentDate = ref(new Date());
const isLoading = ref(false);
const contentStore = useContentStore();

const showConsumption = ref(true);
const selectedDate = ref(null);
const selectedMemo = ref("");
const selectedAmount = ref(0);
const isEditing = ref(false);

const handleShowContent = async ({
    year,
    month,
    day,
    isDoubleClick,
    content,
}) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        day
    ).padStart(2, "0")}`;
    await contentStore.fetchContent(dateStr);
    const selectedContent = contentStore.state.contentList.find((item) =>
        item.datetime.startsWith(dateStr)
    );
    selectedDate.value = dateStr;
    selectedMemo.value = selectedContent ? selectedContent.memo : "";
    selectedAmount.value = selectedContent ? selectedContent.amount : 0;
    if (isDoubleClick) {
        isEditing.value = true;
    }
};

const handleUpdateIsEditing = (editing) => {
    isEditing.value = editing;
};

const handleSaveContent = async (date, amount, memo) => {
    await contentStore.saveContent(date, amount, memo);
    await contentStore.fetchContent(date);
};

const handleDeleteContent = async () => {
    const contentToDelete = contentStore.state.contentList.find(
        (item) =>
            item.datetime === selectedDate.value &&
            item.amount === selectedAmount.value &&
            item.memo === selectedMemo.value
    );
    if (contentToDelete) {
        await contentStore.deleteContent(contentToDelete.id);
        await contentStore.fetchContent(selectedDate.value);
    }
};

const updateDate = (newDate) => {
    currentDate.value = newDate;
    contentStore.fetchContent();
};

const goHome = () => {
    currentDate.value = new Date();
    contentStore.fetchContent();
};

onMounted(() => {
    contentStore.fetchContent();
});
</script>

<style scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.navbar {
    width: 100%;
    margin-bottom: 20px;
}

.content-wrapper {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 20px;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.consumption-component {
    flex: 0.5;
    display: flex;
    /* 캘린더의 절반 크기로 설정 */
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
