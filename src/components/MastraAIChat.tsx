import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, Loader2, Settings, Zap } from 'lucide-react';

// Mastra Client SDK类型定义
interface MastraMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  id?: string;
}

interface MastraAgentResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

interface MastraAgent {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
}

// Mastra API 客户端类
class MastraClient {
  private baseUrl: string;
  private retries: number;
  private backoffMs: number;

  constructor(options: {
    baseUrl: string;
    retries?: number;
    backoffMs?: number;
  }) {
    this.baseUrl = options.baseUrl;
    this.retries = options.retries || 3;
    this.backoffMs = options.backoffMs || 300;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (attempt === this.retries) {
          throw error;
        }
        
        // 指数退避
        const delay = this.backoffMs * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  // 获取所有agents
  async getAgents(): Promise<MastraAgent[]> {
    try {
      const response = await this.makeRequest<{ agents: MastraAgent[] }>('/api/agents');
      return response.agents || [];
    } catch (error) {
      console.warn('Failed to fetch agents:', error);
      return [];
    }
  }

  // 与特定agent对话
  async generateWithAgent(
    agentId: string,
    messages: MastraMessage[]
  ): Promise<MastraAgentResponse> {
    return await this.makeRequest<MastraAgentResponse>(
      `/api/agents/${agentId}/generate`,
      {
        method: 'POST',
        body: JSON.stringify({ messages: messages.map(m => m.content) }),
      }
    );
  }

  // 流式对话（模拟）
  async streamWithAgent(
    agentId: string,
    messages: MastraMessage[],
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await this.generateWithAgent(agentId, messages);
      // 模拟流式输出效果
      const text = response.text;
      const words = text.split(' ');
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        onChunk(words.slice(0, i + 1).join(' '));
      }
    } catch (error) {
      onChunk('抱歉，处理您的请求时遇到了问题。');
    }
  }
}

// 预设的一些有趣的示例agents
const EXAMPLE_AGENTS: MastraAgent[] = [
  {
    id: 'creative-writer',
    name: '创意写作助手',
    description: '帮助您进行创意写作、故事创作和文案编写',
  },
  {
    id: 'tech-advisor',
    name: '技术顾问',
    description: '为您提供编程、架构设计和技术选型建议',
  },
  {
    id: 'data-analyst',
    name: '数据分析师',
    description: '协助数据分析、可视化和洞察发现',
  }
];

const MastraAIChat: React.FC = () => {
  const [messages, setMessages] = useState<MastraMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string>('creative-writer');
  const [availableAgents, setAvailableAgents] = useState<MastraAgent[]>(EXAMPLE_AGENTS);
  const [mastraUrl, setMastraUrl] = useState('http://localhost:4111');
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mastraClient = useRef<MastraClient | null>(null);

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  // 初始化Mastra客户端
  useEffect(() => {
    const initializeClient = async () => {
      try {
        mastraClient.current = new MastraClient({
          baseUrl: mastraUrl,
          retries: 2,
          backoffMs: 500,
        });

        // 尝试获取可用的agents
        const agents = await mastraClient.current.getAgents();
        if (agents.length > 0) {
          setAvailableAgents(agents);
          setSelectedAgent(agents[0].id);
          setIsConnected(true);
        } else {
          setAvailableAgents(EXAMPLE_AGENTS);
          setIsConnected(false);
        }
      } catch (error) {
        console.warn('Failed to connect to Mastra:', error);
        setAvailableAgents(EXAMPLE_AGENTS);
        setIsConnected(false);
      }
    };

    initializeClient();
  }, [mastraUrl]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading || !mastraClient.current) return;

    const userMessage: MastraMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const allMessages = [...messages, userMessage];
      
      await mastraClient.current.streamWithAgent(
        selectedAgent,
        allMessages,
        (chunk) => {
          setStreamingMessage(chunk);
        }
      );

      // 流式完成后添加到消息列表
      const assistantMessage: MastraMessage = {
        role: 'assistant',
        content: streamingMessage,
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: MastraMessage = {
        role: 'assistant',
        content: '抱歉，我遇到了一些技术问题。请检查您的Mastra服务器是否正在运行。',
        timestamp: new Date().toISOString(),
        id: (Date.now() + 1).toString(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  // 键盘事件处理
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清空对话
  const clearChat = () => {
    setMessages([]);
    setStreamingMessage('');
  };

  return (
    <div className=\"flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900\">
      {/* Header */}
      <header className=\"bg-black/20 backdrop-blur-lg border-b border-white/10 p-4\">
        <div className=\"flex items-center justify-between max-w-6xl mx-auto\">
          <div className=\"flex items-center space-x-3\">
            <div className=\"w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center\">
              <Sparkles className=\"w-6 h-6 text-white\" />
            </div>
            <div>
              <h1 className=\"text-xl font-bold text-white\">Mastra AI Agent</h1>
              <p className=\"text-sm text-gray-300\">
                状态: {isConnected ? (
                  <span className=\"text-green-400\">已连接</span>
                ) : (
                  <span className=\"text-yellow-400\">使用示例模式</span>
                )}
              </p>
            </div>
          </div>
          
          <div className=\"flex items-center space-x-3\">
            {/* Agent选择器 */}
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className=\"bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500\"
            >
              {availableAgents.map((agent) => (
                <option key={agent.id} value={agent.id} className=\"bg-gray-800\">
                  {agent.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className=\"p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors\"
            >
              <Settings className=\"w-5 h-5 text-white\" />
            </button>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className=\"mt-4 p-4 bg-black/30 rounded-lg max-w-6xl mx-auto\">
            <div className=\"flex items-center space-x-4\">
              <div className=\"flex-1\">
                <label className=\"block text-sm font-medium text-gray-300 mb-1\">
                  Mastra 服务器地址
                </label>
                <input
                  type=\"text\"
                  value={mastraUrl}
                  onChange={(e) => setMastraUrl(e.target.value)}
                  className=\"w-full bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500\"
                  placeholder=\"http://localhost:4111\"
                />
              </div>
              <button
                onClick={clearChat}
                className=\"px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm\"
              >
                清空对话
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Chat Area */}
      <main className=\"flex-1 overflow-hidden max-w-6xl mx-auto w-full\">
        <div className=\"h-full flex flex-col\">
          {/* Messages */}
          <div className=\"flex-1 overflow-y-auto p-4 space-y-4\">
            {messages.length === 0 && (
              <div className=\"text-center py-12\">
                <div className=\"w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center\">
                  <Zap className=\"w-8 h-8 text-white\" />
                </div>
                <h2 className=\"text-xl font-semibold text-white mb-2\">
                  欢迎使用 Mastra AI Agent!
                </h2>
                <p className=\"text-gray-300 max-w-md mx-auto\">
                  这是一个连接到您本地 Mastra 服务器的智能助手界面。选择一个 Agent 开始对话吧！
                </p>
                <div className=\"mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto\">
                  {availableAgents.map((agent) => (
                    <div
                      key={agent.id}
                      className=\"p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer\"
                      onClick={() => setSelectedAgent(agent.id)}
                    >
                      <h3 className=\"font-medium text-white mb-2\">{agent.name}</h3>
                      <p className=\"text-sm text-gray-400\">{agent.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  } items-start space-x-3`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className=\"w-4 h-4 text-white\" />
                    ) : (
                      <Bot className=\"w-4 h-4 text-white\" />
                    )}
                  </div>
                  
                  <div
                    className={`rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30'
                        : 'bg-white/10 border border-white/20'
                    }`}
                  >
                    <p className=\"text-white whitespace-pre-wrap\">{message.content}</p>
                    {message.timestamp && (
                      <p className=\"text-xs text-gray-400 mt-2\">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* 流式消息显示 */}
            {streamingMessage && (
              <div className=\"flex justify-start\">
                <div className=\"flex max-w-[80%] flex-row items-start space-x-3\">
                  <div className=\"flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500\">
                    <Bot className=\"w-4 h-4 text-white\" />
                  </div>
                  <div className=\"rounded-lg p-4 bg-white/10 border border-white/20\">
                    <p className=\"text-white whitespace-pre-wrap\">{streamingMessage}</p>
                    <div className=\"flex items-center mt-2\">
                      <Loader2 className=\"w-3 h-3 text-purple-400 animate-spin\" />
                      <span className=\"text-xs text-gray-400 ml-1\">AI 正在思考...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className=\"p-4 bg-black/20 backdrop-blur-lg border-t border-white/10\">
            <div className=\"flex space-x-4\">
              <div className=\"flex-1 relative\">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={`向 ${availableAgents.find(a => a.id === selectedAgent)?.name || 'AI Agent'} 发送消息...`}
                  className=\"w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400\"
                  rows={1}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className=\"px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2\"
              >
                {isLoading ? (
                  <Loader2 className=\"w-5 h-5 animate-spin\" />
                ) : (
                  <Send className=\"w-5 h-5\" />
                )}
                <span>发送</span>
              </button>
            </div>
            
            <div className=\"mt-2 text-xs text-gray-400\">
              {isConnected ? (
                `已连接到 ${mastraUrl} - 使用真实的 Mastra Agent`
              ) : (
                `离线模式 - 请确保 Mastra 服务器在 ${mastraUrl} 运行`
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MastraAIChat;
