<script setup>
import { RouterLink, RouterView } from "vue-router";

import Nav from "@/components/Nav.vue";
</script>

<template>
    <div class="container">
        <Nav></Nav>
        <router-view />
    </div>
</template>

<style scoped></style>
