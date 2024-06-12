<template>
  <div class="container mt-5">
    <div class="row col">
      <h2>마이페이지</h2>
      <form>
        <div class="mt-4 mb-3">
          <div class="d-flex align-items-center">
            <img
              src="../assets/profile.png"
              class="rounded-circle me-3"
              width="100"
              height="100" />
            <div>
              <div class="fw-bold">{{ profileStore.state.nickname }}</div>
              <div class="text-muted">
                @ {{ profileStore.state.account_id }}
              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 mb-3">
          <label for="nickname" class="form-label">별명</label>
          <input
            type="text"
            class="form-control"
            :placeholder="profileStore.state.nickname"
            v-model="profileStore.state.nickname" />
        </div>
        <div class="mt-3 mb-3">
          <label for="email" class="form-label">이메일</label>
          <input
            type="text"
            class="form-control"
            :placeholder="profileStore.state.email"
            v-model="profileStore.state.email" />
        </div>
        <div class="mt-3 mb-3">
          <label for="phone_number" class="form-label">전화번호</label>
          <input
            type="text"
            class="form-control"
            :placeholder="profileStore.state.phone_number"
            v-model="profileStore.state.phone_number" />
        </div>
        <div class="d-md-flex justify-content-md-end">
          <button
            type="button"
            class="btn btn-primary btn-block mt-3"
            @click="profileStore.saveChanges">
            변경 사항 저장
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { reactive, onMounted } from "vue";
import axios from "axios";
//import { useProfileStore } from "@/stores/content.js";

const currentRoute = useRoute();
//const profileStore = useProfileStore();

onMounted(() => {
  profileStore.fetchData();
});
</script>
