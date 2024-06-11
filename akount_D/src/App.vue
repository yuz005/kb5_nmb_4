<script setup>
import { computed } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { useContentStore } from "@/stores/content.js";

import Nav from "@/components/Nav.vue";

const store = useContentStore();
const fetchContent = store.fetchContent;
fetchContent();
</script>

<template>
    <div class="container">
        <Nav></Nav>
        <router-view />
    </div>
</template>

<style scoped></style>
