<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');

const handleLogin = () => {
  if (username.value.trim()) {
    router.push(`/chat?username=${username.value.trim()}`);
  }
};
</script>

<template>
  <div class="flex items-center justify-center h-screen w-full">
    <div class="flex flex-col items-center border border-gray-200 rounded p-4 w-md">
      <p class="font-medium text-lg mb-4">Enter a username</p>
      <input 
        v-model="username"
        @keyup.enter="handleLogin"
        class="border border-gray-200 p-2 rounded outline-none text-sm mb-4 w-full focus:border-blue-500"
        type="text"
        placeholder="Enter your username"
      >
      <button 
        @click="handleLogin"
        class="bg-blue-500 text-gray-50 w-full p-2 hover:bg-blue-600 transition ease duration-300 cursor-pointer text-center"
      >
        Login
      </button>
    </div>
  </div>
</template>
