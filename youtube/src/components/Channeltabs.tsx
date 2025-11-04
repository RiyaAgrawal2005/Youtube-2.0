import React, { useState } from 'react'
import { Button } from './ui/button';
const tabs = [
  { id: "home", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "playlists", label: "Playlists" },
  { id: "community", label: "Community" },
  { id: "about", label: "About" },
];

const Channeltabs = () => {
     const [activeTab, setActiveTab] = useState("videos");

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 px-4 transition-colors duration-300">
      <div className="flex gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-0 py-4 border-b-2 rounded-none transition-colors duration-300
              ${
                activeTab === tab.id
                  ? "border-black dark:border-white text-black dark:text-black dark:bg-orange-200"
                  : "border-transparent text-black dark:text-gray-500 hover:text-black dark:hover:text-black"
              }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );




}

export default Channeltabs