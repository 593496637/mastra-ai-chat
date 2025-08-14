export interface MastraMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  id?: string;
}

export interface MastraAgentResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
  toolCalls?: ToolCall[];
}

export interface MastraAgent {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  model?: string;
  tools?: string[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface MastraWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  type: string;
  config: Record<string, any>;
}

export interface MastraClientConfig {
  baseUrl: string;
  retries?: number;
  backoffMs?: number;
  maxBackoffMs?: number;
  headers?: Record<string, string>;
  timeout?: number;
}
