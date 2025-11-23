import React, { useMemo, useState } from "react";

const DEFAULT_ROWS = [
  { id: 1, label: "Tugas / Kuis", weight: 30, score: "" },
  { id: 2, label: "UTS", weight: 30, score: "" },
  { id: 3, label: "UAS", weight: 40, score: "" },
];

function getLetterGrade(score) {
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "D";
  return "E";
}

export default function GradeCalculator({ courseName }) {
  const [rows, setRows] = useState(DEFAULT_ROWS);

  const totalWeight = useMemo(
    () => rows.reduce((acc, r) => acc + (Number(r.weight) || 0), 0),
    [rows]
  );

  const finalScore = useMemo(() => {
    const total = rows.reduce(
      (acc, r) =>
        acc +
        (Number(r.weight) || 0) * (Number(r.score) || 0),
      0
    );
    return totalWeight > 0 ? total / totalWeight : 0;
  }, [rows, totalWeight]);

  const letter = finalScore > 0 ? getLetterGrade(finalScore) : "-";

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: Date.now(), label: "", weight: "", score: "" },
    ]);
  };

  const removeRow = (id) => {
    setRows((prev) =>
      prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)
    );
  };

  const weightMessage =
    totalWeight === 100
      ? "Bobot sudah 100%."
      : `Total bobot saat ini ${totalWeight || 0}%.`;

  const weightColor =
    totalWeight === 100 ? "text-emerald-400" : "text-amber-400";

  return (
    <div className="glass-strong rounded-2xl border border-slate-700/70 p-5 overflow-hidden">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Kalkulator nilai
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulasikan nilai akhir untuk{" "}
            <span className="font-medium text-slate-200">
              {courseName || "mata kuliah ini"}
            </span>
            .
          </p>
        </div>
      </div>

      {/* ROWS */}
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-center gap-2"
          >
            {/* Nama komponen */}
            <input
              type="text"
              value={row.label}
              onChange={(e) =>
                handleChange(row.id, "label", e.target.value)
              }
              className="min-w-[160px] flex-1 rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-xs md:text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Komponen (mis. Tugas, UTS)"
            />

            {/* Weight & score */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={row.weight}
                  onChange={(e) =>
                    handleChange(row.id, "weight", e.target.value)
                  }
                  className="w-16 rounded-lg border border-slate-600 bg-slate-900/60 px-2 py-2 text-xs md:text-sm text-right text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
                <span className="text-[11px] text-slate-400">%</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={row.score}
                  onChange={(e) =>
                    handleChange(row.id, "score", e.target.value)
                  }
                  className="w-20 rounded-lg border border-slate-600 bg-slate-900/60 px-2 py-2 text-xs md:text-sm text-right text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-2 py-2 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              title="Hapus baris"
            >
              ×
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addRow}
          className="text-xs md:text-sm font-medium text-sky-400 hover:text-sky-300"
        >
          + Tambah komponen
        </button>
      </div>

      {/* FOOTER */}
      <div className="mt-5 border-t border-slate-700 pt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-xs text-slate-400">
          <p className={weightColor}>{weightMessage}</p>
          <p className="mt-1">
            Data ini hanya disimpan di halaman ini (tidak terkirim ke server).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              Perkiraan nilai akhir
            </p>
            <p className="text-lg font-semibold text-slate-50">
              {finalScore.toFixed(1)}
            </p>
          </div>
          <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-100 border border-slate-600">
            {letter}
          </span>
        </div>
      </div>
    </div>
  );
}
