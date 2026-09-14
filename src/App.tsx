import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { LessonGrid } from '@/components/LessonGrid';
import { LessonDetail } from '@/components/LessonDetail';

function App() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
  };

  const handleBack = () => {
    setSelectedTopicId(null);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar
        selectedTopicId={selectedTopicId}
        onSelectTopic={handleSelectTopic}
        onGoHome={handleBack}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {selectedTopicId ? (
          <LessonDetail topicId={selectedTopicId} onBack={handleBack} />
        ) : (
          <LessonGrid onSelectTopic={handleSelectTopic} />
        )}
      </main>
    </div>
  );
}

export default App;
