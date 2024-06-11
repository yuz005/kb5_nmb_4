<template>
    <div class="container">
        <div class="row">
            <div class="columns">
                <p>소비 현황</p>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <div class="col">
                <ul class="list-group">
                    <Contents
                        v-for="item in contentList"
                        :key="item.id"
                        :contents="item"
                    />
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useContentStore } from "@/stores/content.js";
import Contents from "@/components/contents.vue";

const contentStore = useContentStore();
const { fetchContent } = contentStore;
fetchContent();
console.log("test", contentStore.contentList);
const contentList = computed(() => contentStore.contentList);
</script>
