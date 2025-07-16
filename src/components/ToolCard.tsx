import React from 'react';
import { Tool } from '@/data';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <div className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm flex flex-col gap-2">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{tool.logo}</span>
        <div>
          <h3 className="font-bold text-lg">{tool.name}</h3>
          <span className="text-xs text-gray-500">{tool.category}</span>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-3">{tool.description}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {tool.pricing}
        </span>
        <a href={tool.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-medium">Visit</a>
      </div>
    </div>
  );
};

export default ToolCard; 