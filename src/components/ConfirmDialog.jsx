import React from "react";

export default function ConfirmDialog({
  open,
  title = "Konfirmasi",
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="glass-strong w-full max-w-md rounded-2xl border border-slate-700/70 p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-50 mb-2">
          {title}
        </h2>
        {message && (
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {message}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-600 text-sm font-medium text-slate-100 hover:bg-slate-800/80"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-red-500 text-sm font-semibold text-slate-50 hover:bg-red-400"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
