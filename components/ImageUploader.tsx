import React, { useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  selectedImage: string | null;
  onImageSelect: (base64: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ selectedImage, onImageSelect }) => {
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("الصورة كبيرة أوي يا كبير، خليها أقل من 5 ميجا");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center">١. ارفع صورتك (سيلفي واضح)</h3>
      
      {!selectedImage ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative w-full h-64 border-4 border-dashed border-yellow-600/50 rounded-xl bg-white/60 hover:bg-white/80 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <div className="bg-yellow-100 p-4 rounded-full mb-3 shadow-inner">
               <Upload className="w-8 h-8 text-yellow-800" />
            </div>
            <p className="text-lg font-bold text-yellow-900">دوس هنا وارفع صورتك</p>
            <p className="text-sm text-yellow-700 mt-1">PNG, JPG (حد أقصى 5 ميجا)</p>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-auto rounded-xl overflow-hidden border-4 border-yellow-600 shadow-2xl bg-black">
           <img src={selectedImage} alt="Uploaded" className="w-full h-auto object-contain max-h-96 mx-auto" />
           <button 
             onClick={handleClear}
             className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg z-20"
           >
             <X className="w-5 h-5" />
           </button>
           <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 backdrop-blur-sm">
             <span className="flex items-center justify-center gap-2">
               <ImageIcon className="w-4 h-4" /> الصورة الأصلية
             </span>
           </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;