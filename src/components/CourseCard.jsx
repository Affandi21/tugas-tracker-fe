// src/components/CourseCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function CourseCard({ course, onEdit, onDelete }) {
  const tugasCount =
    course._count?.tugas ?? (Array.isArray(course.tugas) ? course.tugas.length : 0);

  return (
    <div className="border rounded-lg p-4 flex justify-between items-start mb-3 bg-white shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{course.nama}</h3>
        {course.deskripsi && (
          <p className="text-sm text-gray-700 mt-1">{course.deskripsi}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          SKS: {course.sks} • Jumlah tugas: {tugasCount}
        </p>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/courses/${course.id}`}
          className="px-3 py-1 text-sm rounded bg-blue-600 text-white"
        >
          Lihat Tugas
        </Link>
        <button
          onClick={() => onEdit(course)}
          className="px-3 py-1 text-sm rounded bg-yellow-500 text-white"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(course.id)}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
