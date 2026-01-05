import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import RoadmapTimeline from './components/RoadmapTimeline';
import RoadmapStats from './components/RoadmapStats';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import { generateRoadmap } from './services/geminiService';
import { RoadmapData, RoadmapRequest } from './types';
import { BrainCircuit, Github, Download, LogOut, User as UserIcon, Loader2, Share2, FileDown, Check, Link as LinkIcon, UploadCloud } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [view, setView] = useState<'MAIN' | 'PRIVACY'>('MAIN');
  
  // State for sharing & saving
  const [currentRequest, setCurrentRequest] = useState<RoadmapRequest | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Parse URL params for shared links
    const params = new URLSearchParams(window.location.search);
    const topicsParam = params.get('topics');
    if (topicsParam) {
      const request: RoadmapRequest = {
        topics: topicsParam.split(',').map(t => t.trim()),
        experienceLevel: params.get('experience') || 'Intermediate',
        startDate: params.get('startDate') || '2026-01-01',
        endDate: params.get('endDate') || '2026-12-31',
        hoursPerWeek: parseInt(params.get('hours') || '10'),
      };
      setCurrentRequest(request);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        setDeferredPrompt(null);
      });
    }
  };

  const handleGenerate = async (topics: string[], experience: string, startDate: string, endDate: string, hoursPerWeek: number) => {
    setIsLoading(true);
    setError(null);
    setRoadmapData(null);
    setSaveSuccess(false);
    
    // Update current request state for sharing purposes
    setCurrentRequest({
      topics,
      experienceLevel: experience,
      startDate,
      endDate,
      hoursPerWeek
    });

    try {
      const data = await generateRoadmap(
        topics,
        startDate,
        endDate,
        experience,
        hoursPerWeek
      );
      setRoadmapData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred. Please check your network and API Key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleHomeClick = () => {
    setRoadmapData(null);
    setError(null);
    setCurrentRequest(null);
    setSaveSuccess(false);
    setView('MAIN');
    // Clear URL params without reload
    window.history.pushState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (!currentRequest) return;
    
    const params = new URLSearchParams();
    params.set('topics', currentRequest.topics.join(','));
    params.set('experience', currentRequest.experienceLevel);
    params.set('startDate', currentRequest.startDate);
    params.set('endDate', currentRequest.endDate);
    params.set('hours', currentRequest.hoursPerWeek.toString());
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSaveToCloud = async () => {
    if (!roadmapData || !user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase.from('roadmaps').insert({
        user_id: user.id,
        title: `Roadmap: ${currentRequest?.topics[0] || 'Custom'}`,
        summary: roadmapData.summary,
        content: roadmapData // Storing the full JSON structure
      });

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving roadmap:', err);
      setError('Failed to save roadmap to database.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('roadmap-content');
    if (!element) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = pdfWidth / imgWidth;
      const imgHeightScaled = imgHeight * ratio;
      
      const pdfCustom = new jsPDF('p', 'mm', [pdfWidth, Math.max(pdfHeight, imgHeightScaled + 20)]);
      
      pdfCustom.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightScaled);
      pdfCustom.save(`Nexus-Roadmap-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (err) {
      console.error('PDF generation failed', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const Footer = () => (
    <footer className="border-t border-blue-100 bg-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
        <p className="text-slate-600 font-medium text-sm md:text-base">
          Developed by{' '}
          <a 
            href="https://shadmansakib.onrender.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-900 font-bold hover:text-blue-600 transition-colors"
          >
            Engr. Shadman Sakib
          </a>
        </p>
        <p className="text-slate-500 text-xs md:text-sm">
          Programmer, EMIS cell,{' '}
          <a 
            href="https://dshe.gov.bd/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline decoration-blue-200 hover:decoration-blue-600 underline-offset-2 transition-colors"
          >
            DSHE
          </a>
        </p>
        <div className="pt-2">
            <button 
                onClick={() => {
                    setView('PRIVACY');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="text-xs text-slate-400 hover:text-blue-600 transition-colors font-medium"
            >
                Privacy Policy & Terms
            </button>
        </div>
      </div>
    </footer>
  );

  const Navbar = () => (
    <nav className="border-b border-blue-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <button 
            onClick={handleHomeClick}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Go to Home"
          >
            <BrainCircuit className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-600">
              Nexus Learning
            </span>
          </button>

          {user && (
            <div className="flex items-center gap-4">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Install App
                </button>
              )}
              
               <a 
                 href="https://github.com" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-slate-500 hover:text-slate-900 transition-colors p-1"
               >
                 <Github className="w-5 h-5" />
               </a>

              <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-slate-200">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold border border-blue-200 overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Render Logic
  const renderContent = () => {
    if (view === 'PRIVACY') {
      return (
        <main className="flex-grow flex items-start justify-center p-4">
          <PrivacyPolicy onBack={() => {
            setView('MAIN');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        </main>
      );
    }

    if (!user) {
      return (
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-10 px-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                AI-Powered Learning Architect for Professionals
              </h1>
              <p className="text-slate-600 max-w-2xl mx-auto text-center px-2 text-base sm:text-lg">
                Join Nexus Learning Architect to build personalized, AI-driven curricula for advanced technologies.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              {isRegistering ? (
                <RegisterPage onSwitchToLogin={() => setIsRegistering(false)} />
              ) : (
                <LoginPage onSwitchToRegister={() => setIsRegistering(true)} />
              )}
            </div>
          </div>
        </main>
      );
    }

    // Main App
    return (
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Text - Only show on Home when no data */}
        {!roadmapData && !isLoading && (
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">
              Design Your AI-Powered Learning Path
            </h1>
            <p className="text-lg sm:text-xl text-slate-500 italic mb-8 font-medium">
              Tailored to your goals, schedule, and experience level
            </p>
            <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed text-center">
              Generate a personalized, AI-driven curriculum for your custom timeline covering Cybersecurity, Generative AI, Digital Transformation, Nexus Tech, and more. We analyze your goals, time availability, and experience level to generate a structured, adaptive curriculum.
            </p>
          </div>
        )}

        {/* Input Form */}
        {!roadmapData && (
          <div className="flex justify-center mb-12">
            <InputForm 
              onSubmit={handleGenerate} 
              isLoading={isLoading} 
              initialValues={currentRequest || undefined}
            />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center mb-8 shadow-sm">
            {error}
          </div>
        )}

        {/* Roadmap Display */}
        {roadmapData && (
          <div className="animate-fade-in-up space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-blue-100 pb-6 gap-6">
               <div className="w-full">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Personalized Learning Protocol</h2>
                  <p className="text-slate-600 max-w-4xl leading-relaxed text-justify">
                    {roadmapData.summary}
                  </p>
               </div>
               
               {/* Action Buttons */}
               <div className="flex flex-wrap gap-3 w-full md:w-auto">
                 <button
                   onClick={handleSaveToCloud}
                   disabled={isSaving || saveSuccess}
                   className={`flex items-center justify-center gap-2 border px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm font-medium disabled:opacity-50 ${
                     saveSuccess 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                   }`}
                 >
                   {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : saveSuccess ? <Check className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                   {saveSuccess ? 'Saved' : 'Save'}
                 </button>

                 <button
                   onClick={handleShare}
                   className="flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm font-medium"
                 >
                   {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                   {isCopied ? 'Copied' : 'Share'}
                 </button>

                 <button
                   onClick={handleDownloadPDF}
                   disabled={isDownloading}
                   className="flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm font-medium disabled:opacity-50"
                 >
                   {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
                   {isDownloading ? 'PDF' : 'PDF'}
                 </button>

                 <button 
                  onClick={handleHomeClick}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors shadow-sm text-sm font-medium"
                 >
                   New
                 </button>
               </div>
            </div>
            
            {/* ID for PDF capture */}
            <div id="roadmap-content" className="bg-slate-50 p-4 md:p-6 -m-2 md:-m-4 rounded-xl">
              <RoadmapStats items={roadmapData.items} totalHours={roadmapData.totalHours} />
              
              <div className="mt-8 md:mt-12">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-8 pl-4 border-l-4 border-blue-600">
                  Curriculum Timeline
                </h3>
                <RoadmapTimeline items={roadmapData.items} />
              </div>
            </div>

          </div>
        )}
      </main>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Navbar />
      {renderContent()}
      <Footer />
    </div>
  );
};

export default App;
