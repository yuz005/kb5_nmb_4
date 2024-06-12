<template>
    <div class="daily-summary col-md-4 p-3 border rounded">
        <h2>당일 소비 현황</h2>
        <div v-if="isEditing">
            <div v-for="item in filteredContent" :key="item.id" class="mb-3">
                <div class="form-label">날짜</div>
                <input
                    type="date"
                    v-model="item.datetime"
                    class="form-control mb-2"
                />
                <div class="form-label">금액</div>
                <input
                    type="number"
                    v-model="item.amount"
                    class="form-control mb-2"
                    placeholder="금액 입력"
                />
                <div class="form-label">메모</div>
                <textarea
                    v-model="item.memo"
                    class="form-control content-input mb-2"
                    placeholder="메모 입력"
                ></textarea>
            </div>
            <div class="buttons d-flex justify-content-end">
                <button @click="saveAllContent" class="btn btn-success me-2">
                    저장
                </button>
            </div>
        </div>
        <div v-else>
            <div v-for="item in filteredContent" :key="item.id" class="mb-3">
                <div class="form-label">{{ formatDate(item.datetime) }}</div>
                <p>{{ item.amount }}원</p>
                <p>{{ item.memo }}</p>
            </div>
            <div class="buttons d-flex justify-content-end">
                <button @click="editContent" class="btn btn-warning">
                    수정
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useContentStore } from "@/stores/content.js";

const props = defineProps({
    initialMemo: {
        type: String,
        required: true,
    },
    initialAmount: {
        type: Number,
        required: true,
    },
    selectedDate: {
        type: Object,
        required: true,
    },
    isEditing: Boolean,
    onSave: Function,
});

const emits = defineEmits(["updateIsEditing"]);

const contentStore = useContentStore();
const contentList = computed(() => contentStore.contentList);
const filteredContent = computed(() => {
    if (!props.selectedDate) return [];
    const dateStr = `${props.selectedDate.year}-${String(
        props.selectedDate.month + 1
    ).padStart(2, "0")}-${String(props.selectedDate.day).padStart(2, "0")}`;
    return contentList.value.filter((item) =>
        item.datetime.startsWith(dateStr)
    );
});

const selectedMemo = ref(props.initialMemo);
const selectedAmount = ref(props.initialAmount);

onMounted(async () => {
    await contentStore.fetchContent();
});

watch(
    () => props.selectedDate,
    async (newVal) => {
        if (newVal) {
            await contentStore.fetchContent();
        }
    }
);

const saveAllContent = async () => {
    emits("updateIsEditing", false);
    for (const item of filteredContent.value) {
        if (props.onSave) {
            const dateStr = new Date(item.datetime).toISOString();
            await props.onSave(dateStr, item.amount, item.memo);
        }
    }
};

const editContent = () => {
    emits("updateIsEditing", true);
};

// Format date to "YY-MM-DD"
const formatDate = (datetime) => {
    const date = new Date(datetime);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.daily-summary {
    flex: 1;
    border: 1px solid #ddd;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
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
