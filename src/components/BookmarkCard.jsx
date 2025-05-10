import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '../contexts/ThemeContext';

function BookmarkCard({ bookmark, index, showDragHandle }) {
  const { darkMode } = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
    dragging: {
      scale: 1.04,
      boxShadow: '0 8px 32px 0 rgba(80, 120, 255, 0.25)',
      borderColor: '#6366f1',
      filter: 'brightness(1.1) saturate(1.2)',
      rotate: [0, 2, -2, 2, 0],
      transition: {
        repeat: Infinity,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      variants={cardVariants}
      initial="hidden"
      animate={isDragging ? "dragging" : "visible"}
      exit="exit"
      className={`relative group ${
        darkMode
          ? 'bg-gradient-to-br from-dark-800/90 to-dark-900/95 border-dark-700/80'
          : 'bg-white/90 border-gray-100/80'
      } rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 ${
        isDragging ? 'shadow-glow-lg z-50' : ''
      }`}
      {...attributes}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {showDragHandle && (
            <motion.div
              {...listeners}
              className={`p-2 rounded-lg cursor-grab active:cursor-grabbing ${
                darkMode
                  ? 'bg-dark-700/50 hover:bg-dark-600/50'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8h16M4 16h16"
                />
              </svg>
            </motion.div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`}
                alt=""
                className="w-5 h-5"
              />
              <h3 className={`text-lg font-semibold truncate ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {bookmark.title}
              </h3>
            </div>
            <p className={`text-sm mb-4 line-clamp-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {bookmark.summary}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {bookmark.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    darkMode
                      ? 'bg-primary-900/30 text-primary-200'
                      : 'bg-primary-50 text-primary-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className={`text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Added {new Date(bookmark.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
      <motion.div
        className={`absolute inset-0 rounded-2xl border-2 pointer-events-none ${
          darkMode
            ? 'border-primary-500/20'
            : 'border-primary-200/50'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default BookmarkCard;