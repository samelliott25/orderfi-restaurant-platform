import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Mic, MicOff, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegratedChatSearchProps {
  onSendMessage: (message: string) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function IntegratedChatSearch({ 
  onSendMessage, 
  onSearch, 
  isLoading = false,
  placeholder = "Ask Mimi or search menu..."
}: IntegratedChatSearchProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "search">("chat");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (mode === "chat") {
      onSendMessage(input.trim());
    } else {
      onSearch(input.trim());
    }
    setInput("");
  };

  const toggleVoice = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setMode("chat"); // Voice input defaults to chat mode
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    
    // Auto-detect mode based on input patterns
    if (value.startsWith("/search ") || value.startsWith("search ")) {
      setMode("search");
    } else if (value.length > 0 && mode === "search" && !value.includes("search")) {
      setMode("chat");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Compact Mode Switcher */}
      <div className="flex justify-center mb-2">
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode("chat")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all",
              mode === "chat"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode("search")}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded-full transition-all",
              mode === "search"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            )}
          >
            <Search className="h-3 w-3 mr-1" />
            Search
          </Button>
        </div>
      </div>

      {/* Integrated Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Mode Icon */}
          <div className="absolute left-4 z-10">
            {mode === "chat" ? (
              <MessageCircle className="h-5 w-5 text-blue-500" />
            ) : (
              <Search className="h-5 w-5 text-green-500" />
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={
              mode === "chat" 
                ? "Ask Mimi anything..." 
                : "Search menu..."
            }
            className="w-full pl-12 pr-20 py-3 text-sm bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            disabled={isLoading || isListening}
          />

          {/* Action Buttons */}
          <div className="absolute right-2 flex items-center space-x-2">
            {/* Voice Button (only for chat mode) */}
            {mode === "chat" && recognitionRef.current && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleVoice}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200",
                  isListening
                    ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 animate-pulse"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Send Button */}
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading || isListening}
              className={cn(
                "p-2 rounded-xl transition-all duration-200",
                mode === "chat"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Status Indicators */}
        {isListening && (
          <div className="absolute -bottom-8 left-0 flex items-center text-sm text-red-600 dark:text-red-400">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
            Listening... Speak your order
          </div>
        )}

        {isLoading && (
          <div className="absolute -bottom-8 left-0 flex items-center text-sm text-blue-600 dark:text-blue-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
            {mode === "chat" ? "Mimi is thinking..." : "Searching menu..."}
          </div>
        )}
      </form>

      {/* Compact Quick Suggestions */}
      <div className="mt-2 flex flex-wrap gap-1 justify-center">
        {mode === "chat" ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("I want something healthy")}
              className="text-xs px-2 py-1 rounded-full h-6"
            >
              Healthy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("What's your best burger?")}
              className="text-xs px-2 py-1 rounded-full h-6"
            >
              Best burger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Surprise me!")}
              className="text-xs px-2 py-1 rounded-full h-6"
            >
              Surprise me
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("vegetarian")}
              className="text-xs px-2 py-1 rounded-full h-6"
            >
              Vegetarian
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("under $15")}
              className="text-xs px-2 py-1 rounded-full h-6"
            >
              Under $15
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("gluten free")}
              className="text-xs px-2 py-1 rounded-full h-6"
            >
              Gluten free
            </Button>
          </>
        )}
      </div>
    </div>
  );
}