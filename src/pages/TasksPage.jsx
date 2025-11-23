import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ristekApi } from "../api/ristekApi";
import TaskItem from "../components/TaskItem";
import GradeCalculator from "../components/GradeCalculator";
import "../styles/tasks.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

export default function TasksPage() {
  const { courseId } = useParams();
  const [matkul, setMatkul] = useState(null);
  const [tugasList, setTugasList] = useState([]);
  const [form, setForm] = useState({
    nama: "",
    deskripsi: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");
      const matkulData = await ristekApi.getMatkulById(courseId, {
        include: "tugas",
      });
      setMatkul(matkulData);
      setTugasList(matkulData.tugas || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil tugas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toIsoDeadline = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr + "T00:00:00").toISOString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return;

    try {
      setError("");
      await ristekApi.createTugas({
        nama: form.nama,
        deskripsi: form.deskripsi,
        deadline: toIsoDeadline(form.deadline),
        mataKuliahId: courseId,
        status: "BELUM_DIKERJAKAN",
      });

      setForm({ nama: "", deskripsi: "", deadline: "" });
      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menambahkan tugas");
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      setError("");
      await ristekApi.updateTugas(task.id, {
        nama: task.nama,
        deskripsi: task.deskripsi,
        deadline: task.deadline,
        mataKuliahId: task.mataKuliahId,
        status: newStatus,
      });
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengubah status tugas");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Hapus tugas ini?")) return;
    try {
      setError("");
      await ristekApi.deleteTugas(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menghapus tugas");
    }
  };

  const filteredTasks =
    filterStatus === "ALL"
      ? tugasList
      : tugasList.filter((t) => t.status === filterStatus);

  const taskStats = {
    total: tugasList.length,
    belum: tugasList.filter((t) => t.status === "BELUM_DIKERJAKAN").length,
    sedang: tugasList.filter((t) => t.status === "SEDANG_DIKERJAKAN").length,
    selesai: tugasList.filter((t) => t.status === "SELESAI").length,
  };

  const FILTER_OPTIONS = [
    { key: "ALL", label: "Semua" },
    { key: "BELUM_DIKERJAKAN", label: "Belum dikerjakan" },
    { key: "SEDANG_DIKERJAKAN", label: "Sedang dikerjakan" },
    { key: "SELESAI", label: "Selesai" },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 mb-6"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
          <span>Kembali ke daftar mata kuliah</span>
        </Link>

        {/* HEADER */}
        <header className="mb-8">
          <div className="glass-strong rounded-2xl border border-slate-700/70 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.26em] uppercase text-sky-400/80">
                  Detail tugas
                </p>
                <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-slate-50">
                  {matkul ? matkul.nama : "Memuat…"}
                </h1>
                {matkul?.deskripsi && (
                  <p className="mt-1 text-sm text-slate-400">
                    {matkul.deskripsi}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400 text-[11px] uppercase tracking-wide">
                  Total tugas
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-50">
                  {taskStats.total}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400 text-[11px] uppercase tracking-wide">
                  Belum dikerjakan
                </p>
                <p className="mt-1 text-xl font-semibold text-amber-400">
                  {taskStats.belum}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400 text-[11px] uppercase tracking-wide">
                  Sedang dikerjakan
                </p>
                <p className="mt-1 text-xl font-semibold text-violet-400">
                  {taskStats.sedang}
                </p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
                <p className="text-slate-400 text-[11px] uppercase tracking-wide">
                  Selesai
                </p>
                <p className="mt-1 text-xl font-semibold text-emerald-400">
                  {taskStats.selesai}
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Filter + Form + Kalkulator Nilai */}
        <section className="mb-8 grid gap-6 lg:grid-cols-3 items-start">
          {/* Filter */}
          <div className="glass-strong rounded-2xl border border-slate-700/70 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-100">
              Filter tugas
            </h2>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium ${
                    filterStatus === key
                      ? "bg-sky-500 text-white"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form tambah tugas */}
          <div className="glass-strong rounded-2xl border border-slate-700/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-100">
                Tambah tugas
              </h2>
              <button
                onClick={() => setShowForm((v) => !v)}
                className="text-xs text-slate-400 hover:text-slate-100 flex items-center justify-center w-7 h-7 rounded-full border border-slate-600/60 hover:border-slate-300/80"
              >
                <FontAwesomeIcon
                  icon={showForm ? faMinus : faPlus}
                  className="text-[11px]"
                />
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nama tugas *
                  </label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Contoh: Tugas 1 SQL, kuis, UTS, dsb."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Catatan singkat, platform pengumpulan, dsb."
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-slate-50 hover:bg-sky-400"
                  >
                    Simpan tugas
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Kalkulator Nilai */}
          <GradeCalculator courseName={matkul?.nama} />
        </section>

        {/* LIST TUGAS */}
        <section>
          <h2 className="text-base md:text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <span>Daftar tugas</span>
            <span className="text-xs text-slate-500">
              ({filteredTasks.length})
            </span>
          </h2>

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Memuat tugas…
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="glass-strong rounded-2xl border border-dashed border-slate-600/70 px-6 py-10 text-center text-sm text-slate-400">
              Belum ada tugas di kategori ini. Tambahkan tugas baru atau ubah
              filter di atas.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
