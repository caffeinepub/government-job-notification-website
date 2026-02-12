import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';

interface AiChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const GEMINI_API_KEY_STORAGE_KEY = 'gemini_api_key';

export function AiChatModal({ open, onOpenChange }: AiChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m here to help you with information about government jobs, exam preparation, and study materials. How can I assist you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const userInput = input.trim();
    
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
    };
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input immediately
    setInput('');
    
    // Disable send button and show thinking indicator
    setIsSending(true);
    
    // Add thinking indicator
    const thinkingMessage: Message = {
      id: `thinking-${Date.now()}`,
      role: 'assistant',
      content: 'Thinking...',
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      // Retrieve API key from localStorage
      const apiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
      
      if (!apiKey || !apiKey.trim()) {
        // Remove thinking indicator and show error
        setMessages((prev) => prev.filter(msg => msg.id !== thinkingMessage.id));
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Error: Please put API Key in Admin Panel',
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsSending(false);
        return;
      }

      // Make API request to Gemini
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Answer this in Hindi: ${userInput}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      // Remove thinking indicator
      setMessages((prev) => prev.filter(msg => msg.id !== thinkingMessage.id));

      if (!response.ok) {
        // Handle non-2xx responses
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: Failed to get response from AI (Status: ${response.status}). Please check your API key or try again later.`,
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsSending(false);
        return;
      }

      const data = await response.json();
      
      // Extract response text from Gemini API response
      let assistantText = 'Sorry, I could not generate a response.';
      
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          assistantText = candidate.content.parts[0].text || assistantText;
        }
      }

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: assistantText,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Remove thinking indicator on error
      setMessages((prev) => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      // Handle network or parsing errors
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Unable to connect to AI service. Please check your internet connection and try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error('Gemini API Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            AI Chat Assistant
          </DialogTitle>
          <DialogDescription>
            Ask questions about government jobs and exam preparation
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {message.content === 'Thinking...' ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1"
              disabled={isSending}
            />
            <Button onClick={handleSend} size="icon" disabled={isSending || !input.trim()}>
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
