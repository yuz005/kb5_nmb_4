<template>
    <!-- 네비게이션 바를 정의합니다. Bootstrap 클래스들을 사용합니다. -->
    <nav class="bg-dark navbar-dark flex-column">
        <!-- 브랜드 이름을 표시합니다. -->
        <span class="navbar-brand ps-2">TodoList App</span>
        <!-- 네비게이션 메뉴를 정의합니다. 'collapse' 클래스를 사용하여 기본적으로 숨겨지도록 설정합니다. -->
        <div>
            <!-- 네비게이션 메뉴 항목을 정의합니다. -->
            <ul class="navbar-nav flex-column">
                <li class="nav-item">
                    <!-- Vue Router를 사용하여 페이지 간의 네비게이션을 처리합니다. -->
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li class="nav-item">
                    <router-link class="nav-link" to="/about"
                        >About</router-link
                    >
                </li>
                <li class="nav-item"></li>
            </ul>
        </div>
    </nav>
</template>

<script setup></script>
