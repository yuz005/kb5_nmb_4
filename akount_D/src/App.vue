<script setup>
import { RouterLink, RouterView } from "vue-router";

import Loading from "@/components/Loading.vue";
import Nav from "@/components/Nav.vue";

</script>

<template>
    <div class="container">
        <Nav></Nav>
        <Loading />
        <router-view />
    </div>
</template>

<style scoped></style>
