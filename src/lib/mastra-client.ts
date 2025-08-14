import { MastraMessage, MastraAgentResponse, MastraAgent, MastraClientConfig } from '../types/mastra';

export class MastraClient {
  private baseUrl: string;
  private retries: number;
  private backoffMs: number;
  private maxBackoffMs: number;
  private headers: Record<string, string>;
  private timeout: number;

  constructor(config: MastraClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除末尾斜杠
    this.retries = config.retries || 3;
    this.backoffMs = config.backoffMs || 300;
    this.maxBackoffMs = config.maxBackoffMs || 5000;
    this.headers = config.headers || {};
    this.timeout = config.timeout || 30000;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...this.headers,
            ...options.headers,
          },
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data;
      } catch (error) {
        if (attempt === this.retries) {
          throw error;
        }
        
        // 指数退避，最大不超过 maxBackoffMs
        const delay = Math.min(
          this.backoffMs * Math.pow(2, attempt),
          this.maxBackoffMs
        );
        
        console.warn(`Request failed (attempt ${attempt + 1}/${this.retries + 1}), retrying in ${delay}ms:`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('Max retries exceeded');
  }

  // 健康检查
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest('/api/health');
      return true;
    } catch {
      return false;
    }
  }

  // 获取所有 agents
  async getAgents(): Promise<MastraAgent[]> {
    try {
      const response = await this.makeRequest<{ agents: MastraAgent[] }>('/api/agents');
      return response.agents || [];
    } catch (error) {
      console.warn('Failed to fetch agents:', error);
      return [];
    }
  }

  // 与 agent 对话
  async generateWithAgent(
    agentId: string,
    messages: MastraMessage[]
  ): Promise<MastraAgentResponse> {
    return await this.makeRequest<MastraAgentResponse>(
      `/api/agents/${agentId}/generate`,
      {
        method: 'POST',
        body: JSON.stringify({ 
          messages: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      }
    );
  }

  // 流式对话
  async streamWithAgent(
    agentId: string,
    messages: MastraMessage[],
    onChunk: (chunk: string) => void,
    onComplete?: (fullResponse: string) => void,
    onError?: (error: Error) => void
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
      
      onComplete?.(text);
    } catch (error) {
      console.error('Stream error:', error);
      onError?.(error as Error);
    }
  }
}

// 默认客户端实例
export const createMastraClient = (config: MastraClientConfig) => {
  return new MastraClient(config);
};
