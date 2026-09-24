import React, { useState, useEffect } from 'react';
import {
  AiProviderInfo,
  AiConfig,
  getAiConfig,
  saveAiConfig,
  fetchAiProviders,
  testAiKeyConnection,
} from '../services/aiSettingsService';
import { useThemeClasses } from '../themeUtils';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: AiConfig) => void;
}

export default function AiSettingsModal({ isOpen, onClose, onConfigSaved }: AiSettingsModalProps) {
  const [providers, setProviders] = useState<Record<string, AiProviderInfo>>({});
  const [config, setConfig] = useState<AiConfig>(getAiConfig());
  const [selectedProviderId, setSelectedProviderId] = useState<string>(config.activeProvider || 'builtin');
  const [keyInput, setKeyInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'idle' | 'success' | 'error';
    message?: string;
    latency?: number;
  }>({ status: 'idle' });
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const tc = useThemeClasses();

  useEffect(() => {
    if (isOpen) {
      const currentConfig = getAiConfig();
      setConfig(currentConfig);
      setSelectedProviderId(currentConfig.activeProvider || 'builtin');
      setKeyInput(currentConfig.keys[currentConfig.activeProvider || 'builtin'] || '');
      setSelectedModel(currentConfig.customModels[currentConfig.activeProvider || 'builtin'] || '');
      setTestResult({ status: 'idle' });
      setSaveFeedback(null);

      fetchAiProviders().then((data) => {
        setProviders(data);
      });
    }
  }, [isOpen]);

  const currentProvider = providers[selectedProviderId] || {
    id: selectedProviderId,
    name: selectedProviderId,
    company: '',
    is_free: true,
    free_tier_info: '',
    get_key_url: '',
    default_model: '',
    models: {},
    has_server_key: false,
    type: 'builtin',
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
    const existingKey = config.keys[providerId] || '';
    setKeyInput(existingKey);
    const existingModel = config.customModels[providerId] || providers[providerId]?.default_model || '';
    setSelectedModel(existingModel);
    setTestResult({ status: 'idle' });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult({ status: 'idle' });

    const res = await testAiKeyConnection(selectedProviderId, keyInput, selectedModel);
    setIsTesting(false);

    if (res.success) {
      setTestResult({
        status: 'success',
        latency: res.latencyMs,
        message: res.message || 'Muunganisho umefanikiwa kikamilifu!',
      });
    } else {
      setTestResult({
        status: 'error',
        message: res.error || 'Imeshindwa kuunganishwa na API key hii.',
      });
    }
  };

  const handleSave = () => {
    const updatedKeys = {
      ...config.keys,
      [selectedProviderId]: keyInput.trim(),
    };
    const updatedModels = {
      ...config.customModels,
      [selectedProviderId]: selectedModel || currentProvider.default_model,
    };

    const newConfig: AiConfig = {
      ...config,
      activeProvider: selectedProviderId,
      activeModel: selectedModel || currentProvider.default_model,
      keys: updatedKeys,
      customModels: updatedModels,
    };

    saveAiConfig(newConfig);
    setConfig(newConfig);
    setSaveFeedback('Mipangilio ya AI imehifadhiwa!');

    if (onConfigSaved) {
      onConfigSaved(newConfig);
    }

    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleResetToNative = () => {
    const newConfig: AiConfig = {
      ...config,
      activeProvider: 'builtin',
      activeModel: 'longa-intelligence-v2',
    };
    saveAiConfig(newConfig);
    setConfig(newConfig);
    setSelectedProviderId('builtin');
    setKeyInput('');
    setSelectedModel('longa-intelligence-v2');
    setSaveFeedback('Umerudishwa kwenye Akili ya Asili ya Ndani ya Longa!');
    if (onConfigSaved) {
      onConfigSaved(newConfig);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden ${tc.bg} ${tc.border}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${tc.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className={`text-lg font-bold ${tc.text}`}>Mipangilio ya Longa AI (Multi-Provider)</h2>
              <p className="text-xs text-gray-500">Unganisha API Key za bure au za kulipia kutoka kampuni yoyote ya AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${tc.bgHoverSecondary} ${tc.textSecondary}`}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Informational Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
            <span className="font-bold text-blue-400">💡 Bring Your Own Key (BYOK):</span> Huna haja ya kutengeneza AI yako mwenyewe. Unaweza kutumia API key ya bure (k.m. <strong>Groq</strong> au <strong>Google Gemini</strong>) au ya kulipia (k.m. <strong>OpenAI GPT-4o</strong>, <strong>DeepSeek</strong>, <strong>Claude</strong>). Funguo zako zinahifadhiwa kwa usalama kwenye kompyuta yako pekee.
          </div>

          {/* Provider Grid Selector */}
          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${tc.textSecondary}`}>
              Chagua Kampuni ya AI (Provider):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.values(providers).map((prov) => {
                const isSelected = selectedProviderId === prov.id;
                const hasKey = !!config.keys[prov.id];
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleProviderSelect(prov.id)}
                    className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/15 ring-1 ring-blue-500'
                        : `${tc.bgSecondary} border-gray-800 hover:border-gray-700`
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold truncate text-white">{prov.name}</span>
                      {prov.is_free ? (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Bure
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Kulipia
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="truncate">{prov.company || 'Native'}</span>
                      {hasKey && <span className="text-emerald-400 text-xs" title="Key ipo">●</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Details & Key Form */}
          <div className={`p-5 rounded-2xl border ${tc.bgSecondary} ${tc.border} space-y-4`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{currentProvider.name}</span>
                  {currentProvider.is_free && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      Free Tier Available
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{currentProvider.free_tier_info}</p>
              </div>

              {currentProvider.get_key_url && (
                <a
                  href={currentProvider.get_key_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 underline underline-offset-2 shrink-0"
                >
                  Pata API Key Hapa ↗
                </a>
              )}
            </div>

            {/* Model Selector */}
            {currentProvider.models && Object.keys(currentProvider.models).length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Chagua Modeli (AI Model):
                </label>
                <select
                  value={selectedModel || currentProvider.default_model}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border outline-none transition-colors ${tc.bgInput} ${tc.text} ${tc.border} focus:border-blue-500`}
                >
                  {Object.entries(currentProvider.models).map(([modelId, label]) => (
                    <option key={modelId} value={modelId}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* API Key Input (if not builtin) */}
            {selectedProviderId !== 'builtin' ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-400">
                    API Key ya {currentProvider.name}:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-[11px] text-gray-400 hover:text-gray-200"
                  >
                    {showKey ? 'Ficha Key' : 'Onyesha Key'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={`Weka ${currentProvider.name} API Key yako hapa...`}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-mono border outline-none transition-colors ${tc.bgInput} ${tc.text} ${tc.border} focus:border-blue-500 pr-24`}
                  />
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !keyInput.trim()}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 disabled:opacity-40 transition-colors"
                  >
                    {isTesting ? 'Inapima...' : 'Jaribu Key'}
                  </button>
                </div>

                {/* Test Result Feedback */}
                {testResult.status === 'success' && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 flex items-center justify-between">
                    <span>✓ {testResult.message}</span>
                    {testResult.latency !== undefined && (
                      <span className="font-mono text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded">
                        {testResult.latency} ms
                      </span>
                    )}
                  </div>
                )}
                {testResult.status === 'error' && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                    ✕ {testResult.message}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                ✨ Mfumo wa asili wa <strong>Longa Native AI</strong> hauhitaji API key yoyote na unafanya kazi mara moja bila mtandao wa nje au gharama!
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className={`flex items-center justify-between px-6 py-4 border-t ${tc.border} ${tc.bgSecondary}`}>
          <button
            type="button"
            onClick={handleResetToNative}
            className="text-xs text-gray-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Rejesha ya Ndani (Bure)
          </button>

          <div className="flex items-center gap-3">
            {saveFeedback && <span className="text-xs font-semibold text-emerald-400">{saveFeedback}</span>}
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${tc.bgTertiary} ${tc.textSecondary} hover:text-white`}
            >
              Funga
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all"
            >
              Hifadhi na Tumia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
