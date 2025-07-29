import React from "react";

const DailyQuote: React.FC = () => {
  const quotes = [
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
    },
    {
      text: "What you do today can improve all your tomorrows.",
      author: "Ralph Marston",
    },
    { text: "Progress, not perfection.", author: "Anonymous" },
    {
      text: "Small steps daily lead to big goals yearly.",
      author: "Anonymous",
    },
    {
      text: "Today is a gift, that's why it's called the present.",
      author: "Bill Keane",
    },
    {
      text: "Consistency Always wins.",
      author: "Anonymous",
    },
    {
      text: "You get what you fight for, not what you wish for.",
      author: "GROWTH",
    },
    {
      text: "Comfort kills more dreams than failure ever will.",
      author: "GROWTH",
    },
    {
      text: "If it doesn't push you, it doesn't grow you.",
      author: "GROWTH",
    },
    {
      text: "It's not luck, it's relentless quiet work.",
      author: "GROWTH",
    },
    {
      text: "You've come too far to only come this far.",
      author: "GROWTH",
    },
  ];

  const todayQuote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="bg-gradient-to-r from-journal-lavender-light to-journal-peach-light rounded-2xl p-6 mb-8 text-center animate-fade-in shadow-lg selection:bg-journal-lavender-light selection:text-journal-stone leading-relaxed">
      <blockquote className="text-xl font-medium text-journal-stone mb-4  italic">
        "{todayQuote.text}"
      </blockquote>
      <cite className="text-journal-stone/70 text-sm font-light tracking-wide ">
        — {todayQuote.author}
      </cite>
    </div>
  );
};

export default DailyQuote;
