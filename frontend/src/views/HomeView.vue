<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { io } from "socket.io-client";

const route = useRoute();
const username = ref();
const socket = io("http://localhost:5000");

const message = ref("");
const messages = ref([]);

onMounted(() => {
  username.value = route.query.username || 'Guest';
  console.log("Socket connected:", socket.connected);

  socket.on("connect", () => {
    console.log("Connected to WebSocket server:", socket.id);
  });

  socket.on("message", (msg) => {
    console.log("Message received in Vue:", msg);
    messages.value.push(msg);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err);
  });
});

onUnmounted(() => {
  socket.off("message");
  socket.off("connect");
  socket.off("disconnect");
  socket.off("connect_error");
  socket.disconnect();
});

const sendMessage = () => {
  if (message.value.trim() !== "") {
    const chatMessage = {
      username: username.value,
      text: message.value,
    };
    console.log("Sending message:", chatMessage);
    socket.emit("message", chatMessage);
    message.value = "";
  }
};

</script>
<template>
  <div class="flex h-screen">
    <div class="w-sm">this is the side bar</div>
    <div class="flex-1">
      <div class="flex flex-col p-4 bg-gray-100 h-full">
        <h2 class="text-xl font-bold text-center mb-4">Chat App</h2>

        <div class="flex flex-col flex-grow overflow-auto space-y-2 p-4 bg-white rounded-lg shadow-md">
          <div v-for="(msg, index) in messages" :key="index" class="flex"
            :class="{ 'justify-end': msg.username === username, 'justify-start': msg.username !== username }">
            <div class="px-4 py-2 rounded-lg max-w-xs break-words" :class="{
              'bg-blue-500 text-white  text-right': msg.username === username,
              'bg-gray-300 text-black  text-left': msg.username !== username
            }">
              <span class="text-sm font-semibold block">{{ msg.username }}</span>
              <span>{{ msg.text }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex">
          <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..."
            class="flex-grow p-2 border-1 border-gray-500 rounded-l-lg focus:outline-none" />
          <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
