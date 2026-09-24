<?php
/**
 * Longa Multi-Provider AI Configuration
 * Inasaidia kampuni zote kubwa za AI (Bure na za Kulipia)
 */

return [
    'default_provider' => getenv('DEFAULT_AI_PROVIDER') ?: 'gemini',

    'providers' => [
        'gemini' => [
            'name' => 'Google Gemini',
            'company' => 'Google',
            'is_free' => true,
            'free_tier_info' => 'Bure (15 requests/min bila malipo kwenye Google AI Studio)',
            'get_key_url' => 'https://aistudio.google.com/app/apikey',
            'type' => 'gemini',
            'default_model' => 'gemini-1.5-flash',
            'models' => [
                'gemini-1.5-flash' => 'Gemini 1.5 Flash (Kasi kubwa & Bure)',
                'gemini-1.5-pro' => 'Gemini 1.5 Pro (Uwezo wa juu)',
                'gemini-2.0-flash-exp' => 'Gemini 2.0 Flash (Next-Gen)',
            ],
            'env_key' => 'GEMINI_API_KEY',
        ],

        'groq' => [
            'name' => 'Groq Cloud',
            'company' => 'Groq',
            'is_free' => true,
            'free_tier_info' => 'Bure (Kasi ya ajabu ya 500+ tokens/sec kwenye Llama 3.3)',
            'get_key_url' => 'https://console.groq.com/keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.groq.com/openai/v1/chat/completions',
            'default_model' => 'llama-3.3-70b-versatile',
            'models' => [
                'llama-3.3-70b-versatile' => 'Llama 3.3 70B Versatile (Bora & Kasi sana)',
                'llama-3.1-8b-instant' => 'Llama 3.1 8B Instant (Papo hapo)',
                'deepseek-r1-distill-llama-70b' => 'DeepSeek R1 Distill 70B (Sababu & Hesabu)',
                'mixtral-8x7b-32768' => 'Mixtral 8x7B (Muktadha mkubwa)',
            ],
            'env_key' => 'GROQ_API_KEY',
        ],

        'openrouter' => [
            'name' => 'OpenRouter',
            'company' => 'OpenRouter (Multi-Model Hub)',
            'is_free' => true,
            'free_tier_info' => 'Bure na ya Kulipia (Ina miundo 20+ ya bure kabisa kama :free)',
            'get_key_url' => 'https://openrouter.ai/keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://openrouter.ai/api/v1/chat/completions',
            'default_model' => 'meta-llama/llama-3.3-70b-instruct:free',
            'models' => [
                'meta-llama/llama-3.3-70b-instruct:free' => 'Llama 3.3 70B (100% Bure)',
                'deepseek/deepseek-r1:free' => 'DeepSeek R1 (100% Bure)',
                'mistralai/mistral-7b-instruct:free' => 'Mistral 7B (100% Bure)',
                'google/gemini-2.0-flash-exp:free' => 'Gemini 2.0 Flash (100% Bure)',
                'openai/gpt-4o-mini' => 'OpenAI GPT-4o Mini (Kulipia)',
            ],
            'env_key' => 'OPENROUTER_API_KEY',
        ],

        'openai' => [
            'name' => 'OpenAI',
            'company' => 'OpenAI',
            'is_free' => false,
            'free_tier_info' => 'Ya Kulipia (GPT-4o na GPT-4o Mini yenye akili thabiti)',
            'get_key_url' => 'https://platform.openai.com/api-keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.openai.com/v1/chat/completions',
            'default_model' => 'gpt-4o-mini',
            'models' => [
                'gpt-4o-mini' => 'GPT-4o Mini (Gharama nafuu & Imara)',
                'gpt-4o' => 'GPT-4o (Modeli Kuu ya OpenAI)',
                'o1-mini' => 'o1 Mini (Uchambuzi wa kina na mantiki)',
                'gpt-3.5-turbo' => 'GPT-3.5 Turbo',
            ],
            'env_key' => 'OPENAI_API_KEY',
        ],

        'deepseek' => [
            'name' => 'DeepSeek',
            'company' => 'DeepSeek AI',
            'is_free' => false,
            'free_tier_info' => 'Gharama nafuu sana ($0.14 kwa 1M tokens, salio la bure mara ya kwanza)',
            'get_key_url' => 'https://platform.deepseek.com/api_keys',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.deepseek.com/chat/completions',
            'default_model' => 'deepseek-chat',
            'models' => [
                'deepseek-chat' => 'DeepSeek V3 (Chat & Coding)',
                'deepseek-reasoner' => 'DeepSeek R1 (Mawazo & Reasoning)',
            ],
            'env_key' => 'DEEPSEEK_API_KEY',
        ],

        'anthropic' => [
            'name' => 'Anthropic Claude',
            'company' => 'Anthropic',
            'is_free' => false,
            'free_tier_info' => 'Ya Kulipia (Claude 3.5 Sonnet yenye uandishi na coding bora zaidi)',
            'get_key_url' => 'https://console.anthropic.com/settings/keys',
            'type' => 'anthropic',
            'endpoint' => 'https://api.anthropic.com/v1/messages',
            'default_model' => 'claude-3-5-haiku-20241022',
            'models' => [
                'claude-3-5-haiku-20241022' => 'Claude 3.5 Haiku (Haraka & Nafuu)',
                'claude-3-5-sonnet-20241022' => 'Claude 3.5 Sonnet (Uwezo wa Juu Zaidi)',
            ],
            'env_key' => 'ANTHROPIC_API_KEY',
        ],

        'mistral' => [
            'name' => 'Mistral AI',
            'company' => 'Mistral',
            'is_free' => true,
            'free_tier_info' => 'Bure (Free tier inapatikana kwenye La Plateforme)',
            'get_key_url' => 'https://console.mistral.ai/api-keys/',
            'type' => 'openai_compatible',
            'endpoint' => 'https://api.mistral.ai/v1/chat/completions',
            'default_model' => 'mistral-small-latest',
            'models' => [
                'mistral-small-latest' => 'Mistral Small Latest',
                'mistral-large-latest' => 'Mistral Large Latest',
                'codestral-latest' => 'Codestral (Uandishi wa Msimbo)',
            ],
            'env_key' => 'MISTRAL_API_KEY',
        ],

        'builtin' => [
            'name' => 'Longa Native AI',
            'company' => 'Longa Internal',
            'is_free' => true,
            'free_tier_info' => 'Bure 100% (Haitaji API key, inafanya kazi mara moja)',
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
