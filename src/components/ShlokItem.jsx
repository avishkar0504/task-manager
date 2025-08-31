// src/components/ShlokItem.jsx
import { useState } from "react";

export default function ShlokItem({ shlok, isLearned, onToggle, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg p-4 ${isLearned ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">Shlok {shlok.id}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${isLearned ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-800"}`}>
              {isLearned ? "Learned" : "To Learn"}
            </span>
          </div>
          
          <div 
            className="text-gray-700 mb-2 cursor-pointer" 
            onClick={() => onSelect(shlok)}
          >
            {shlok.text.length > 100 ? `${shlok.text.substring(0, 100)}...` : shlok.text}
          </div>
          
          {expanded && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-1">Meaning:</h4>
              <p className="text-gray-600">{shlok.meaning}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-3">
            <button
              className="text-indigo-600 text-sm"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show less" : "Show meaning"}
            </button>
            
            <button
              onClick={() => onSelect(shlok)}
              className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200"
            >
              View Details
            </button>
          </div>
        </div>
        
        <div className="ml-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="hidden"
              checked={isLearned}
              onChange={onToggle}
            />
            <div className={`w-10 h-6 rounded-full transition-colors ${isLearned ? "bg-green-500" : "bg-gray-300"}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform transform mt-1 ml-1 ${isLearned ? "translate-x-4" : ""}`}></div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}