import React, { useState } from 'react';
import { Palette, MessageSquare, Image as ImageIcon, Lightbulb, Menu, X } from 'lucide-react';
import ConceptGenerator from './components/ConceptGenerator';
import ImageAnalyzer from './components/ImageAnalyzer';
import HistoryChat from './components/HistoryChat';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavButton = ({ targetMode, icon: Icon, label }: { targetMode: AppMode, icon: any, label: string }) => (
    <button
      onClick={() => {
        setMode(targetMode);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200 ${
        mode === targetMode 
          ? 'bg-indigo-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 p-6 fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => setMode(AppMode.HOME)}>
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">ArtStudio AI</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <NavButton targetMode={AppMode.GENERATOR} icon={Lightbulb} label="Generador d'Idees" />
          <NavButton targetMode={AppMode.ANALYZER} icon={ImageIcon} label="L'Ull Crític" />
          <NavButton targetMode={AppMode.CHAT} icon={MessageSquare} label="Història de l'Art" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
           <p className="text-xs text-gray-400 text-center">Desenvolupat amb Gemini API</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Palette className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-serif font-bold text-gray-900">ArtStudio AI</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-10 pt-20 px-6 space-y-4">
          <NavButton targetMode={AppMode.GENERATOR} icon={Lightbulb} label="Generador d'Idees" />
          <NavButton targetMode={AppMode.ANALYZER} icon={ImageIcon} label="L'Ull Crític" />
          <NavButton targetMode={AppMode.CHAT} icon={MessageSquare} label="Història de l'Art" />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 pt-24 md:pt-12 transition-all">
        {mode === AppMode.HOME && (
          <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
            <div className="text-center space-y-6 py-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Benvingut a l'Aula Virtual</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Una col·lecció d'eines intel·ligents dissenyades per potenciar la creativitat i l'aprenentatge a l'aula d'arts plàstiques.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div 
                onClick={() => setMode(AppMode.GENERATOR)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="bg-yellow-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Inspiració Creativa</h3>
                <p className="text-gray-600 text-sm">Genera conceptes, tècniques i temes per als projectes dels teus alumnes quan la inspiració falla.</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.ANALYZER)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ImageIcon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Anàlisi Visual</h3>
                <p className="text-gray-600 text-sm">Puja fotografies d'obres per rebre una anàlisi pedagògica sobre composició i color.</p>
              </div>

              <div 
                onClick={() => setMode(AppMode.CHAT)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Consultori Històric</h3>
                <p className="text-gray-600 text-sm">Un xat interactiu especialitzat en història de l'art per resoldre dubtes i contextualitzar obres.</p>
              </div>
            </div>
          </div>
        )}

        {mode === AppMode.GENERATOR && <ConceptGenerator />}
        {mode === AppMode.ANALYZER && <ImageAnalyzer />}
        {mode === AppMode.CHAT && <HistoryChat />}
      </main>
    </div>
  );
};

export default App;