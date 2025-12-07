import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import ResultDisplay from './components/ResultDisplay';
import PharaohChat from './components/PharaohChat';
import { PharaohStyle, Gender, GenerationState } from './types';
import { transformImageToPharaoh } from './services/geminiService';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [style, setStyle] = useState<PharaohStyle>(PharaohStyle.ROYAL);
  
  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    resultImage: null,
  });

  const handleImageSelect = useCallback((base64: string | null) => {
    setSelectedImage(base64);
    setGenerationState(prev => ({ ...prev, resultImage: null, error: null }));
  }, []);

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setGenerationState({
      isLoading: true,
      error: null,
      resultImage: null
    });

    try {
      const result = await transformImageToPharaoh(selectedImage, style, gender);
      setGenerationState({
        isLoading: false,
        error: null,
        resultImage: result
      });
    } catch (error: any) {
      setGenerationState({
        isLoading: false,
        error: error.message || "حصل حاجة غلط، جرب تاني",
        resultImage: null
      });
    }
  };

  return (
    <div className="min-h-screen papyrus-effect pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Input and Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-yellow-600/20">
              <ImageUploader 
                selectedImage={selectedImage} 
                onImageSelect={handleImageSelect} 
              />
            </div>
            
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-yellow-600/20">
              <Controls 
                gender={gender}
                setGender={setGender}
                style={style}
                setStyle={setStyle}
                onGenerate={handleGenerate}
                isLoading={generationState.isLoading}
                hasImage={!!selectedImage}
              />
            </div>
          </div>

          {/* Right Column: Result */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-yellow-600/20">
              <ResultDisplay 
                resultImage={generationState.resultImage} 
                error={generationState.error} 
              />
            </div>
            
            {/* Chat Section - Now in the right column below result on desktop, or stacked on mobile */}
            <div className="animate-fade-in-up delay-200">
               <PharaohChat />
            </div>

             <div className="mt-auto pt-8 text-center opacity-60">
                 <div className="flex items-center justify-center gap-2 mb-2">
                   <span className="h-px w-12 bg-yellow-800"></span>
                   <span className="text-2xl">👁️</span>
                   <span className="h-px w-12 bg-yellow-800"></span>
                 </div>
                 <p className="text-xs text-yellow-900 font-serif">
                   صنع بحب في مصر (رامز بسام)
                 </p>
              </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;