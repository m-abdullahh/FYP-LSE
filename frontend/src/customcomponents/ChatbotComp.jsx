import React, { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BotMessageSquare } from "lucide-react";

export default function ChatBotComp() {
  const [isOpen, setIsOpen] = useState(false);

  const formatChatbotResponse = (response) => {
    let responseArray = response.split("**");
    let formattedResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i % 2 === 1) {
        formattedResponse += "<b>" + responseArray[i] + "</b>";
      } else {
        formattedResponse += responseArray[i];
      }
    }

    return formattedResponse.split("*").join("<br>");
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ChatBot",
      content: formatChatbotResponse(
        `Hi there! You can Search for Similar Cases or Details of Sections of Trademark Ordinance Like,* **• Give me details of Section 12** *• **Search case related to food**`
      ),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", inline: "start" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const input = e.target.elements.message;
    const messageText = input.value.trim();

    if (messageText) {
      const userMessage = {
        id: messages.length + 1,
        sender: "You",
        content: messageText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...messages, userMessage]);
      input.value = "";

      setIsThinking(true);
      const thinkingMessage = {
        id: messages.length + 2,
        sender: "ChatBot",
        content: "...",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

      setLoading(true);
      try {
        const response = await fetch(`http://192.168.0.2:8000/search/chatbot/?text=${messageText}`, {
          method: "GET",
        });
        const data = await response.json();

        if (response.ok && data.result) {
          const formattedResponse = formatChatbotResponse(data.result);

          const botMessage = {
            id: messages.length + 3,
            sender: "ChatBot",
            content: formattedResponse,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = botMessage;
            return updatedMessages;
          });
        } else {
          console.error("API Error:", data.error || "Invalid response");
        }
      } catch (error) {
        console.error("Error sending message to chatbot API:", error);
      } finally {
        setIsThinking(false);
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg w-80 flex flex-col h-96">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center space-x-2">
              <Avatar className="flex justify-center items-center h-8 w-8">
                <BotMessageSquare color="blue" />
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">Legal Bot</h3>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex flex-col mb-4 ${message.sender === "You" ? "items-end" : "items-start"}`}>
                <div className={`rounded-lg p-2 max-w-[95%] ${message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: message.content }}></p>
                </div>
                <span className="text-xs text-muted-foreground mt-1">{message.time}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="border-t p-4 flex items-center">
            <Input type="text" placeholder="Type a message..." name="message" className="flex-grow mr-2" disabled={loading || isThinking} />
            <Button
              type="submit"
              size="icon"
              className="shrink-0 text-white bg-blue-700 hover:bg-blue-800 transition  hover:duration-200"
              disabled={loading || isThinking}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ) : (
        <Button onClick={toggleChat} className="rounded-full h-12 w-12 bg-blue-700 text-primary-foreground hover:bg-primary/90">
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
