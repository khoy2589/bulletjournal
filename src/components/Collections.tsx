import React from "react";
import { Star, Plus, BookOpen } from "lucide-react";

const Collections: React.FC = () => {
  const myCollections = [
    {
      id: 1,
      title: "Books to Read",
      description: "My reading wishlist for this year",
      color: "journal-lavender",
      itemCount: 12,
      recentItems: ["Atomic Habits", "The Psychology of Money", "Mindset"],
    },
    {
      id: 2,
      title: "Travel Dreams",
      description: "Places I want to visit someday",
      color: "journal-peach",
      itemCount: 8,
      recentItems: ["Japan", "Iceland", "New Zealand"],
    },
    {
      id: 3,
      title: "Gratitude Log",
      description: "Daily moments of appreciation",
      color: "journal-sage",
      itemCount: 25,
      recentItems: ["Morning coffee", "Sunny weather", "Friend's call"],
    },
    {
      id: 4,
      title: "Project Ideas",
      description: "Creative projects for the future",
      color: "journal-stone",
      itemCount: 6,
      recentItems: ["Garden redesign", "Photo album", "Recipe blog"],
    },
    {
      id: 5,
      title: "Workout Tracker",
      description: "Exercise routines and progress",
      color: "journal-peach",
      itemCount: 18,
      recentItems: ["Morning run", "Yoga session", "Strength training"],
    },
    {
      id: 6,
      title: "Recipe Collection",
      description: "Favorite dishes and new experiments",
      color: "journal-lavender",
      itemCount: 15,
      recentItems: ["Pasta carbonara", "Thai curry", "Sourdough bread"],
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      "journal-lavender":
        "bg-journal-lavender-light border-journal-lavender text-journal-lavender",
      "journal-peach":
        "bg-journal-peach-light border-journal-peach text-journal-peach",
      "journal-sage":
        "bg-journal-sage-light border-journal-sage text-journal-sage",
      "journal-stone":
        "bg-journal-stone-light border-journal-stone text-journal-stone",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap["journal-sage"];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-journal-stone flex items-center gap-3">
              <Star size={28} className="text-journal-sage" />
              Collections
            </h2>
            <p className="text-journal-stone/70 mt-2">
              Organize your interests and track meaningful topics
            </p>
          </div>

          <button className="px-6 py-3 bg-journal-sage text-white rounded-xl hover:bg-journal-sage-dark transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg">
            <Plus size={20} />
            New Collection
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCollections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          >
            {/* Collection Header */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-xl ${
                  getColorClasses(collection.color).split(" ")[0]
                }/20`}
              >
                <BookOpen
                  size={24}
                  className={getColorClasses(collection.color).split(" ")[2]}
                />
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(
                  collection.color,
                )}/20 ${getColorClasses(collection.color).split(" ")[2]}`}
              >
                {collection.itemCount} items
              </div>
            </div>

            {/* Collection Title & Description */}
            <h3 className="text-lg font-semibold text-journal-stone mb-2">
              {collection.title}
            </h3>
            <p className="text-journal-stone/70 text-sm mb-4">
              {collection.description}
            </p>

            {/* Recent Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-journal-stone/50 uppercase tracking-wide">
                Recent
              </h4>
              {collection.recentItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-journal-stone"
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${getColorClasses(
                      collection.color,
                    )
                      .split(" ")[2]
                      .replace("text-", "bg-")}`}
                  ></div>
                  {item}
                </div>
              ))}
            </div>

            {/* View More */}
            <div className="mt-4 pt-4 border-t border-journal-stone/10">
              <button className="text-sm text-journal-sage hover:text-journal-sage-dark font-medium transition-colors duration-200">
                View all items →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add Collection */}
      <div className="bg-gradient-to-r from-journal-lavender-light/20 to-journal-peach-light/20 rounded-2xl p-8 text-center border-2 border-dashed border-journal-sage/30 hover:border-journal-sage transition-all duration-200">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-journal-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-journal-sage" />
          </div>
          <h3 className="text-lg font-semibold text-journal-stone mb-2">
            Create New Collection
          </h3>
          <p className="text-journal-stone/70 mb-4">
            Start organizing a new topic or interest
          </p>
          <button className="px-6 py-3 bg-white/80 text-journal-stone rounded-xl hover:bg-white transition-colors duration-200 shadow-md">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Collections;
