<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";

const route = useRoute();
const router = useRouter();
const username = ref(route.query.username || "Guest");
const room = ref(route.query.room || "General");

const socket = io("http://localhost:5000");

const message = ref("");
const messages = ref([]);
const availableRooms = ["General", "Sports", "Technology", "Gaming", "Music"]; // Example rooms

// Join room when component mounts
onMounted(() => {
  joinRoom(room.value);
});

// Cleanup on unmount
onUnmounted(() => {
  socket.disconnect();
});

// Watch for room changes and rejoin
watch(room, (newRoom, oldRoom) => {
  if (oldRoom) {
    socket.emit("leaveRoom", { username: username.value, room: oldRoom });
  }
  joinRoom(newRoom);
});

// Function to join a new room
const joinRoom = (newRoom) => {
  messages.value = []; // Clear messages when switching rooms
  console.log(`Joining room: ${newRoom}`);
  
  // Remove previous event listener to avoid duplicates
  socket.off("message");

  // Emit event to join new room
  socket.emit("joinRoom", { username: username.value, room: newRoom });

  // Attach new event listener
  socket.on("message", (msg) => {
    console.log("Message received:", msg);
    messages.value.push(msg);
  });
};

// Send message
const sendMessage = () => {
  if (message.value.trim() !== "") {
    const chatMessage = {
      username: username.value,
      room: room.value,
      text: message.value,
    };
    socket.emit("message", chatMessage);
    message.value = "";
  }
};

// Change room function
const changeRoom = (newRoom) => {
  if (newRoom !== room.value) {
    room.value = newRoom;
    router.push({ query: { username: username.value, room: newRoom } });
  }
};
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 class="text-lg font-bold mb-4">Chat Rooms</h2>
      <p class="text-sm mb-2">You are in: <span class="font-semibold">{{ room }}</span></p>

      <!-- Room List -->
      <ul class="space-y-2">
        <li v-for="r in availableRooms" :key="r">
          <button @click="changeRoom(r)" 
            class="w-full text-left p-2 rounded-lg transition"
            :class="r === room ? 'bg-blue-500' : 'hover:bg-gray-700'">
            {{ r }}
          </button>
        </li>
      </ul>
    </div>

    <!-- Chat Container -->
    <div class="flex-1">
      <div class="flex flex-col p-4 bg-gray-100 h-full">
        <h2 class="text-xl font-bold text-center mb-4">Chat Room: {{ room }}</h2>

        <!-- Chat Messages -->
        <div class="flex flex-col flex-grow overflow-auto space-y-2 p-4 bg-white rounded-lg shadow-md">
          <div v-for="(msg, index) in messages" :key="index" class="flex"
            :class="{ 'justify-end': msg.username === username, 'justify-start': msg.username !== username }">
            <div class="px-4 py-2 rounded-lg max-w-xs break-words" :class="{
              'bg-blue-500 text-white text-right': msg.username === username,
              'bg-gray-300 text-black text-left': msg.username !== username
            }">
              <span class="text-sm font-semibold block">{{ msg.username }}</span>
              <span>{{ msg.text }}</span>
            </div>
          </div>
        </div>

        <!-- Input Field -->
        <div class="mt-4 flex">
          <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message..."
            class="flex-grow p-2 border border-gray-500 rounded-l-lg focus:outline-none" />
          <button @click="sendMessage" class="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600">
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
