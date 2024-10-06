<script lang="ts" setup>
import { ref } from 'vue';
import { useFetch } from '#imports';

const userMessage = ref('');
const chatHistory = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');
const host = import.meta.env.VITE_API_BASE_URL;

const sendMessage = async () => {
    if (userMessage.value.trim()) {
        chatHistory.value.push({ text: userMessage.value, isUser: true });
        isLoading.value = true;
        errorMessage.value = '';

        try {
            const response = await useFetch(`${host}api/chatgpt/`, {
                method: 'POST',
                body: JSON.stringify({ prompt: userMessage.value })
            });
            chatHistory.value.push({ text: response.data?.message, isUser: false });
        } catch (error) {
            errorMessage.value = 'Error getting response. Please try again.';
            console.error('Error:', error);
        } finally {
            userMessage.value = '';
            isLoading.value = false;
        }
    }
};
</script>

<template>
    <div class="chat-container">
        <div class="messages">
            <div v-for="(message, index) in chatHistory" :key="index" :class="message.isUser ? 'user' : 'bot'">
                {{ message.text }}
            </div>
        </div>
        <form @submit.prevent="sendMessage" class="chat-form">
            <input type="text" v-model="userMessage" :disabled="isLoading" placeholder="Ask something..." />
            <button type="submit" :disabled="isLoading || !userMessage.trim()">Send</button>
        </form>
        <div v-if="isLoading" class="loading-spinner">Loading...</div>
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </div>
</template>

<style scoped>
.chat-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.messages {
    height: 300px;
    overflow-y: auto;
    background: #fff;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.user {
    text-align: right;
    color: black;
    margin: 10px;
    background: #d1f7c4;
    padding: 8px;
    border-radius: 8px;
}

.bot {
    text-align: left;
    color: black;
    margin: 10px;
    background: #f1f1f1;
    padding: 8px;
    border-radius: 8px;
}

.chat-form {
    display: flex;
}

input {
    flex: 1;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-right: 10px;
}

button {
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.loading-spinner {
    text-align: center;
    color: #4caf50;
}

.error-message {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>
