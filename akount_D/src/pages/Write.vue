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
                <table>
                    <thead>
                        <tr>
                            <th>체크박스</th>
                            <th>날짜</th>
                            <th>카테고리</th>
                            <th>금액</th>
                            <th>메모</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in contentList" :key="item.id">
                            <Contents :contents="item" />
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- <Contents
                          v-for="item in contentList"
                          :key="item.id"
                          :contents="item"
                      /> -->
</template>

<script setup>
import { computed } from "vue";
import { useContentStore } from "@/stores/content.js";
import Contents from "@/components/contents.vue";

const contentStore = useContentStore();
const { fetchContent } = contentStore;
fetchContent();
const contentList = computed(() => contentStore.contentList);
</script>
<style>
table {
    width: 100%;
    border-collapse: collapse;
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
</style>
