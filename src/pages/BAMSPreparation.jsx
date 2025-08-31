// src/pages/BAMSPreparation.jsx
import { useState, useEffect } from "react";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import ShlokList from "../components/ShlokList";
import ShlokDetail from "../components/ShlokDetail";
import { SHLOKS } from "../data/shloks";

export default function BAMSPreparation() {
  const [learnedShloks, setLearnedShloks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShlok, setSelectedShlok] = useState(null);
  const [view, setView] = useState("list");
  const [uid, setUid] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Get theme from localStorage
  const theme = localStorage.getItem("theme") || "light";

  // 🔹 Watch Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 🔹 Firestore listener
  useEffect(() => {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (docSnap.exists() && docSnap.data().learnedShloks) {
          setLearnedShloks(docSnap.data().learnedShloks);
        } else {
          setLearnedShloks([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [uid]);

  // 🔹 Toggle learned state
  const toggleShlokLearned = async (shlokId) => {
    if (!uid) return;
    try {
      const updated = learnedShloks.includes(shlokId)
        ? learnedShloks.filter((id) => id !== shlokId)
        : [...learnedShloks, shlokId];
      setLearnedShloks(updated);
      await setDoc(doc(db, "users", uid), { learnedShloks: updated }, { merge: true });
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  // 🔹 Progress calculation
  const progress = learnedShloks.length;
  const total = SHLOKS.length;
  const percentage = total > 0 ? Math.round((progress / total) * 100) : 0;

  // 🔹 Theme classes
  const getThemeClasses = () => {
    if (theme === "dark") {
      return "bg-gray-900 text-white";
    } else if (theme === "coder") {
      return "bg-gray-800 text-green-400 font-mono";
    }
    return "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900";
  };

  const getCardClasses = () => {
    if (theme === "dark") {
      return "bg-gray-800 border-gray-700";
    } else if (theme === "coder") {
      return "bg-gray-900 border-green-600";
    }
    return "bg-white border-gray-200";
  };

  // 🔹 Filter shloks based on search and filter
  const filteredShloks = SHLOKS.filter(shlok => {
    const matchesSearch = shlok.text.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         shlok.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shlok.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const isLearned = learnedShloks.includes(shlok.id);
    let matchesFilter = true;
    
    if (filter === "learned") matchesFilter = isLearned;
    if (filter === "unlearned") matchesFilter = !isLearned;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getThemeClasses()}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="mt-4">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${getThemeClasses()}`}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-4 px-4 ${getThemeClasses()}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`rounded-xl shadow-lg p-4 mb-4 sticky top-2 z-10 ${getCardClasses()}`}>
          <div className="flex items-center justify-between">
            {view === "detail" ? (
              <button 
                onClick={() => setView("list")}
                className="flex items-center text-indigo-600 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to List
              </button>
            ) : (
              <h1 className="text-xl font-bold">BAMS Preparation</h1>
            )}
            
            <div className="flex items-center">
              <span className="text-sm mr-2 hidden md:inline">
                {progress}/{total} shloks
              </span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {view === "detail" && selectedShlok ? (
          <ShlokDetail 
            shlok={selectedShlok}
            isLearned={learnedShloks.includes(selectedShlok.id)}
            onToggleLearned={() => toggleShlokLearned(selectedShlok.id)}
            onClose={() => setView("list")}
            theme={theme}
          />
        ) : (
          <div className={`rounded-xl shadow-lg p-4 ${getCardClasses()}`}>
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search shloks..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-2 text-sm rounded-lg ${filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-3 py-2 text-sm rounded-lg ${filter === "learned" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFilter("learned")}
                >
                  Learned
                </button>
                <button
                  className={`px-3 py-2 text-sm rounded-lg ${filter === "unlearned" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                  onClick={() => setFilter("unlearned")}
                >
                  To Learn
                </button>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold mb-2">Your Progress</h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-sm">{percentage}%</span>
              </div>
              <p className="text-sm mt-2">{progress} of {total} shloks learned</p>
            </div>

            {/* Shlok List */}
            <div className="space-y-3">
              {filteredShloks.length > 0 ? (
                filteredShloks.map(shlok => (
                  <div
                    key={shlok.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      learnedShloks.includes(shlok.id) 
                        ? "bg-green-50 border-green-200" 
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedShlok(shlok);
                      setView("detail");
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">Shlok {shlok.id}</h3>
                        <p className="text-gray-700 line-clamp-2">
                          {shlok.text}
                        </p>
                        {learnedShloks.includes(shlok.id) && (
                          <span className="inline-block mt-2 px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                            Learned
                          </span>
                        )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No shloks found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}