// src/components/ShlokDetail.jsx
export default function ShlokDetail({ shlok, isLearned, onToggleLearned, onClose, theme }) {
  const getThemeClasses = () => {
    if (theme === "dark") {
      return "bg-gray-800 text-white";
    } else if (theme === "coder") {
      return "bg-gray-900 text-green-400 font-mono";
    }
    return "bg-white text-gray-900";
  };

  const getButtonClasses = () => {
    if (theme === "dark") {
      return isLearned ? "bg-green-700 text-white" : "bg-indigo-700 text-white";
    } else if (theme === "coder") {
      return isLearned ? "bg-green-600 text-black" : "bg-green-500 text-black";
    }
    return isLearned ? "bg-green-100 text-green-800" : "bg-indigo-100 text-indigo-800";
  };

  return (
    <div className={`rounded-xl shadow-lg p-4 md:p-6 ${getThemeClasses()}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">Shlok {shlok.id}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sanskrit Text */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Sanskrit Text:</h3>
        <div className={`p-4 rounded-lg text-xl leading-relaxed ${
          theme === "dark" ? "bg-gray-700" : theme === "coder" ? "bg-gray-800" : "bg-indigo-50"
        }`}>
          {shlok.text}
        </div>
      </div>

      {/* Meaning */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Meaning:</h3>
        <div className={`p-4 rounded-lg leading-relaxed ${
          theme === "dark" ? "bg-gray-700" : theme === "coder" ? "bg-gray-800" : "bg-gray-50"
        }`}>
          {shlok.meaning}
        </div>
      </div>

      {/* Mark as Learned Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={onToggleLearned}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-colors ${getButtonClasses()}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isLearned ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            )}
          </svg>
          {isLearned ? "Marked as Learned" : "Mark as Learned"}
        </button>
      </div>
    </div>
  );
}