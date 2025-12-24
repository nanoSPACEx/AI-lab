import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/geminiService';
import { Upload, Image as ImageIcon, Loader2, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Strip prefix for API usage if necessary, but keep for display
        setSelectedImage(base64String);
        setAnalysis(''); // Clear previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      // Remove data URL prefix for API call
      const base64Data = selectedImage.split(',')[1];
      const result = await analyzeImage(base64Data, question);
      setAnalysis(result);
    } catch (error) {
      alert("Error analitzant la imatge.");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* Left Panel: Image Upload */}
      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col">
            <h2 className="text-xl font-serif text-gray-800 mb-4">L'Ull Crític</h2>
            
            <div 
              className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${selectedImage ? 'border-indigo-300 bg-gray-50' : 'border-gray-300 hover:border-indigo-400 cursor-pointer'}`}
              onClick={!selectedImage ? triggerFileInput : undefined}
            >
              {selectedImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={selectedImage} alt="Uploaded art" className="max-h-full max-w-full object-contain rounded shadow-sm" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setAnalysis(''); }}
                    className="absolute top-2 right-2 bg-white/80 p-2 rounded-full hover:bg-white text-gray-700 shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="bg-indigo-50 p-4 rounded-full inline-block">
                    <Upload className="h-8 w-8 text-indigo-500" />
                  </div>
                  <p className="text-gray-600 font-medium">Clica per pujar una imatge</p>
                  <p className="text-gray-400 text-sm">JPG o PNG</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
           <label className="block text-sm font-medium text-gray-700 mb-2">Pregunta específica (opcional)</label>
           <div className="flex gap-2">
             <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Com s'utilitza la llum en aquesta obra?"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
             />
             <button 
                onClick={handleAnalyze}
                disabled={!selectedImage || loading}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${!selectedImage || loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
             >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                Analitzar
             </button>
           </div>
        </div>
      </div>

      {/* Right Panel: Analysis Result */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <ImageIcon className="h-4 w-4" /> Anàlisi Pedagògica
          </h3>
        </div>
        <div className="flex-1 p-6 overflow-y-auto prose prose-indigo max-w-none">
          {loading ? (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                <p>La IA està observant l'obra...</p>
             </div>
          ) : analysis ? (
            <ReactMarkdown>{analysis}</ReactMarkdown>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8">
              <p>Puja una imatge i clica "Analitzar" per veure els comentaris aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;