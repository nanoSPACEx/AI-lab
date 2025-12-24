import React, { useState } from 'react';
import { generateArtConcept } from '../services/geminiService';
import { ArtConcept } from '../types';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';

const ConceptGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState('Intermedi');
  const [focus, setFocus] = useState('Expressivitat');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<ArtConcept | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateArtConcept(difficulty, focus);
      setConcept(result);
    } catch (error) {
      alert("Error generant el concepte. Torna-ho a provar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-serif text-gray-800">Generador de Conceptes</h2>
        <p className="text-gray-600">Bloqueig creatiu? Deixa que la IA et suggereixi el teu pròxim projecte.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nivell de dificultat</label>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Principiant">Principiant (1r/2n ESO)</option>
              <option value="Intermedi">Intermedi (3r/4t ESO)</option>
              <option value="Avançat">Avançat (Batxillerat)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Enfocament</label>
            <select 
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Expressivitat">Expressivitat i Emoció</option>
              <option value="Tècnica Realista">Tècnica Realista</option>
              <option value="Abstracció">Abstracció i Forma</option>
              <option value="Art Conceptual">Art Conceptual</option>
              <option value="Disseny">Disseny i Composició</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader2 className="animate-spin h-5 w-5" /> Generant...</>
          ) : (
            <><Sparkles className="h-5 w-5" /> Generar Idea</>
          )}
        </button>
      </div>

      {concept && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100 animate-fade-in">
          <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex justify-between items-center">
            <h3 className="font-serif text-xl text-indigo-900 font-semibold">{concept.theme}</h3>
            <button onClick={handleGenerate} className="text-indigo-600 hover:text-indigo-800" title="Regenerar">
               <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Tècnica</span>
                <p className="text-lg text-gray-800 font-medium">{concept.technique}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Materials</span>
                <p className="text-lg text-gray-800 font-medium">{concept.material}</p>
              </div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold block mb-2">Descripció del Projecte</span>
              <p className="text-gray-700 leading-relaxed text-lg font-light">{concept.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptGenerator;