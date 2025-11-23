import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookOpen,
  faListCheck,
  faArrowRight,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const GRADIENT_COLORS = [
  "from-emerald-400 to-green-500",
  "from-sky-400 to-blue-600",
  "from-fuchsia-500 to-pink-500",
  "from-indigo-500 to-violet-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-teal-500",
  "from-rose-400 to-amber-300",
  "from-slate-600 to-indigo-700",
];

export default function CourseCard({ course, onEdit, onDelete, index }) {
  const tugasCount =
    course._count?.tugas ??
    (Array.isArray(course.tugas) ? course.tugas.length : 0);

  const completedTasks = Array.isArray(course.tugas)
    ? course.tugas.filter((t) => t.status === "SELESAI").length
    : 0;

  const progress = tugasCount > 0 ? (completedTasks / tugasCount) * 100 : 0;

  const gradientIndex =
    typeof index === "number"
      ? index % GRADIENT_COLORS.length
      : (course.nama?.length || 0) % GRADIENT_COLORS.length;

  const gradient = GRADIENT_COLORS[gradientIndex];

  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-300`}
      ></div>

      {/* Card */}
      <div className="relative glass-strong rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
        {/* Colored top bar */}
        <div className={`h-2 bg-gradient-to-r ${gradient}`}></div>

        {/* Content */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 transition-all">
              {course.nama}
            </h3>
            {course.deskripsi && (
              <p className="text-sm text-gray-400 line-clamp-1">
                {course.deskripsi}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-4">
            <div className="glass px-3 py-1.5 rounded-xl text-sm flex items-center gap-2">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-slate-300 text-xs"
              />
              <span className="font-semibold text-white">{course.sks}</span>
              <span className="text-gray-400 text-xs">sks</span>
            </div>
            <div className="glass px-3 py-1.5 rounded-xl text-sm flex items-center gap-2">
              <FontAwesomeIcon
                icon={faListCheck}
                className="text-slate-300 text-xs"
              />
              <span className="font-semibold text-white">{tugasCount}</span>
              <span className="text-gray-400 text-xs">tasks</span>
            </div>
          </div>

          {/* Progress */}
          {tugasCount > 0 && (
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-400 font-medium">progress</span>
                <span className="font-bold text-white">
                  {completedTasks}/{tugasCount}
                </span>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {progress.toFixed(0)}% complete
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/courses/${course.id}`}
              className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${gradient} rounded-xl font-bold text-sm text-center hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2`}
            >
              <span>Details</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-xs opacity-90"
              />
            </Link>
            <button
              onClick={() => onEdit(course)}
              className="px-3 py-2.5 glass rounded-xl hover:bg-white/20 transition-all group/btn flex items-center justify-center"
              title="Edit"
            >
              <FontAwesomeIcon
                icon={faPen}
                className="text-slate-200 text-sm group-hover/btn:scale-110 transition-transform"
              />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="px-3 py-2.5 glass rounded-xl hover:bg-red-500/20 transition-all group/btn flex items-center justify-center"
              title="Delete"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="text-red-400 text-sm group-hover/btn:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shimmer animation for progress bar
const shimmerStyle = document.createElement("style");
shimmerStyle.textContent = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;
document.head.appendChild(shimmerStyle);
