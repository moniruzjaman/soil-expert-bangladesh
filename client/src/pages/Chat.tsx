import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Leaf, Send, Loader2, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Chat() {
  const { user } = useAuth();
  const [language, setLanguage] = useState<"en" | "bn">("en");
  const [selectedField, setSelectedField] = useState<number | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; message: string }>>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fieldsQuery = trpc.fields.list.useQuery();
  const chatQuery = trpc.chat.getMessages.useQuery(
    { fieldId: selectedField || undefined },
    { enabled: !!selectedField || !selectedField }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", message: data.userMessage },
        { role: "assistant", message: data.assistantMessage },
      ]);
      setInputValue("");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatQuery.data) {
      setMessages(
        chatQuery.data.map((msg) => ({
          role: msg.role,
          message: msg.message,
        }))
      );
    }
  }, [chatQuery.data]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a message");
      return;
    }

    sendMessageMutation.mutate({
      fieldId: selectedField || undefined,
      language,
      message: inputValue,
    });
  };

  const suggestedQuestions = {
    en: [
      "What is the ideal soil pH for rice cultivation?",
      "How do I improve acidic soil?",
      "What are the benefits of AWD irrigation?",
      "Which crops are suitable for char lands?",
      "How much fertilizer should I use for potato?",
    ],
    bn: [
      "ধানের চাষের জন্য আদর্শ মাটির pH কত?",
      "আমি অম্লীয় মাটি উন্নত করব কীভাবে?",
      "AWD সেচের সুবিধা কী?",
      "চর জমিতে কোন ফসল উপযুক্ত?",
      "আলুর জন্য কত সার ব্যবহার করব?",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Leaf className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">Precision Khamari</h1>
            </div>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Soil Expert Assistant</h2>
          <p className="text-gray-600">Ask questions about soil, fertilizer, irrigation, and crop management in Bangla or English</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Chat with Expert</CardTitle>
                    <CardDescription>Get personalized advice for your farm</CardDescription>
                  </div>
                  <Select value={language} onValueChange={(v) => setLanguage(v as "en" | "bn")}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 overflow-y-auto py-6 space-y-4 max-h-96">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Start a conversation by asking a question</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.role === "user"
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-4 space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Select Field (Optional)</label>
                  <Select value={selectedField?.toString() || "none"} onValueChange={(v) => setSelectedField(v === "none" ? null : parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a field for context" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No field selected</SelectItem>
                      {fieldsQuery.data?.map((field) => (
                        <SelectItem key={field.id} value={field.id.toString()}>
                          {field.fieldName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder={language === "en" ? "Ask a question..." : "একটি প্রশ্ন জিজ্ঞাসা করুন..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sendMessageMutation.isPending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sendMessageMutation.isPending || !inputValue.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {sendMessageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Suggested Questions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedQuestions[language].map((question, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="w-full text-left h-auto py-2 px-3 justify-start text-sm"
                    onClick={() => {
                      setInputValue(question);
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-base">Expert Knowledge Base</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Soil Science</p>
                  <p className="text-gray-600">pH management, organic matter, soil testing</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Fertilizers</p>
                  <p className="text-gray-600">NPK, micronutrients, organic & bio-fertilizers</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Irrigation</p>
                  <p className="text-gray-600">AWD technique, water conservation</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Crops</p>
                  <p className="text-gray-600">Suitability, cropping patterns, yields</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
