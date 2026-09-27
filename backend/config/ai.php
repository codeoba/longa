<?php
/**
 * Longa Multi-Provider AI Configuration
 * Supports major AI providers (Free & Paid tiers)
 */

return [
    'default_provider' => getenv('DEFAULT_AI_PROVIDER') ?: 'gemini',

    'providers' => [
        'gemini' => [
            'name' => 'Google Gemini',
            'company' => 'Google',
            'is_free' => true,
            'free_tier_info' => 'Free (15 requests/min free tier on Google AI Studio)',
            'get_key_url' => 'https://aistudio.google.com/app/apikey',
            'type' => 'gemini',
            'default_model' => 'gemini-1.5-flash',
            'models' => [
                'gemini-1.5-flash' => 'Gemini 1.5 Flash (Fast & Free)',
                'gemini-1.5-pro' => 'Gemini 1.5 Pro (Advanced Reasoning)',
                'gemini-2.0-flash-exp' => 'Gemini 2.0 Flash (Next-Gen Preview)',
            ],
            'env_key' => 'GEMINI_API_KEY',
        ],

        'groq' => [
            'name' => 'Groq Cloud',
            'company' => 'Groq',
            'is_free' => true,
            'free_tier_info' => 'Free (Ultra-fast 500+ tokens/sec on Llama 3.3)',
            'get_key_url' => 'https://console.groq.com/keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.groq.com/openai/v1/chat/completions',
            'default_model' => 'llama-3.3-70b-versatile',
            'models' => [
                'llama-3.3-70b-versatile' => 'Llama 3.3 70B Versatile (Fast & Free)',
                'llama-3.1-8b-instant' => 'Llama 3.1 8B Instant (Instant Response)',
                'deepseek-r1-distill-llama-70b' => 'DeepSeek R1 Distill 70B (Math & Reasoning)',
                'mixtral-8x7b-32768' => 'Mixtral 8x7B (Large Context)',
            ],
            'env_key' => 'GROQ_API_KEY',
        ],

        'openrouter' => [
            'name' => 'OpenRouter',
            'company' => 'OpenRouter (Multi-Model Hub)',
            'is_free' => true,
            'free_tier_info' => 'Free & Paid (Includes 20+ free models ending with :free)',
            'get_key_url' => 'https://openrouter.ai/keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://openrouter.ai/api/v1/chat/completions',
            'default_model' => 'meta-llama/llama-3.3-70b-instruct:free',
            'models' => [
                'meta-llama/llama-3.3-70b-instruct:free' => 'Llama 3.3 70B (100% Free)',
                'deepseek/deepseek-r1:free' => 'DeepSeek R1 (100% Free)',
                'mistralai/mistral-7b-instruct:free' => 'Mistral 7B (100% Free)',
                'google/gemini-2.0-flash-exp:free' => 'Gemini 2.0 Flash (100% Free)',
                'openai/gpt-4o-mini' => 'OpenAI GPT-4o Mini (Paid)',
            ],
            'env_key' => 'OPENROUTER_API_KEY',
        ],

        'openai' => [
            'name' => 'OpenAI',
            'company' => 'OpenAI',
            'is_free' => false,
            'free_tier_info' => 'Paid (Industry benchmark GPT-4o and GPT-4o Mini)',
            'get_key_url' => 'https://platform.openai.com/api-keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.openai.com/v1/chat/completions',
            'default_model' => 'gpt-4o-mini',
            'models' => [
                'gpt-4o-mini' => 'GPT-4o Mini (Affordable & Strong)',
                'gpt-4o' => 'GPT-4o (OpenAI Flagship Model)',
                'o1-mini' => 'o1 Mini (Deep Analysis & Logic)',
                'gpt-3.5-turbo' => 'GPT-3.5 Turbo',
            ],
            'env_key' => 'OPENAI_API_KEY',
        ],

        'deepseek' => [
            'name' => 'DeepSeek',
            'company' => 'DeepSeek AI',
            'is_free' => false,
            'free_tier_info' => 'Ultra-low cost ($0.14 per 1M tokens with starter credit)',
            'get_key_url' => 'https://platform.deepseek.com/api_keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.deepseek.com/chat/completions',
            'default_model' => 'deepseek-chat',
            'models' => [
                'deepseek-chat' => 'DeepSeek V3 (Chat & Coding)',
                'deepseek-reasoner' => 'DeepSeek R1 (Reasoning & Math)',
            ],
            'env_key' => 'DEEPSEEK_API_KEY',
        ],

        'anthropic' => [
            'name' => 'Anthropic Claude',
            'company' => 'Anthropic',
            'is_free' => false,
            'free_tier_info' => 'Paid (Claude 3.5 Sonnet leading in coding & creative nuance)',
            'get_key_url' => 'https://console.anthropic.com/settings/keys',
            'type' => 'anthropic',
            'endpoint' => 'https://api.anthropic.com/v1/messages',
            'default_model' => 'claude-3-5-haiku-20241022',
            'models' => [
                'claude-3-5-haiku-20241022' => 'Claude 3.5 Haiku (Fast & Affordable)',
                'claude-3-5-sonnet-20241022' => 'Claude 3.5 Sonnet (State-of-the-Art)',
            ],
            'env_key' => 'ANTHROPIC_API_KEY',
        ],

        'mistral' => [
            'name' => 'Mistral AI',
            'company' => 'Mistral',
            'is_free' => true,
            'free_tier_info' => 'Free (Developer tier available on La Plateforme)',
            'get_key_url' => 'https://console.mistral.ai/api-keys/',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.mistral.ai/v1/chat/completions',
            'default_model' => 'mistral-small-latest',
            'models' => [
                'mistral-small-latest' => 'Mistral Small Latest',
                'mistral-large-latest' => 'Mistral Large Latest',
                'codestral-latest' => 'Codestral (Coding Specialist)',
            ],
            'env_key' => 'MISTRAL_API_KEY',
        ],

        'builtin' => [
            'name' => 'Longa Native AI',
            'company' => 'Longa Internal',
            'is_free' => true,
            'free_tier_info' => '100% Free (No external API key required, works instantly)',
            'get_key_url' => '',
            'type' => 'builtin',
            'default_model' => 'longa-intelligence-v2',
            'models' => [
                'longa-intelligence-v2' => 'Longa Contextual Intelligence Engine',
            ],
            'env_key' => '',
        ],
    ]
];
