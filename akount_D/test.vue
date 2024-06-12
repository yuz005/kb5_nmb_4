<template>
    <div class="container d-flex flex-column">
        <div class="row">
            <div class="columns">
                <p>소비 현황</p>
                <div class="d-flex justify-content-center mb-3">
                    <button @click="prevMonth" class="arrow-button">←</button>
                    <span class="mx-3">{{ currentMonthLabel }}</span>
                    <button @click="nextMonth" class="arrow-button">→</button>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>날짜</th>
                            <th>카테고리</th>
                            <th>금액</th>
                            <th>메모</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredContentList" :key="item.id">
                            <Contents :contents="item" />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col button-group d-flex justify-content-end mt-3">
                <button class="btn btn-secondary">추가</button>
                <button class="btn btn-secondary">수정</button>
                <button class="btn btn-secondary">삭제</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useContentStore } from "@/stores/content.js";
import Contents from "@/components/contents.vue";

const contentStore = useContentStore();
const { fetchContent } = contentStore;

const contentList = computed(() => contentStore.contentList);

const currentDate = ref(new Date());

const currentMonthLabel = computed(() => {
    const options = { year: "numeric", month: "long" };
    return currentDate.value.toLocaleDateString("ko-KR", options);
});

const filteredContentList = computed(() => {
    const startOfMonth = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        1
    );
    const endOfMonth = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        0
    );
    return contentList.value.filter((item) => {
        const itemDate = new Date(item.date.replace(/-/g, "/")); // item.date를 날짜 형식으로 변환
        return itemDate >= startOfMonth && itemDate <= endOfMonth;
    });
});

const prevMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
    );
};

const nextMonth = () => {
    currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
    );
};

onMounted(() => {
    fetchContent();
});
</script>

<style scoped>
p {
    text-align: center;
    font-size: 2rem;
}
table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
}
th,
td {
    border: 1px solid black;
    padding: 8px;
    text-align: center;
}
th {
    background-color: #f2f2f2;
}
.button-group button {
    margin-right: 10px; /* 버튼 사이의 간격 설정 */
}
.arrow-button {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}
</style>
