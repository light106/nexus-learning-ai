import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, Calendar, BookOpen, Plus, Clock } from 'lucide-react';
import { RoadmapRequest } from '../types';

interface InputFormProps {
  onSubmit: (topics: string[], experience: string, startDate: string, endDate: string, hoursPerWeek: number) => void;
  isLoading: boolean;
  initialValues?: RoadmapRequest;
}

const TRENDING_TOPICS = [
  "Generative AI",
  "Cybersecurity", 
  "Digital Transformation",
  "Nexus Tech",
  "Cloud Computing",
  "DevSecOps"
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  const [topics, setTopics] = useState<string>('AI, ML, Cybersecurity, Digital Transformation');
  const [experience, setExperience] = useState<string>('Intermediate');
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);

  useEffect(() => {
    if (initialValues) {
      setTopics(Array.isArray(initialValues.topics) ? initialValues.topics.join(', ') : '');
      setExperience(initialValues.experienceLevel);
      setStartDate(initialValues.startDate);
      setEndDate(initialValues.endDate);
      setHoursPerWeek(initialValues.hoursPerWeek);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const topicList = topics.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    onSubmit(topicList, experience, startDate, endDate, hoursPerWeek);
  };

  const addTopic = (topic: string) => {
    const currentTopics = topics.split(',').map(t => t.trim().toLowerCase());
    if (!currentTopics.includes(topic.toLowerCase())) {
      setTopics(prev => prev.trim().length > 0 ? `${prev}, ${topic}` : topic);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-6 md:p-8 shadow-xl shadow-slate-200 border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-50 rounded-lg">
          <Sparkles className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Generate Your Path</h2>
          <p className="text-slate-500 text-sm">Design your personalized learning odyssey</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
               <Calendar className="w-4 h-4 text-slate-400" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              min={startDate}
              className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Weekly Commitment
            </span>
            <span className="text-blue-600 font-bold">{hoursPerWeek} hours/week</span>
          </label>
          <input
            type="range"
            min="2"
            max="40"
            step="1"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
            <span>Casual (2h)</span>
            <span>Part-time (20h)</span>
            <span>Full-time (40h)</span>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" /> Focus Areas
            </label>
            <span className="text-xs text-slate-400">Add trending topics:</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {TRENDING_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => addTopic(topic)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 hover:border-blue-200 transition-colors"
              >
                <Plus className="w-3 h-3" /> {topic}
              </button>
            ))}
          </div>

          <textarea
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-24 placeholder:text-slate-400 text-sm shadow-sm"
            placeholder="e.g. Generative AI, Zero Trust Security, Cloud Native Architecture..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Experience Level</label>
          <div className="grid grid-cols-3 gap-3">
            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setExperience(level)}
                className={`px-2 md:px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all border ${
                  experience === level
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 border-transparent'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> <span className="hidden md:inline">Generating Roadmap...</span><span className="md:hidden">Generating...</span>
            </>
          ) : (
            <>
              {initialValues ? 'Generate Shared Path' : 'Generate My Learning Path'} <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
