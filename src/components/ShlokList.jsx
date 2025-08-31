// src/components/ShlokList.jsx
export default function ShlokList({ shloks, learnedShloks, onToggleLearned, onSelectShlok, theme }) {
  const themeClasses = {
    light: {
      card: "bg-white border border-gray-200",
      title: "text-gray-900",
      text: "text-gray-700",
      button: "bg-indigo-600 text-white hover:bg-indigo-700",
      learnedButton: "bg-green-100 text-green-800"
    },
    dark: {
      card: "bg-gray-800 border border-gray-700",
      title: "text-gray-100",
      text: "text-gray-300",
      button: "bg-indigo-700 text-white hover:bg-indigo-600",
      learnedButton: "bg-green-900 text-green-200"
    },
    coder: {
      card: "bg-gray-900 border border-green-600",
      title: "text-green-400",
      text: "text-green-300",
      button: "bg-green-600 text-black hover:bg-green-500",
      learnedButton: "bg-green-800 text-black"
    }
  };

  const currentTheme = themeClasses[theme] || themeClasses.light;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {shloks.map((shlok) => (
        <div
          key={shlok.id}
          className={`rounded-lg p-4 shadow-md transition-all duration-300 ${currentTheme.card} ${
            learnedShloks.includes(shlok.id) ? "opacity-80" : ""
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-semibold text-sm sm:text-base ${currentTheme.title}`}>
              {shlok.name}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLearned(shlok.id);
              }}
              className={`px-2 py-1 rounded text-xs ${
                learnedShloks.includes(shlok.id)
                  ? currentTheme.learnedButton
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {learnedShloks.includes(shlok.id) ? "Learned" : "Mark Learned"}
            </button>
          </div>
          
          <p className={`text-sm mb-3 ${currentTheme.text}`}>
            {shlok.shlok.length > 100 ? `${shlok.shlok.substring(0, 100)}...` : shlok.shlok}
          </p>
          
          <button
            onClick={() => onSelectShlok(shlok)}
            className={`w-full py-2 rounded-lg text-sm font-medium ${currentTheme.button}`}
          >
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}