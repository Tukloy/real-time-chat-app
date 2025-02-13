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
  <div class="chat-container">
    <h2>Chat App</h2>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..." />
    <ul>
  <li v-for="(msg, index) in messages" :key="index">
    <strong>{{ msg.username }}:</strong> {{ msg.text }}
  </li>
</ul>

  </div>
</template>

<style scoped>
.chat-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #e1f5fe;
  padding: 8px;
  margin-bottom: 5px;
  border-radius: 4px;
}
</style>
