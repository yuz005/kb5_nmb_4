<script setup>
import { useRouter } from "vue-router";
import { useContentStore } from "@/stores/content.js";
import { onMounted } from "vue";

defineProps({
    contents: { Type: Object, required: true },
});

const router = useRouter();
const contentStore = useContentStore();
onMounted(() => {
    console.log(`컴포넌트가 마운트 됐습니다.`);
});
</script>

<template>
    <tr>
        <td><input type="checkbox" /></td>
        <td>{{ contents.datetime }}</td>
        <td>{{ contents.category_id }}</td>
        <td>{{ contents.amount }}</td>
        <td>{{ contents.memo }}</td>
    </tr>
</template>
