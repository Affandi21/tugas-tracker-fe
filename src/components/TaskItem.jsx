import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHourglassHalf,
  faSpinner,
  faCheckCircle,
  faCalendar,
  faClock,
  faTriangleExclamation,
  faTrash,
  faCircleDot,
} from "@fortawesome/free-solid-svg-icons";

const STATUS_CONFIG = {
  BELUM_DIKERJAKAN: {
    label: "Pending",
    icon: faHourglassHalf,
    gradient: "from-yellow-500 to-orange-500",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/10",
  },
  SEDANG_DIKERJAKAN: {
    label: "In progress",
    icon: faSpinner,
    gradient: "from-purple-500 to-pink-500",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
  },
  SELESAI: {
    label: "Completed",
    icon: faCheckCircle,
    gradient: "from-green-500 to-emerald-500",
    borderColor: "border-green-500/30",
    bgColor: "bg-green-500/10",
  },
};

export default function TaskItem({ task, onUpdateStatus, onDelete }) {
  const handleStatusChange = (e) => {
    onUpdateStatus(task, e.target.value);
  };

  const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.BELUM_DIKERJAKAN;

  const deadline = task.deadline ? new Date(task.deadline) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = deadline && deadline < today && task.status !== "SELESAI";
  const isDueSoon =
    deadline &&
    !isOverdue &&
    deadline <= new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) &&
    task.status !== "SELESAI";

  const formattedDeadline = deadline
    ? deadline.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "No deadline";

  return (
    <div className="group relative">
      {/* Glow */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${config.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-300`}
      ></div>

      {/* Card */}
      <div
        className={`relative glass-strong rounded-2xl border ${config.borderColor} overflow-hidden hover:border-opacity-60 transition-all`}
      >
        {/* Side bar */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.gradient}`}
        ></div>

        {/* Content */}
        <div className="p-5 pl-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* LEFT */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-3">
                {/* Status Circle */}
                <div className="mt-1">
                  <FontAwesomeIcon
                    icon={faCircleDot}
                    className={`text-sm text-white opacity-80`}
                  />
                </div>

                {/* Task Text */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`text-xl font-bold mb-1 ${
                      task.status === "SELESAI"
                        ? "line-through text-gray-500"
                        : "text-white"
                    }`}
                  >
                    {task.nama}
                  </h4>

                  {task.deskripsi && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {task.deskripsi}
                    </p>
                  )}

                  {/* BADGES */}
                  <div className="flex flex-wrap gap-2">
                    {/* STATUS BADGE */}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${config.bgColor} border ${config.borderColor}`}
                    >
                      <FontAwesomeIcon icon={config.icon} className="text-xs" />
                      <span>{config.label}</span>
                    </span>

                    {/* DEADLINE BADGE */}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border ${
                        isOverdue
                          ? "bg-red-500/10 border-red-500/30 text-red-400"
                          : isDueSoon
                          ? "bg-orange-500/10 border-orange-500/30 text-orange-400"
                          : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          isOverdue
                            ? faTriangleExclamation
                            : isDueSoon
                            ? faClock
                            : faCalendar
                        }
                        className="text-xs"
                      />
                      <span>{formattedDeadline}</span>
                    </span>

                    {/* OVERDUE BADGE */}
                    {isOverdue && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse">
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          className="text-xs"
                        />
                        <span>Overdue</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-2 lg:flex-shrink-0">
              {/* SELECT STATUS */}
              <div className="relative group/dropdown">
                <select
                  value={task.status}
                  onChange={handleStatusChange}
                  className={`appearance-none px-4 py-2.5 pr-10 rounded-xl font-bold text-sm cursor-pointer transition-all glass-strong border-2 ${config.borderColor} hover:border-opacity-60 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-white`}
                  style={{ minWidth: "150px" }}
                >
                  <option value="BELUM_DIKERJAKAN">Pending</option>
                  <option value="SEDANG_DIKERJAKAN">In Progress</option>
                  <option value="SELESAI">Completed</option>
                </select>

                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  ▼
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => onDelete(task.id)}
                className="px-4 py-2.5 rounded-xl glass-strong border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/60 transition-all group/btn"
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
    </div>
  );
}
