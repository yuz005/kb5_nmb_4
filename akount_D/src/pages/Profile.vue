<template>
    <div class="container d-flex justify-content-center align-items-start min-vh-100 py-5">
        <div class="row col-12 col-md-8 col-lg-6">
            <h2 class="text-center mb-4"> 마이페이지 </h2>
            <form>
                <div class="mb-4 d-flex align-items-center justify-content-center">
                    <div class="d-flex align-items-center">
                        <img src="../assets/profile.png" class="rounded-circle me-3" width="100" height="100"> 
                        <div>                   
                            <div class="fw-bold">{{ profileStore.profile.nickname }} 님</div>
                            <div class="text-muted">@ {{ profileStore.profile.account_id }}</div> 
                        </div>
                    </div>                   
                </div>
                <div class="mt-3 mb-3">
                    <label for="nickname" style="font-weight: bold" class="form-label">별명</label>
                    <input type="text" class="form-control" :placeholder="profileStore.profile.nickname" v-model="nickname">
                </div>
                <div class="mt-3 mb-3">
                    <label for="email" style="font-weight: bold" class="form-label">이메일</label>
                    <input type="text" class="form-control" :placeholder="profileStore.profile.email" v-model="email">
                </div>
                <div class="mt-3 mb-3">
                    <label for="phone_number" style="font-weight: bold" class="form-label">전화번호</label>
                    <input type="text" class="form-control" :placeholder="profileStore.profile.phone_number" v-model="phone_number">
                </div>
                <div class="d-md-flex justify-content-md-end">
                    <button type="button" class="btn btn-primary btn-block mt-3" @click="saveChanges">변경 사항 저장</button>
                </div>
            </form>
        </div>
    </div>
  </template>
  
  
  <script setup>
  import { useRoute } from "vue-router";
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useMainStore } from "@/stores/content.js";
  
  const currentRoute = useRoute();
  const profileStore = useMainStore();

  const nickname = ref('');
  const email = ref('');
  const phone_number = ref('');
  
  onMounted(async() => {
      await profileStore.fetchProfile();
      nickname.value=profileStore.profile.nickname;
      email.value=profileStore.profile.email;
      phone_number.value=profileStore.profile.phone_number;
  });
  
  
  
  const saveChanges = async() => {
    profileStore.profile.nickname=nickname.value;
    profileStore.profile.email=email.value;
    profileStore.profile.phone_number=phone_number.value;
    await profileStore.saveProfile();
  }
  
  </script>