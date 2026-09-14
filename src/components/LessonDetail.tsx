import React, { useState } from 'react';
import { sections } from '@/data/lessons';
import { GraphRenderer } from '@/components/Graphs';
import { ArrowLeft, Target, BookOpen, PenTool, ChevronDown, ChevronUp, CheckCircle2, Lightbulb } from 'lucide-react';

interface LessonDetailProps {
  topicId: string;
  onBack: () => void;
}

const sectionConfig: Record<string, { gradient: string; accentText: string; accentBg: string; accentBorder: string; cardBg: string }> = {
  'mechanical-oscillations': {
    gradient: 'from-blue-500 to-cyan-500',
    accentText: 'text-blue-600',
    accentBg: 'bg-blue-50',
    accentBorder: 'border-blue-200',
    cardBg: 'bg-blue-50/50',
  },
  'electromagnetic-oscillations': {
    gradient: 'from-emerald-500 to-teal-500',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    accentBorder: 'border-emerald-200',
    cardBg: 'bg-emerald-50/50',
  },
  'alternating-current': {
    gradient: 'from-amber-500 to-orange-500',
    accentText: 'text-amber-600',
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    cardBg: 'bg-amber-50/50',
  },
};

function findTopic(topicId: string) {
  for (const section of sections) {
    const topic = section.topics.find((t) => t.id === topicId);
    if (topic) return { section, topic };
  }
  return null;
}

export const LessonDetail: React.FC<LessonDetailProps> = ({ topicId, onBack }) => {
  const result = findTopic(topicId);
  const [expandedProblems, setExpandedProblems] = useState<Record<number, boolean>>({ 0: true });

  if (!result) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Урок не найден</p>
      </div>
    );
  }

  const { section, topic } = result;
  const config = sectionConfig[section.id];

  const toggleProblem = (idx: number) => {
    setExpandedProblems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className={`bg-gradient-to-br ${config.gradient} px-10 py-8`}>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Назад к урокам</span>
        </button>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
            {section.title}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white leading-tight mb-4 max-w-3xl">
          {topic.title}
        </h1>
        <div className="space-y-2">
          {topic.objectives.map((obj) => (
            <div key={obj.code} className="flex items-start gap-2">
              <Target className="w-4 h-4 text-white/80 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-white/90">
                <span className="font-mono font-semibold">{obj.code}</span> — {obj.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-8 max-w-4xl">
        {/* Theory section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Теория</h2>
          </div>

          <div className="space-y-6">
            {topic.lessonContent.theory.map((block, idx) => (
              <div key={idx} className={`p-6 rounded-xl border ${config.accentBorder} ${config.cardBg} animate-fade-in`}>
                <h3 className={`text-lg font-semibold ${config.accentText} mb-3`}>
                  {block.heading}
                </h3>
                <div className="prose-physics">
                  {block.paragraphs.map((para, pi) => (
                    <p key={pi} className="text-sm text-slate-700 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Formulas */}
                {block.formulas && block.formulas.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {block.formulas.map((formula, fi) => (
                      <div key={fi} className="math-block text-sm text-slate-800">
                        {formula}
                      </div>
                    ))}
                  </div>
                )}

                {/* SVG Graph */}
                {block.svgKey && (
                  <div className="mt-5 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className={`w-4 h-4 ${config.accentText}`} />
                      <span className="text-xs font-medium text-slate-500">График / схема</span>
                    </div>
                    <div className="flex justify-center">
                      <GraphRenderer svgKey={block.svgKey} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Problems section */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Задачи с подробным решением</h2>
          </div>

          <div className="space-y-4">
            {topic.lessonContent.problems.map((problem, idx) => {
              const isExpanded = expandedProblems[idx] ?? false;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  {/* Problem header */}
                  <button
                    onClick={() => toggleProblem(idx)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className={`w-7 h-7 rounded-lg ${config.accentBg} flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-sm font-bold ${config.accentText}`}>{idx + 1}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">{problem.title}</h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className={`w-4 h-4 ${config.accentText}`} />
                    ) : (
                      <ChevronDown className={`w-4 h-4 ${config.accentText}`} />
                    )}
                  </button>

                  {/* Problem content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 animate-fade-in">
                      {/* Statement */}
                      <div className="mb-4">
                        <p className="text-sm text-slate-700 leading-relaxed mb-2">
                          <span className="font-semibold text-slate-800">Условие: </span>
                          {problem.statement}
                        </p>
                      </div>

                      {/* Given */}
                      {problem.given && problem.given.length > 0 && (
                        <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 mb-1.5">Дано:</p>
                          <div className="space-y-0.5">
                            {problem.given.map((g, gi) => (
                              <p key={gi} className="font-mono text-sm text-slate-700">{g}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Solution */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-500 mb-2">Решение:</p>
                        <div className="space-y-3">
                          {problem.solution.map((step, si) => (
                            <div key={si} className="flex gap-3">
                              {step.label && (
                                <span className={`text-xs font-bold ${config.accentText} mt-0.5 flex-shrink-0 w-14`}>
                                  {step.label}
                                </span>
                              )}
                              <div className="flex-1">
                                <p className="text-sm text-slate-700 leading-relaxed mb-1">
                                  {step.text}
                                </p>
                                {step.formula && (
                                  <div className="math-block text-sm text-slate-800 mt-1">
                                    {step.formula}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Answer */}
                      <div className={`flex items-start gap-2 p-3 rounded-lg ${config.accentBg} border ${config.accentBorder}`}>
                        <CheckCircle2 className={`w-4 h-4 ${config.accentText} mt-0.5 flex-shrink-0`} />
                        <div>
                          <span className={`text-xs font-semibold ${config.accentText}`}>Ответ: </span>
                          <span className="text-sm text-slate-700">{problem.answer}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
