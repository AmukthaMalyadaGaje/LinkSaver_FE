import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTheme } from "../contexts/ThemeContext";
import BookmarkCard from "./BookmarkCard";

function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { darkMode } = useTheme();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://linksaverbe-production.up.railway.app/bookmarks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookmarks");
      }

      const data = await response.json();
      setBookmarks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBookmarks((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[40vh] ${
          darkMode ? "text-white" : ""
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-red-600 text-center mt-20 ${
          darkMode ? "text-red-400" : ""
        }`}
      >
        {error}
      </motion.div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
      className="relative z-0"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
          className={`p-2 rounded-lg shadow-md border
            ${
              darkMode
                ? "bg-gradient-to-br from-primary-700/40 to-primary-400/30 border-primary-400/40 shadow-primary-500/20"
                : "bg-primary-50 border-primary-100 shadow-primary-200/30"
            }
          `}
          style={darkMode ? { boxShadow: "0 0 12px 2px #3b82f6aa" } : {}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${
              darkMode ? "text-primary-200 drop-shadow-lg" : "text-primary-600"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7a2 2 0 012-2h2a2 2 0 012 2v10"
            />
          </svg>
        </motion.div>
        <div
          className={`rounded-xl px-4 py-2 ml-1
          ${
            darkMode
              ? "bg-dark-900/70 border border-primary-900/30 shadow-primary-900/10"
              : "bg-white/80 border border-primary-100 shadow-primary-100/10"
          }
          shadow-lg backdrop-blur-md
        `}
        >
          <h2
            className={`text-xl font-bold tracking-tight ${
              darkMode ? "text-primary-100 drop-shadow" : "text-gray-900"
            }`}
          >
            Your Bookmarks
          </h2>
          <p
            className={`text-xs ${
              darkMode ? "text-primary-300/80" : "text-gray-500"
            }`}
          >
            Organize, reorder, and access your saved links
          </p>
        </div>
      </div>

      {/* Animated Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.3, type: "spring" }}
        className="origin-left h-1 w-full mb-8 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 rounded-full shadow-lg opacity-70"
      />

      {/* Glassmorphism Container for Bookmarks Grid */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className={`backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 transition-all duration-300
            ${
              darkMode
                ? "bg-dark-900/70 border border-dark-700/50 shadow-primary-900/10"
                : "bg-white/80 border border-gray-200/50 shadow-gray-200/50"
            }
          `}
        >
          {bookmarks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-16 text-lg ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              No bookmarks yet. Add your first bookmark above!
            </motion.div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={bookmarks.map((b) => b._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence>
                    {bookmarks.map((bookmark, index) => (
                      <BookmarkCard
                        key={bookmark._id}
                        bookmark={bookmark}
                        index={index}
                        showDragHandle={true}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default BookmarkList;
