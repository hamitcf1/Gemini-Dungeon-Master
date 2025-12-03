
import React from 'react';
import { StoryChapter } from '../types';
import { BookOpen, ArrowLeft, Calendar, User } from 'lucide-react';
import { UI_TEXT } from '../constants';

interface StoryBookProps {
  chapters: StoryChapter[];
  onClose: () => void;
  language: 'en' | 'tr' | 'ru';
}

const StoryBook: React.FC<StoryBookProps> = ({ chapters, onClose, language }) => {
  const t = UI_TEXT[language];

  return (
    <div className="absolute inset-0 z-40 bg-[#f4e4bc] text-[#2c1810] font-serif overflow-hidden flex flex-col animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-[#e6d2a0] p-4 border-b border-[#c9b07a] flex items-center justify-between shadow-md">
        <button onClick={onClose} className="flex items-center gap-2 text-[#5c3a2a] hover:text-[#2c1810] font-bold">
          <ArrowLeft size={20} /> {t.backToGame}
        </button>
        <h2 className="text-xl font-cinzel font-bold flex items-center gap-2">
          <BookOpen size={24} /> {t.storyTitle}
        </h2>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full custom-scrollbar-sepia">
        {chapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#8c735a]">
            <BookOpen size={48} className="mb-4 opacity-50" />
            <p className="text-xl italic font-cinzel">{t.emptyStory}</p>
          </div>
        ) : (
          <div className="space-y-12">
            {chapters.map((chapter, index) => (
              <article key={chapter.id} className="prose prose-stone max-w-none">
                <div className="text-center mb-8 border-b-2 border-[#c9b07a] pb-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-[#8c735a]">{t.chapter} {index + 1}</span>
                  <h1 className="text-3xl font-cinzel font-bold mt-2 text-[#2c1810]">{chapter.title}</h1>
                  <div className="flex items-center justify-center gap-4 text-xs text-[#5c3a2a] mt-2 font-sans">
                    <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(chapter.date).toLocaleDateString()}</span>
                    <span className="uppercase">{chapter.system}</span>
                  </div>
                </div>
                
                <div className="text-lg leading-relaxed text-justify whitespace-pre-wrap drop-cap">
                  {chapter.content}
                </div>
                
                <div className="flex justify-center mt-12">
                   <div className="w-12 h-1 bg-[#2c1810] rounded-full opacity-20"></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
};

export default StoryBook;
