<template>
    <div v-if="isLoading" class="loading-overlay">
        <img src="../assets/wallet.png" class="animated-image"/>
    </div>    
</template>

<script setup>
import { useLoadingStore } from "@/stores/loading.js";
import { computed } from "vue";

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1000;
}

.animated-image {
  max-width: 10%; /* 이미지 크기를 현재의 50%로 줄임 */
  animation: moveSideToSide 1s infinite alternate;
}

@keyframes moveSideToSide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(50px);
  }
}

/* .loading-icon {
    font-size: 3rem;
    color: #3498db;
} */

</style>