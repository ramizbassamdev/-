import React from 'react';
import { Camera } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700"></div>
      
      <div className="inline-flex items-center justify-center p-4 bg-white/50 backdrop-blur-sm rounded-full border-2 border-yellow-600 shadow-xl mb-4">
        <Camera className="w-8 h-8 text-yellow-800 ml-2" />
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-800 to-yellow-600 drop-shadow-sm">
         زمن الفراعنة
        </h1>
        <Camera className="w-8 h-8 text-yellow-800 mr-2" />
      </div>
      
      <p className="text-xl md:text-2xl text-blue-900 font-bold mt-2">
        شوف نفسك وأنت بتحكم مصر أيام زمان
      </p>
      <div className="w-24 h-1 bg-yellow-600 mx-auto mt-4 rounded-full"></div>
    </header>
  );
};

export default Header;