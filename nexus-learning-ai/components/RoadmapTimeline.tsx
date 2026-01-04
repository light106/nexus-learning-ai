import React from 'react';
import { RoadmapItem, Category, Difficulty } from '../types';
import { Clock, Book, Target, Award, ExternalLink, Calendar } from 'lucide-react';

interface RoadmapTimelineProps {
  items: RoadmapItem[];
}

const getCategoryColor = (category: Category) => {
  switch (category) {
    case Category.AI: return 'border-pink-200 text-pink-700 bg-pink-50';
    case Category.ML: return 'border-purple-200 text-purple-700 bg-purple-50';
    case Category.DS: return 'border-blue-200 text-blue-700 bg-blue-50';
    case Category.Blockchain: return 'border-teal-200 text-teal-700 bg-teal-50';
    default: return 'border-slate-200 text-slate-700 bg-slate-50';
  }
};

const getDifficultyBadge = (difficulty: Difficulty) => {
  const styles = {
    [Difficulty.Beginner]: 'bg-green-50 text-green-700 border-green-200',
    [Difficulty.Intermediate]: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    [Difficulty.Advanced]: 'bg-orange-50 text-orange-700 border-orange-200',
    [Difficulty.Expert]: 'bg-red-50 text-red-700 border-red-200',
  };
  return styles[difficulty] || styles[Difficulty.Intermediate];
};

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ items }) => {
  return (
    <div className="relative space-y-8 md:space-y-12">
      {/* Vertical Line: Hidden on small screens if simpler layout preferred, but usually good to keep left-aligned on mobile */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-100 via-blue-200 to-transparent md:-translate-x-1/2"></div>

      {items.map((item, index) => {
        const categoryStyle = getCategoryColor(item.category);
        
        return (
          <div key={item.id} className={`relative flex flex-col md:flex-row items-center md:justify-between group`}>
            
            {/* Dot/Icon on the line */}
            <div className={`absolute left-4 md:left-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-white shadow-sm z-10 -translate-x-1/2 md:-translate-x-1/2 mt-6 md:mt-0 ring-1 ring-blue-200 ${categoryStyle.split(' ')[2]}`}>
            </div>

            {/* Spacer for alternating layout */}
            <div className={`hidden md:block w-1/2 ${index % 2 === 0 ? 'order-2' : 'order-1'}`}></div>

            {/* Content Card */}
            <div className={`w-full md:w-[calc(50%-2rem)] pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-8 md:text-right order-1' : 'md:pl-8 md:text-left order-2'}`}>
              
              <div className={`bg-white border border-blue-100 rounded-xl p-5 md:p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md hover:-translate-y-1 relative`}>
                 
                 {/* Mobile-only arrow indicator could go here, but omitted for cleaner look */}

                {/* Header */}
                <div className={`flex flex-col gap-2 mb-3 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
                  <div className="flex flex-wrap gap-2 items-center">
                      <span className={`inline-block px-2 py-0.5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded border ${categoryStyle}`}>
                          {item.category}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] md:text-xs font-medium border rounded ${getDifficultyBadge(item.difficulty)}`}>
                        {item.difficulty}
                      </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 leading-tight">{item.title}</h3>
                </div>

                {/* Date & Duration */}
                <div className={`flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-500 mb-4 font-mono ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.startDate}</span>
                    <span className="text-slate-300">→</span>
                    <span>{item.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.estimatedHours}h</span>
                  </div>
                </div>

                <p className="text-slate-600 mb-4 text-sm leading-relaxed text-justify">
                  {item.description}
                </p>

                {/* Key Topics */}
                <div className={`mb-4 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <div className={`flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <Target className="w-3 h-3" /> Key Concepts
                  </div>
                  <div className={`flex flex-wrap gap-1.5 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    {item.keyTopics.map((topic, i) => (
                      <span key={i} className="px-2 py-1 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded hover:bg-white hover:border-blue-200 transition-colors">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <div className={`flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                    <Book className="w-3 h-3" /> Resources
                  </div>
                  <ul className={`space-y-1.5 ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                    {item.recommendedResources.map((res, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-500">
                        <ExternalLink className="w-3 h-3 text-blue-400 shrink-0" />
                        <a 
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 hover:underline decoration-blue-300 underline-offset-2 transition-colors break-all"
                        >
                          {res.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        );
      })}
      
      {/* End marker */}
      <div className="relative flex items-center justify-center pt-8">
         <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-blue-600 shadow-xl z-10 text-white ring-1 ring-blue-100">
            <Award className="w-6 h-6" />
         </div>
      </div>
    </div>
  );
};

export default RoadmapTimeline;