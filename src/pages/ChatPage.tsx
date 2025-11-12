import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, ArrowLeft, Loader2 } from "lucide-react";
import { buildEnhancedPrompt } from '@/lib/enhancedRAG';
import { addInteraction } from "@/lib/interactionTracker";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

const ODOO_URL = "/jsonrpc";
const DB = "infiniserve_db";
const USERNAME = "nehasaleem596@gmail.com";
const PASSWORD = "fypproject2025";

const ChatPage = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const loginPayload = {
          jsonrpc: "2.0",
          method: "call",
          params: { service: "common", method: "login", args: [DB, USERNAME, PASSWORD] },
          id: Date.now(),
        };

        const loginRes = await fetch(ODOO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload),
        });

        const loginData = await loginRes.json();
        const uid = loginData.result;

        if (!uid) throw new Error("Login failed");

        const customerPayload = {
          jsonrpc: "2.0",
          method: "call",
          params: {
            service: "object",
            method: "execute_kw",
            args: [
              DB,
              uid,
              PASSWORD,
              "res.partner",
              "read",
              [[parseInt(customerId || "0")]],
              { fields: ["id", "name", "email", "phone"] },
            ],
          },
          id: Date.now() + 1,
        };

        const customerRes = await fetch(ODOO_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(customerPayload),
        });

        const customerData = await customerRes.json();
        
        if (customerData.result && customerData.result[0]) {
          setCustomer(customerData.result[0]);
        }
      } catch (err) {
        console.error("Error fetching customer:", err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Track the interaction
      if (customer) {
        addInteraction(
          customer.id,
          customer.name,
          'message',
          `Sent message: ${input.substring(0, 50)}...`
        );
      }

      // Build enhanced prompt with RAG context
      const enhancedPrompt = await buildEnhancedPrompt(
        input,
        customer?.name || 'Customer',
        messages
      );

      console.log('📝 Enhanced Prompt:', enhancedPrompt);

      // Use Gemini with moderate personality for customer service
      const personality = {
        creativity: 60,
        formality: 70,
        enthusiasm: 65,
        empathy: 90
      };

      // Create a simpler prompt for Gemini
      const geminiPrompt = `You are a helpful customer service AI assistant. 
Customer name: ${customer?.name || 'Customer'}
Context: ${enhancedPrompt}

Please provide a helpful, professional response.`;

      const response = await geminiService.chat(
        personality,
        geminiPrompt,
        updatedMessages.map(m => ({ 
          role: m.role, 
          content: m.content, 
          timestamp: new Date() 
        }))
      );

      const aiMessage: Message = { role: "assistant", content: response };
      setMessages([...updatedMessages, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {customer ? `Chat with ${customer.name}` : "Chat"}
            </h1>
            {customer?.email && (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <Card className="flex-1 mb-4 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p className="text-lg mb-2">👋 Start a conversation</p>
              <p className="text-sm">
                I can help answer questions using AI-powered assistance!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 min-h-[60px] max-h-[200px] p-3 rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          rows={2}
        />
        <Button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          size="icon"
          className="h-[60px] w-[60px]"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;