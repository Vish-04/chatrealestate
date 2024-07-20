import { UserType, UserPreferencesType, ChatHistoryType } from "./types";
import { v4 as uuidv4 } from 'uuid';

type FetchUserType = {
    email: string,
    setUserInfo: (data:any)=>void
}

type FetchChatHistoryType = {
    chatId: string[],
    email: string,
    setChatHistory: (data:any)=>void
}

export const fetchUser = async ({ email, setUserInfo }: FetchUserType) => {
    const response = await fetch('/api/auth/user', {
      method: 'POST',
      body: JSON.stringify({ email: email }),
    });

    // If user is not logged in, redirect to login
    if (response.status !== 200) {
      window.location.href = "/api/auth/login"
    }

    const data = await response.json();
    setUserInfo(data);
  }

export const fetchChatHistory = async ({ chatId, email, setChatHistory }: FetchChatHistoryType) => {
    const response = await fetch('/api/chat/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chat_uuid: chatId[0], email: email })
    });

    if (response.status === 200) {
      const data = await response.json();
      setChatHistory({
        chatId: {S: chatId[0] as string},
        email: {S: email as string},
        messages: {L: data.messages.L}
      });
      console.log("FETCHED CHAT HISTORY")
    } else {
      console.error('Error fetching chat history');
    }
  }; 

type CreateChatType = {
    email: string,
    initialMessage: string
}
  
export const createChat = async ({ email, initialMessage }: CreateChatType) => {
    const chat_uuid = uuidv4();
    const response = await fetch('/api/chat/create', {
      method: 'POST',
      body: JSON.stringify({ email: email, chat_uuid: chat_uuid, initialMessage: initialMessage }),
    });

    if (response.status !== 200) {
      console.log("Error creating chat")
    } else {
      window.location.href = `/chat/${chat_uuid}?initialMessage=${initialMessage}`;
    }

}

type UpdateChatType = {
    chatHistory: ChatHistoryType,
    setChatHistory: (data:any)=>void,
    email: string
}

export const updateChatTable = async ({ chatHistory, setChatHistory, email }: UpdateChatType) => {
    try {
      const response = await fetch('/api/chat/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatObject: {
            chatId: chatHistory.chatId,
            messages: chatHistory.messages,
          },
          email: email,
        }),
      });

      if (response.status !== 200) {
        console.error('Error updating chat table');
      } else {
        console.log('Chat table updated successfully');

        setChatHistory(chatHistory);
      console.log("UPDATED IN CLICK")
      }
    } catch (error) {
      console.error('Error updating chat table:', error);
    }
};