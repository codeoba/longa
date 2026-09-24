import React, { useState } from 'react';
import { useThemeClasses } from '../themeUtils';

interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  createdAt: Date;
}

export default function AIImageGenerator() {
  const tc = useThemeClasses();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('realistic');

  const styles = [
    { id: 'realistic', name: 'Realistic', icon: '📷' },
    { id: 'anime', name: 'Anime', icon: '🎨' },
    { id: 'digital-art', name: 'Digital Art', icon: '🖼️' },
    { id: '3d', name: '3D Render', icon: '🎭' },
    { id: 'pixel', name: 'Pixel Art', icon: '👾' },
    { id: 'abstract', name: 'Abstract', icon: '🌀' },
  ];

  const samplePrompts = [
    'A futuristic city at sunset with flying cars',
    'A cute robot reading a book in a library',
    'A magical forest with glowing mushrooms',
    'An astronaut floating in space with Earth in background',
    'A cozy coffee shop on a rainy day',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    const activePrompt = prompt;

    try {
      const { getApiUrl } = await import('../api/phpAdapter');
      const res = await fetch(`${getApiUrl()}/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: activePrompt, style: selectedStyle }),
      });

      if (res.ok) {
        const json = await res.json();
        const newImage: GeneratedImage = {
          id: json.id || Date.now().toString(),
          prompt: json.prompt || activePrompt,
          url: json.url,
          createdAt: new Date(),
        };

        setGeneratedImages(prev => [newImage, ...prev]);
        setPrompt('');
        setIsGenerating(false);
        return;
      }
    } catch (e) {
      console.warn('Real AI generation fallback to dynamic engine:', e);
    }

    // Dynamic fallback
    const seed = Date.now();
    const encoded = encodeURIComponent(activePrompt + ', ' + selectedStyle);
    const fallbackImage: GeneratedImage = {
      id: Date.now().toString(),
      prompt: activePrompt,
      url: `https://image.pollinations.ai/prompt/${encoded}?width=800&height=800&seed=${seed}&nologo=true`,
      createdAt: new Date(),
    };

    setGeneratedImages(prev => [fallbackImage, ...prev]);
    setPrompt('');
    setIsGenerating(false);
  };

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `ai-image-${image.id}.jpg`;
    link.click();
  };

  const handleDelete = (id: string) => {
    setGeneratedImages(generatedImages.filter((img) => img.id !== id));
  };

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-0 z-30 ${tc.bgBackdrop} backdrop-blur-xl border-b ${tc.border}`}>
        <div className="px-4 py-3">
          <h1 className={`text-xl font-bold ${tc.text} mb-1`}>AI Image Generator</h1>
          <p className={`text-sm ${tc.textSecondary}`}>
            Create stunning images from text descriptions
          </p>
        </div>
      </div>

      {/* Generator */}
      <div className={`p-4 border-b ${tc.border}`}>
        {/* Style selector */}
        <div className="mb-4">
          <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
            Style
          </label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border-2 transition-all flex-shrink-0 ${
                  selectedStyle === style.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : `${tc.border} ${tc.bgCard}`
                }`}
              >
                <span className="text-2xl">{style.icon}</span>
                <span className={`text-xs font-medium ${tc.text}`}>{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt input */}
        <div className="mb-4">
          <label className={`block text-sm font-medium ${tc.textSecondary} mb-2`}>
            Describe your image
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A futuristic city at sunset..."
            className={`w-full px-4 py-3 rounded-lg border ${tc.border} ${tc.bgInput} ${tc.text} outline-none focus:border-blue-500 resize-none`}
            rows={3}
          />
        </div>

        {/* Sample prompts */}
        <div className="mb-4">
          <p className={`text-xs ${tc.textSecondary} mb-2`}>Try these prompts:</p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((sample, index) => (
              <button
                key={index}
                onClick={() => setPrompt(sample)}
                className={`px-3 py-1.5 rounded-full text-xs ${tc.bgCard} ${tc.textSecondary} hover:bg-blue-500/10 hover:text-blue-500 transition-colors`}
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Image
            </>
          )}
        </button>
      </div>

      {/* Generated Images */}
      <div className="p-4">
        <h2 className={`text-lg font-bold ${tc.text} mb-4`}>
          Generated Images ({generatedImages.length})
        </h2>

        {generatedImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className={`text-xl font-bold ${tc.text} mb-2`}>No images yet</h3>
            <p className={tc.textSecondary}>
              Generate your first AI image to see it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {generatedImages.map((image) => (
              <div
                key={image.id}
                className={`${tc.bgCard} rounded-xl border ${tc.border} overflow-hidden group`}
              >
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleDownload(image)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white backdrop-blur-sm"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className={`text-xs ${tc.text} line-clamp-2`}>{image.prompt}</p>
                  <p className={`text-xs ${tc.textSecondary} mt-1`}>
                    {image.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
