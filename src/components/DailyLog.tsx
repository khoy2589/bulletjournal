
import React, { useState } from 'react';
import { Plus, Check, Circle } from 'lucide-react';

interface Entry {
  id: string;
  type: 'task' | 'event' | 'note';
  text: string;
  completed?: boolean;
  priority?: boolean;
  inspiration?: boolean;
}

const DailyLog: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>([
    { id: '1', type: 'task', text: 'Review weekly goals', completed: false, priority: true },
    { id: '2', type: 'event', text: 'Team meeting at 2 PM' },
    { id: '3', type: 'note', text: 'Great book recommendation: "Atomic Habits"', inspiration: true },
    { id: '4', type: 'task', text: 'Grocery shopping', completed: true },
  ]);
  
  const [newEntry, setNewEntry] = useState('');
  const [selectedType, setSelectedType] = useState<'task' | 'event' | 'note'>('task');

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const addEntry = () => {
    if (!newEntry.trim()) return;
    
    const entry: Entry = {
      id: Date.now().toString(),
      type: selectedType,
      text: newEntry,
      completed: false,
    };
    
    setEntries([entry, ...entries]);
    setNewEntry('');
  };

  const toggleCompleted = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, completed: !entry.completed } : entry
    ));
  };

  const getEntryIcon = (entry: Entry) => {
    if (entry.type === 'task') {
      return entry.completed ? (
        <div className="w-6 h-6 bg-journal-sage rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      ) : (
        <div className="w-6 h-6 border-2 border-journal-sage rounded-full"></div>
      );
    } else if (entry.type === 'event') {
      return <Circle size={20} className="text-journal-lavender" />;
    } else {
      return <div className="w-6 h-1 bg-journal-stone rounded-full"></div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-journal-stone mb-2">Daily Log</h2>
        <p className="text-journal-stone/70">{dateString}</p>
      </div>

      {/* Quick Entry */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-journal-stone mb-4">Quick Entry</h3>
        
        {/* Type Selector */}
        <div className="flex gap-2 mb-4">
          {[
            { type: 'task' as const, label: 'Task', icon: '•' },
            { type: 'event' as const, label: 'Event', icon: 'O' },
            { type: 'note' as const, label: 'Note', icon: '—' },
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
                ${selectedType === type 
                  ? 'bg-journal-sage text-white shadow-md' 
                  : 'bg-journal-cream-dark text-journal-stone hover:bg-journal-sage/10'
                }
              `}
            >
              <span className="font-mono text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addEntry()}
            placeholder={`Add a new ${selectedType}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-journal-sage/20 focus:border-journal-sage focus:outline-none focus:ring-2 focus:ring-journal-sage/20 bg-white/90"
          />
          <button
            onClick={addEntry}
            className="px-6 py-3 bg-journal-sage text-white rounded-xl hover:bg-journal-sage-dark transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Entries */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <h3 className="text-lg font-semibold text-journal-stone mb-4">Today's Entries</h3>
        
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`
                flex items-center gap-4 p-4 rounded-xl transition-all duration-200 entry-hover
                ${entry.completed ? 'opacity-60' : ''}
              `}
            >
              <button
                onClick={() => entry.type === 'task' && toggleCompleted(entry.id)}
                className={entry.type === 'task' ? 'cursor-pointer' : 'cursor-default'}
              >
                {getEntryIcon(entry)}
              </button>
              
              <div className="flex-1">
                <p className={`
                  text-journal-stone ${entry.completed ? 'line-through' : ''}
                  ${entry.priority ? 'font-semibold' : ''}
                `}>
                  {entry.priority && <span className="text-journal-peach mr-1">★</span>}
                  {entry.inspiration && <span className="text-journal-lavender mr-1">!</span>}
                  {entry.text}
                </p>
              </div>
              
              <div className="text-xs text-journal-stone/50 capitalize">
                {entry.type}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
