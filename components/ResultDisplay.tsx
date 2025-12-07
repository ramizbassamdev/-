import React from 'react';
import { Download, Share2, Sparkles } from 'lucide-react';

interface ResultDisplayProps {
  resultImage: string | null;
  error: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ resultImage, error }) => {
  if (error) {
    return (
      <div className="w-full h-64 bg-red-50 border-4 border-red-200 rounded-xl flex items-center justify-center p-6 text-center">
        <div>
           <span className="text-4xl mb-2 block">🦂</span>
           <p className="text-red-800 font-bold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!resultImage) {
    return (
      <div className="w-full h-96 bg-yellow-900/5 border-4 border-dashed border-yellow-600/30 rounded-xl flex items-center justify-center text-center p-8">
        <div>
          <Sparkles className="w-16 h-16 text-yellow-600/40 mx-auto mb-4" />
          <p className="text-yellow-800/60 font-bold text-xl">النتيجة هتظهر هنا<br/>أول ما الكهنة يخلصوا شغلهم</p>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `my-pharaoh-look-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full animate-fade-in-up">
      <h3 className="text-3xl font-black text-center text-blue-900 mb-6 drop-shadow-sm">✨ الف مبروك يا جلالة الملك! ✨</h3>
      
      <div className="relative group rounded-xl overflow-hidden shadow-2xl border-4 border-yellow-500 bg-black">
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white z-20"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white z-20"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white z-20"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white z-20"></div>

        <img 
          src={resultImage} 
          alt="Pharaonic Transformation" 
          className="w-full h-auto object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8 gap-4">
          <button 
            onClick={handleDownload}
            className="bg-yellow-500 text-black font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition-transform hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            حمل الصورة
          </button>
        </div>
      </div>
      
      <p className="text-center text-yellow-800 font-semibold mt-4 text-lg">
        ايه الحلاوة دي! متنساش تشاركها مع أصحابك
      </p>
    </div>
  );
};

export default ResultDisplay;