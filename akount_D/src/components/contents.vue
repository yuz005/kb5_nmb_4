<script setup>
import { useRouter } from "vue-router";
import { useContentStore } from "@/stores/content.js";
import { ref, computed, onMounted, defineProps, watch } from "vue";

const props = defineProps({
    contents: { type: Object, required: true },
});

const router = useRouter();
const contentStore = useContentStore();

const categories = ref([]);

const getCategoryTitle = (categoryId) => {
    const category = categories.value.find((cat) => cat.id === categoryId);
    return category ? category.title : "Unknown";
};

const fetchCategories = async () => {
    await contentStore.fetchCategories();
    categories.value = contentStore.state.categories;
};

onMounted(fetchCategories);

watch(
    () => contentStore.state.categories,
    (newCategories) => {
        categories.value = newCategories;
    }
);
</script>

<template>
    <td><input type="checkbox" /></td>
    <td>{{ contents.datetime }}</td>
    <td>{{ getCategoryTitle(contents.category_id) }}</td>
    <td>{{ contents.amount }}</td>
    <td>{{ contents.memo }}</td>
    <!-- <td>{{ contents.is_cash }}</td> -->
</template>
