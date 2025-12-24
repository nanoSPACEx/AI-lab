import React, { useState } from 'react';
import { generateArtConcept } from '../services/geminiService';
import { ArtConcept, WebSource } from '../types';
import { Sparkles, Loader2, RefreshCw, Download, Search, Globe } from 'lucide-react';

const ConceptGenerator: React.FC = () => {
  const [difficulty, setDifficulty] = useState('Intermedi');
  const [focus, setFocus] = useState('Expressivitat');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [concept, setConcept] = useState<ArtConcept | null>(null);
  const [sources, setSources] = useState<WebSource[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    setConcept(null);
    setSources([]);
    try {
      const result = await generateArtConcept(difficulty, focus, topic);
      setConcept(result.concept);
      setSources(result.sources);
    } catch (error) {
      alert("Error generant el concepte. Torna-ho a provar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!concept) return;

    let textContent = `PROJECTE D'ART: ${concept.theme}
----------------------------------------
Tècnica: ${concept.technique}
Materials: ${concept.material}

DESCRIPCIÓ:
${concept.description}
`;

    if (sources.length > 0) {
      textContent += `\nFONTS D'INSPIRACIÓ:\n`;
      sources.forEach(source => {
        textContent += `- ${source.title}: ${source.uri}\n`;
      });
    }

    textContent += `\nGenerat per ArtStudio AI`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `concepte-artistic-${concept.theme.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-gray-700">Tema o Concepte específic (Opcional)</label>
          <div className="relative">
             <input 
               type="text" 
               value={topic}
               onChange={(e) => setTopic(e.target.value)}
               placeholder="Ex: Canvi climàtic, Futurisme, La ciutat..."
               className="w-full p-3 pl-10 rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none"
             />
             <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500">Utilitzarem Google Search per trobar inspiració si especifiques un tema.</p>
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
            <div className="flex gap-2">
              <button 
                onClick={handleDownload} 
                className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-100 rounded-lg transition-colors" 
                title="Descarregar TXT"
              >
                 <Download className="h-5 w-5" />
              </button>
              <button 
                onClick={handleGenerate} 
                className="text-indigo-600 hover:text-indigo-800 p-2 hover:bg-indigo-100 rounded-lg transition-colors" 
                title="Regenerar"
              >
                 <RefreshCw className="h-5 w-5" />
              </button>
            </div>
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

            {sources.length > 0 && (
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2 mb-3">
                  <Globe className="h-4 w-4" /> Fonts i Referències
                </h4>
                <ul className="space-y-2">
                  {sources.map((source, index) => (
                    <li key={index} className="text-sm">
                      <a 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline flex items-start gap-2"
                      >
                         <span className="text-gray-400">•</span> {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConceptGenerator;