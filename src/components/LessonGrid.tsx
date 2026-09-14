import React from 'react';
import { sections } from '@/data/lessons';
import { ArrowRight, Target, BookOpen, Atom, Zap, Waves } from 'lucide-react';

interface LessonGridProps {
  onSelectTopic: (topicId: string) => void;
}

const sectionConfig: Record<string, { icon: React.FC<any>; gradient: string; cardBg: string; cardBorder: string; cardHover: string; accentText: string; accentBg: string }> = {
  'mechanical-oscillations': {
    icon: Waves,
    gradient: 'from-blue-500 to-cyan-500',
    cardBg: 'bg-blue-50',
    cardBorder: 'border-blue-200',
    cardHover: 'hover:border-blue-400',
    accentText: 'text-blue-600',
    accentBg: 'bg-blue-500',
  },
  'electromagnetic-oscillations': {
    icon: Atom,
    gradient: 'from-emerald-500 to-teal-500',
    cardBg: 'bg-emerald-50',
    cardBorder: 'border-emerald-200',
    cardHover: 'hover:border-emerald-400',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-500',
  },
  'alternating-current': {
    icon: Zap,
    gradient: 'from-amber-500 to-orange-500',
    cardBg: 'bg-amber-50',
    cardBorder: 'border-amber-200',
    cardHover: 'hover:border-amber-400',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-500',
  },
};

export const LessonGrid: React.FC<LessonGridProps> = ({ onSelectTopic }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero header */}
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 px-12 py-12">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
            <path d="M0,150 Q100,50 200,150 T400,150 T600,150 T800,150" stroke="white" strokeWidth="2" fill="none" />
            <path d="M0,150 Q100,250 200,150 T400,150 T600,150 T800,150" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <div className="relative max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-4">
            <Atom className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-300 font-medium">Спецкурс · Физика и спорт</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
            Физика и спорт: решение прикладных задач
          </h1>
          <p className="text-lg text-slate-400 mb-2">
            11 класс ОГН · Механические и электромагнитные колебания · Переменный ток
          </p>
          <p className="text-sm text-slate-500">
            Автор курса: Кунгозин Даулет Багдашұлы · КГУ «Специализированная школа-интернат-колледж олимпийского резерва»
          </p>
        </div>
      </div>

      {/* Lessons grid */}
      <div className="px-12 py-10 max-w-6xl">
        {sections.map((section) => {
          const config = sectionConfig[section.id];
          const Icon = config.icon;

          return (
            <div key={section.id} className="mb-12">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
                  <p className="text-sm text-slate-500">{section.topics.length} урока</p>
                </div>
              </div>

              {/* Topic cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {section.topics.map((topic, idx) => {
                  const problemCount = topic.lessonContent.problems.length;
                  const theoryCount = topic.lessonContent.theory.length;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(topic.id)}
                      className={`group text-left p-6 rounded-2xl border-2 ${config.cardBg} ${config.cardBorder} ${config.cardHover} transition-all hover:shadow-lg hover:-translate-y-0.5`}
                    >
                      {/* Lesson number badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                          {idx + 1}
                        </div>
                        <ArrowRight className={`w-5 h-5 ${config.accentText} opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all`} />
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-semibold text-slate-800 leading-snug mb-3">
                        {topic.title}
                      </h3>

                      {/* Learning objectives */}
                      <div className="space-y-1.5 mb-4">
                        {topic.objectives.map((obj) => (
                          <div key={obj.code} className="flex items-start gap-2">
                            <Target className={`w-3.5 h-3.5 ${config.accentText} mt-0.5 flex-shrink-0`} />
                            <div>
                              <span className={`text-xs font-mono font-semibold ${config.accentText}`}>{obj.code}</span>
                              <span className="text-xs text-slate-500 ml-1">— {obj.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 pt-3 border-t border-slate-200/60">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{theoryCount} разделов теории</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Atom className="w-3.5 h-3.5" />
                          <span>{problemCount} задач с решением</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
