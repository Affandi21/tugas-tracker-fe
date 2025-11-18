import React from "react";

const STATUS_LABELS = {
  BELUM_DIKERJAKAN: "Belum dikerjakan",
  SEDANG_DIKERJAKAN: "Sedang dikerjakan",
  SELESAI: "Selesai",
};

export default function TaskItem({ task, onUpdateStatus, onDelete }) {
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onUpdateStatus(task, newStatus);
  };

  const formattedDeadline = task.deadline
    ? new Date(task.deadline).toLocaleDateString()
    : "-";

  return (
    <div className="border rounded-lg p-3 flex justify-between items-center mb-2 bg-white shadow-sm">
      <div>
        <h4 className="font-medium">{task.nama}</h4>
        {task.deskripsi && (
          <p className="text-sm text-gray-700 mt-1">{task.deskripsi}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Deadline: {formattedDeadline}
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <select
          value={task.status}
          onChange={handleStatusChange}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="BELUM_DIKERJAKAN">
            {STATUS_LABELS.BELUM_DIKERJAKAN}
          </option>
          <option value="SEDANG_DIKERJAKAN">
            {STATUS_LABELS.SEDANG_DIKERJAKAN}
          </option>
          <option value="SELESAI">{STATUS_LABELS.SELESAI}</option>
        </select>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
