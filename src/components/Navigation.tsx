
import React from 'react';
import { Calendar, BookOpen, Target, Star } from 'lucide-react';

type View = 'daily' | 'monthly' | 'future' | 'collections';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'daily' as View, label: 'Daily Log', icon: BookOpen },
    { id: 'monthly' as View, label: 'Monthly', icon: Calendar },
    { id: 'future' as View, label: 'Future Log', icon: Target },
    { id: 'collections' as View, label: 'Collections', icon: Star },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
      <div className="flex flex-wrap gap-2 justify-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-journal-sage text-white shadow-md scale-105' 
                  : 'text-journal-stone hover:bg-journal-sage/10 hover:text-journal-sage nav-item'
                }
              `}
            >
              <Icon size={20} />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
