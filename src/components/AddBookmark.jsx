import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

function AddBookmark() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { darkMode } = useTheme();

  // const getSummaryFromJina = async (url) => {
  //   try {
  //     const target = encodeURIComponent(url);
  //     const response = await fetch(`https://r.jina.ai/http://${target}`);
  //     console.log("Response:", response);
  //     if (!response.ok) {
  //       throw new Error('Failed to get summary from Jina AI');
  //     }
  //     const summary = await response.text();
  //     return summary;
  //   } catch (err) {
  //     console.error('Jina AI error:', err);
  //     return null;
  //   }
  // };
  // const getSummaryFromJina = async (url) => {
  //   try {
  //     console.log(`https://r.jina.ai/${url}`)
  //     const response = await fetch(`https://r.jina.ai/${url}`);

  //     console.log("Response:", response);
  //     if (!response.ok) {
  //       throw new Error('Failed to get summary from Jina AI');
  //     }
  //     const summary = await response.text();
  //     return summary;
  //   } catch (err) {
  //     console.error('Jina AI error:', err);
  //     return null;
  //   }
  // };

  async function getSummaryFromJina(url) {
    try {
      const response = await fetch(`https://r.jina.ai/${url}`, {
        headers: {
          Accept: "text/markdown",
        },
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error(`Failed to fetch content: ${response.status}`);
      }
      const summary = await response.text();
      return summary;
    } catch (err) {
      console.error("Jina AI error:", err);
      return null;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      // First get the summary from Jina AI
      const summary = await getSummaryFromJina(url);

      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://linksaverbe-production.up.railway.app/bookmarks",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: url,
            summary: summary || "No summary available",
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to add bookmark");
      }

      setUrl("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 mt-2 p-8 rounded-2xl shadow-2xl border-2
        ${
          darkMode
            ? "bg-gradient-to-br from-dark-800/90 to-dark-900/95 border-dark-700/80"
            : "bg-white/90 border-gray-100/80"
        }
        relative z-10
      `}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`p-2 rounded-lg ${
                darkMode ? "bg-primary-500/20" : "bg-primary-50"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  darkMode ? "text-primary-400" : "text-primary-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </motion.div>
            <h2
              className={`text-xl font-semibold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Add New Bookmark
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <motion.input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to bookmark"
              className={`flex-grow px-4 py-3 rounded-xl border text-base transition-all duration-200 ${
                darkMode
                  ? "bg-dark-800 border-dark-700 text-white placeholder-gray-500 focus:border-primary-500"
                  : "bg-gray-50 border-gray-200 focus:border-primary-500"
              } focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
              required
              whileFocus={{ scale: 1.01 }}
            />
            <motion.button
              type="submit"
              className={`px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 ${
                darkMode
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                  : "bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
              } shadow-lg shadow-primary-500/20`}
              disabled={loading}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
                />
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Save Bookmark
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
              darkMode ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-500"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
              darkMode
                ? "bg-green-500/10 text-green-400"
                : "bg-green-50 text-green-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Bookmark added successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default AddBookmark;
