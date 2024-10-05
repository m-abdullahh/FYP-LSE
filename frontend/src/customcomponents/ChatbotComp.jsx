import React, { useState } from "react";
import { X, MessageCircle, Send, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatbotComp() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Doe", content: "Hi there! How are you?", time: "2:30 PM" },
    { id: 2, sender: "You", content: "Hello! I'm doing well, thanks for asking. How about you?", time: "2:31 PM" },
    { id: 3, sender: "John Doe", content: "I'm great! Just wanted to catch up. Any exciting projects you're working on?", time: "2:32 PM" },
  ]);
  const [chatHistory, setChatHistory] = useState([
    { id: 1, name: "John Doe", lastMessage: "Any exciting projects you're working on?", time: "2:32 PM", unread: true },
    { id: 2, name: "Jane Smith", lastMessage: "Thanks for the recommendation!", time: "Yesterday", unread: false },
    { id: 3, name: "Bob Johnson", lastMessage: "Let's schedule a call next week.", time: "2 days ago", unread: false },
  ]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("message");
    if (input.value.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "You",
        content: input.value,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, newMessage]);
      setChatHistory(chatHistory.map((chat) => (chat.id === activeChat ? { ...chat, lastMessage: input.value, time: newMessage.time } : chat)));
      input.value = "";
    }
  };

  const handleChatSelect = (id) => {
    setActiveChat(id);
    setChatHistory(chatHistory.map((chat) => (chat.id === id ? { ...chat, unread: false } : chat)));
  };

  return (
    <div className="fixed bottom-0 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-t-lg shadow-lg w-[720px] flex flex-col h-[480px]">
          <div className="flex border-b">
            <div className="w-1/3 border-r">
              <div className="p-4">
                <Input type="text" placeholder="Search messages" className="w-full" />
              </div>
              <ScrollArea className="h-[calc(480px-65px)]">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 hover:bg-muted cursor-pointer ${activeChat === chat.id ? "bg-muted" : ""}`}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${chat.id}`} alt={chat.name} />
                        <AvatarFallback>
                          {chat.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <h3 className="font-semibold text-sm">{chat.name}</h3>
                        <p className={`text-xs truncate ${chat.unread ? "font-semibold" : "text-muted-foreground"}`}>{chat.lastMessage}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.pravatar.cc/32?u=1" alt="John Doe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">John Doe</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-grow p-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex flex-col mb-4 ${message.sender === "You" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-lg p-2 max-w-[80%] ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">{message.time}</span>
                  </div>
                ))}
              </ScrollArea>
              <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center">
                <Input type="text" placeholder="Type a message..." name="message" className="flex-grow mr-2" />
                <Button type="submit" size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={toggleChat}
          className="rounded-t-lg h-12 w-full max-w-[720px] bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-between px-4"
        >
          <span className="font-semibold">Messaging</span>
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
