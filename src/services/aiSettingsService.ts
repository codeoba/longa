/**
 * AI Settings & Multi-Provider Service
 * Inasimamia API Keys za watumiaji kwa kampuni zote kubwa za AI (Bure na za Kulipia)
 */

export interface AiProviderInfo {
  id: string;
  name: string;
  company: string;
  is_free: boolean;
  free_tier_info: string;
  get_key_url: string;
  default_model: string;
  models: Record<string, string>;
  has_server_key: boolean;
  type: string;
}

export interface AiConfig {
  activeProvider: string;
  activeModel: string;
  keys: Record<string, string>;
  customModels: Record<string, string>;
}

const STORAGE_KEY = 'longa_ai_provider_config';

export const DEFAULT_AI_CONFIG: AiConfig = {
  activeProvider: 'builtin',
  activeModel: 'longa-intelligence-v2',
  keys: {
    gemini: '',
    groq: '',
    openrouter: '',
    openai: '',
    deepseek: '',
    anthropic: '',
    mistral: '',
    builtin: '',
  },
  customModels: {
    gemini: 'gemini-1.5-flash',
    groq: 'llama-3.3-70b-versatile',
    openrouter: 'meta-llama/llama-3.3-70b-instruct:free',
    openai: 'gpt-4o-mini',
    deepseek: 'deepseek-chat',
    anthropic: 'claude-3-5-haiku-20241022',
    mistral: 'mistral-small-latest',
    builtin: 'longa-intelligence-v2',
  },
};

export const getAiConfig = (): AiConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AI_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_AI_CONFIG,
      ...parsed,
      keys: { ...DEFAULT_AI_CONFIG.keys, ...(parsed.keys || {}) },
      customModels: { ...DEFAULT_AI_CONFIG.customModels, ...(parsed.customModels || {}) },
    };
  } catch (e) {
    console.warn('Error reading AI config from localStorage:', e);
    return DEFAULT_AI_CONFIG;
  }
};

export const saveAiConfig = (config: AiConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving AI config to localStorage:', e);
  }
};

export const getActiveAiCredentials = () => {
  const config = getAiConfig();
  const provider = config.activeProvider || 'builtin';
  const apiKey = config.keys[provider] || '';
  const model = config.customModels[provider] || config.activeModel;
  return { provider, apiKey, model };
};

import { getApiUrl } from '../api/phpAdapter';

export const getApiBaseUrl = () => {
  return getApiUrl();
};

export const fetchAiProviders = async (): Promise<Record<string, AiProviderInfo>> => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/ai/providers`);
    if (res.ok) {
      const data = await res.json();
      return data.providers || {};
    }
  } catch (e) {
    console.warn('Could not fetch providers from backend, using fallback:', e);
  }

  // Fallback metadata if backend is offline
  return {
    groq: {
      id: 'groq',
      name: 'Groq Cloud',
      company: 'Groq',
      is_free: true,
      free_tier_info: 'Free (Ultra-fast 500+ tokens/sec on Llama 3.3)',
      get_key_url: 'https://console.groq.com/keys',
      default_model: 'llama-3.3-70b-versatile',
      models: {
        'llama-3.3-70b-versatile': 'Llama 3.3 70B Versatile (Fast & Free)',
        'llama-3.1-8b-instant': 'Llama 3.1 8B Instant (Instant Response)',
        'deepseek-r1-distill-llama-70b': 'DeepSeek R1 Distill 70B (Math & Reasoning)',
      },
      has_server_key: false,
      type: 'openai_compatible',
    },
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      company: 'Google',
      is_free: true,
      free_tier_info: 'Free (15 requests/min free tier on Google AI Studio)',
      get_key_url: 'https://aistudio.google.com/app/apikey',
      default_model: 'gemini-1.5-flash',
      models: {
        'gemini-1.5-flash': 'Gemini 1.5 Flash (Fast & Free)',
        'gemini-1.5-pro': 'Gemini 1.5 Pro (Advanced Reasoning)',
        'gemini-2.0-flash-exp': 'Gemini 2.0 Flash (Next-Gen Preview)',
      },
      has_server_key: false,
      type: 'gemini',
    },
    openrouter: {
      id: 'openrouter',
      name: 'OpenRouter',
      company: 'OpenRouter Hub',
      is_free: true,
      free_tier_info: 'Free & Paid (Includes 100% free models ending with :free)',
      get_key_url: 'https://openrouter.ai/keys',
      default_model: 'meta-llama/llama-3.3-70b-instruct:free',
      models: {
        'meta-llama/llama-3.3-70b-instruct:free': 'Llama 3.3 70B (100% Free)',
        'deepseek/deepseek-r1:free': 'DeepSeek R1 (100% Free)',
        'mistralai/mistral-7b-instruct:free': 'Mistral 7B (100% Free)',
        'openai/gpt-4o-mini': 'OpenAI GPT-4o Mini (Paid)',
      },
      has_server_key: false,
      type: 'openai_compatible',
    },
    openai: {
      id: 'openai',
      name: 'OpenAI',
      company: 'OpenAI',
      is_free: false,
      free_tier_info: 'Paid (Industry benchmark GPT-4o and GPT-4o Mini)',
      get_key_url: 'https://platform.openai.com/api-keys',
      default_model: 'gpt-4o-mini',
      models: {
        'gpt-4o-mini': 'GPT-4o Mini (Affordable & Strong)',
        'gpt-4o': 'GPT-4o (OpenAI Flagship Model)',
        'o1-mini': 'o1-mini (Advanced Reasoning & Logic)',
      },
      has_server_key: false,
      type: 'openai_compatible',
    },
    deepseek: {
      id: 'deepseek',
      name: 'DeepSeek',
      company: 'DeepSeek AI',
      is_free: false,
      free_tier_info: 'Ultra-low cost ($0.14 per 1M tokens)',
      get_key_url: 'https://platform.deepseek.com/api_keys',
      default_model: 'deepseek-chat',
      models: {
        'deepseek-chat': 'DeepSeek V3 (Chat & Coding)',
        'deepseek-reasoner': 'DeepSeek R1 (Reasoning & Math)',
      },
      has_server_key: false,
      type: 'openai_compatible',
    },
    anthropic: {
      id: 'anthropic',
      name: 'Anthropic Claude',
      company: 'Anthropic',
      is_free: false,
      free_tier_info: 'Paid (Claude 3.5 Sonnet leading in coding & creative nuance)',
      get_key_url: 'https://console.anthropic.com/settings/keys',
      default_model: 'claude-3-5-haiku-20241022',
      models: {
        'claude-3-5-haiku-20241022': 'Claude 3.5 Haiku',
        'claude-3-5-sonnet-20241022': 'Claude 3.5 Sonnet',
      },
      has_server_key: false,
      type: 'anthropic',
    },
    mistral: {
      id: 'mistral',
      name: 'Mistral AI',
      company: 'Mistral',
      is_free: true,
      free_tier_info: 'Free (Developer tier available)',
      get_key_url: 'https://console.mistral.ai/api-keys/',
      default_model: 'mistral-small-latest',
      models: {
        'mistral-small-latest': 'Mistral Small Latest',
        'codestral-latest': 'Codestral (Coding Specialist)',
      },
      has_server_key: false,
      type: 'openai_compatible',
    },
    builtin: {
      id: 'builtin',
      name: 'Longa Native AI',
      company: 'Longa Internal',
      is_free: true,
      free_tier_info: '100% Free (No external API key required, works instantly)',
      get_key_url: '',
      default_model: 'longa-intelligence-v2',
      models: {
        'longa-intelligence-v2': 'Longa Contextual Intelligence Engine',
      },
      has_server_key: false,
      type: 'builtin',
    },
  };
};

export const testAiKeyConnection = async (
  provider: string,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; latencyMs?: number; message?: string; error?: string; sampleResponse?: string }> => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/ai/test-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, apiKey, model }),
    });

    const data = await res.json();
    if (res.ok && data.status === 'success') {
      return {
        success: true,
        latencyMs: data.latency_ms,
        message: data.message || 'Muunganisho umekamilika vizuri!',
        sampleResponse: data.sample_response,
      };
    } else {
      return {
        success: false,
        error: data.error || 'Imeshindwa kuunganishwa na API key hii.',
      };
    }
  } catch (e: any) {
    return {
      success: false,
      error: e.message || 'Hitilafu ya mtandao wakati wa kuwasiliana na seva.',
    };
  }
};
