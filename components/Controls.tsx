import React from 'react';
import { PharaohStyle, Gender } from '../types';
import { Crown, Sword, Scroll, User, Sparkles } from 'lucide-react';

interface ControlsProps {
  gender: Gender;
  setGender: (g: Gender) => void;
  style: PharaohStyle;
  setStyle: (s: PharaohStyle) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasImage: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  gender, setGender, 
  style, setStyle, 
  onGenerate, isLoading, hasImage 
}) => {

  const getIcon = (s: PharaohStyle) => {
    switch(s) {
      case PharaohStyle.ROYAL: return <Crown className="w-5 h-5" />;
      case PharaohStyle.WARRIOR: return <Sword className="w-5 h-5" />;
      case PharaohStyle.SCRIBE: return <Scroll className="w-5 h-5" />;
      case PharaohStyle.PRIEST: return <Sparkles className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Gender Selection */}
      <div className="bg-white/40 p-4 rounded-xl border border-yellow-600/30">
        <h3 className="text-xl font-bold text-blue-900 mb-3">٢. إنت مين؟</h3>
        <div className="flex gap-4">
          {[Gender.MALE, Gender.FEMALE].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-bold text-lg
                ${gender === g 
                  ? 'bg-blue-900 border-blue-900 text-white shadow-lg scale-105' 
                  : 'bg-white border-yellow-600/50 text-yellow-900 hover:bg-yellow-50'}`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Style Selection */}
      <div className="bg-white/40 p-4 rounded-xl border border-yellow-600/30">
        <h3 className="text-xl font-bold text-blue-900 mb-3">٣. عايز تبقى إيه؟</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.values(PharaohStyle).map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 text-right transition-all
                ${style === s 
                  ? 'bg-yellow-600 border-yellow-800 text-white shadow-md transform translate-x-2' 
                  : 'bg-white/80 border-yellow-200 text-yellow-900 hover:border-yellow-500'}`}
            >
              <div className={`p-2 rounded-full ${style === s ? 'bg-white/20' : 'bg-yellow-100'}`}>
                {getIcon(s)}
              </div>
              <span className="font-bold">{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !hasImage}
        className={`w-full py-4 px-6 rounded-xl font-black text-2xl text-white shadow-xl transition-all transform
          ${isLoading || !hasImage 
            ? 'bg-gray-400 cursor-not-allowed grayscale' 
            : 'bg-gradient-to-r from-blue-700 via-blue-900 to-blue-700 hover:scale-105 hover:shadow-2xl active:scale-95 border-b-4 border-blue-950'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-3">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            بنسأل الكهنة...
          </span>
        ) : (
          "حـولـنـي لـفـرعـون! ⚡"
        )}
      </button>

      {!hasImage && (
        <p className="text-center text-red-600 font-bold text-sm bg-red-100 py-1 rounded">
          * لازم ترفع صورتك الأول يا باشا
        </p>
      )}
    </div>
  );
};

export default Controls;