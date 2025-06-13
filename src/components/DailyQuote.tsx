
import React from 'react';

const DailyQuote: React.FC = () => {
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "What you do today can improve all your tomorrows.", author: "Ralph Marston" },
    { text: "Progress, not perfection.", author: "Anonymous" },
    { text: "Small steps daily lead to big goals yearly.", author: "Anonymous" },
    { text: "Today is a gift, that's why it's called the present.", author: "Bill Keane" },
  ];

  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="bg-gradient-to-r from-journal-lavender-light to-journal-peach-light rounded-2xl p-6 mb-8 text-center animate-fade-in">
      <blockquote className="text-lg font-medium text-journal-stone mb-2">
        "{todayQuote.text}"
      </blockquote>
      <cite className="text-journal-stone/70 text-sm">— {todayQuote.author}</cite>
    </div>
  );
};

export default DailyQuote;
