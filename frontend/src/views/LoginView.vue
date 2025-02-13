<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const username = ref('');

const handleLogin = () => {
  if (username.value) {
    // Navigate to chat page with the username as a query parameter
    router.push(`/chat?username=${username.value}`);
  }
};

</script>
<template>
    <div class="flex items-center justify-center h-screen w-full">
       <div class="flex flex-col items-center border-1 border-gray-200 rounded p-4 w-md">
        <p class="font-medium text-lg mb-4">Enter a username</p>
        <input v-model="username" @keyup.enter="handleLogin" class="border-1 border-gray-200 p-2 rounded outline-none text-sm mb-4 w-full focus:border-blue-500" type="text">
        <RouterLink :to="'/chat?username=' + username" class="bg-blue-500 text-gray-50 w-full p-2 hover:bg-blue-600 transition ease duration-300 cursor-pointer text-center">Login</RouterLink>
       </div>
    </div>
</template>