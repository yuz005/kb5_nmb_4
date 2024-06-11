<template>
    <!-- 네비게이션 바를 정의합니다. Bootstrap 클래스들을 사용합니다. -->
    <nav class="bg-light flex-column sidebar">
        <!-- 브랜드 이름을 표시합니다. -->
        <span class="navbar-brand ps-2">지갑 탐정</span>
        <!-- 네비게이션 메뉴를 정의합니다. 'collapse' 클래스를 사용하여 기본적으로 숨겨지도록 설정합니다. -->
        <div>
            <!-- 네비게이션 메뉴 항목을 정의합니다. -->
            <ul class="navbar-nav flex-column">
                <li class="nav-item">
                    <!-- Vue Router를 사용하여 페이지 간의 네비게이션을 처리합니다. -->
                    <router-link class="nav-link" to="/">
                        <font-awesome-icon :icon="['fas', 'house']" /> Home
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/write">
                        <font-awesome-icon :icon="['far', 'calendar-plus']" />
                        추가 / 수정
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/summary">
                        <font-awesome-icon :icon="['fas', 'chart-pie']" /> 내용
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/profile">
                        <font-awesome-icon :icon="['fas', 'gear']" /> 계정
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
</script>

<style scoped>
.sidebar {
    width: 200px; /* 네비게이션 바의 너비를 설정합니다. */
    margin: 0; /* 모든 외부 여백을 제거합니다. */
    padding: 0; /* 모든 내부 여백을 제거합니다. */
    position: fixed; /* 화면에 고정합니다. */
    top: 0; /* 상단 여백을 제거합니다. */
    left: 0; /* 왼쪽 여백을 제거합니다. */
    height: 100%; /* 화면 높이에 맞춥니다. */
}
</style>
