import React, { useState } from 'react';
import { sections } from '@/data/lessons';
import { ChevronDown, ChevronRight, BookOpen, Target, Atom } from 'lucide-react';

interface SidebarProps {
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onGoHome: () => void;
}

const sectionColors: Record<string, string> = {
  'mechanical-oscillations': {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    accent: 'bg-blue-500',
    hover: 'hover:bg-blue-100',
  },
  'electromagnetic-oscillations': {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    accent: 'bg-emerald-500',
    hover: 'hover:bg-emerald-100',
  },
  'alternating-current': {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    accent: 'bg-amber-500',
    hover: 'hover:bg-amber-100',
  },
};

export const Sidebar: React.FC<SidebarProps> = ({ selectedTopicId, onSelectTopic, onGoHome }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'mechanical-oscillations': true,
    'electromagnetic-oscillations': true,
    'alternating-current': true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <aside className="w-80 h-screen bg-white border-r border-slate-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-slate-200 bg-gradient-to-br from-slate-800 to-slate-900">
        <button onClick={onGoHome} className="flex items-center gap-3 text-left w-full group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <Atom className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">Физика и спорт</h1>
            <p className="text-slate-400 text-xs">Спецкурс · 11 класс ОГН</p>
          </div>
        </button>
      </div>

      {/* Author info */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
        <p className="text-xs text-slate-500">Автор курса</p>
        <p className="text-sm font-semibold text-slate-700">Кунгозин Д. Б.</p>
        <p className="text-xs text-slate-400">Учитель физики</p>
      </div>

      {/* School info */}
      <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
        <p className="text-xs text-slate-500">Школа</p>
        <p className="text-xs font-medium text-slate-600 leading-snug">
          КГУ «Специализированная школа-интернат-колледж олимпийского резерва»
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Разделы и темы
        </p>
        {sections.map((section) => {
          const colors = sectionColors[section.id] || sectionColors['mechanical-oscillations'];
          const isExpanded = expandedSections[section.id];

          return (
            <div key={section.id} className="mb-4">
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg ${colors.bg} ${colors.border} border transition-all`}
              >
                <div className={`w-2 h-2 rounded-full ${colors.accent}`} />
                <span className={`flex-1 text-left text-sm font-semibold ${colors.text}`}>
                  {section.title}
                </span>
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${colors.text}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${colors.text}`} />
                )}
              </button>

              {/* Topics */}
              {isExpanded && (
                <div className="mt-2 ml-3 space-y-1 animate-slide-in">
                  {section.topics.map((topic, idx) => {
                    const isSelected = selectedTopicId === topic.id;
                    return (
                      <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                          isSelected
                            ? `${colors.bg} ${colors.text} font-semibold ring-1 ${colors.border}`
                            : 'hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`text-xs font-mono mt-0.5 ${isSelected ? colors.text : 'text-slate-400'}`}>
                            {idx + 1}.
                          </span>
                          <div className="flex-1">
                            <p className="text-sm leading-snug">{topic.title}</p>
                            <div className="mt-1.5 flex items-center gap-1">
                              <Target className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-400">
                                {topic.objectives.map((o) => o.code).join(', ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <BookOpen className="w-3.5 h-3.5" />
          <span>8 уроков · 3 раздела</span>
        </div>
      </div>
    </aside>
  );
};
