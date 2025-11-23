// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from "react";
import { ristekApi } from "../api/ristekApi";
import CourseCard from "../components/CourseCard";
import "../styles/courses.css";
import ConfirmDialog from "../components/ConfirmDialog";

export default function CoursesPage() {
  const [matkulList, setMatkulList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: null,
    nama: "",
    deskripsi: "",
    sks: 3,
  });
  const [showForm, setShowForm] = useState(false);

  // untuk dialog konfirmasi hapus
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState(null);

  const fetchMatkul = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await ristekApi.getMatkul({ include: "tugas" });
      setMatkulList(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil mata kuliah");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMatkul();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "sks" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim()) return;

    try {
      setError("");
      if (form.id) {
        await ristekApi.updateMatkul(form.id, {
          nama: form.nama,
          deskripsi: form.deskripsi,
          sks: form.sks,
        });
      } else {
        await ristekApi.createMatkul({
          nama: form.nama,
          deskripsi: form.deskripsi,
          sks: form.sks,
        });
      }

      setForm({ id: null, nama: "", deskripsi: "", sks: 3 });
      setShowForm(false);
      await fetchMatkul();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menyimpan mata kuliah");
    }
  };

  const handleEdit = (course) => {
    setForm({
      id: course.id,
      nama: course.nama,
      deskripsi: course.deskripsi || "",
      sks: course.sks ?? 3,
    });
    setShowForm(true);
  };

  // buka dialog konfirmasi hapus
  const handleAskDeleteCourse = (course) => {
    setPendingDeleteCourse(course);
  };

  // benar-benar menghapus setelah user klik "Hapus"
  const handleConfirmDeleteCourse = async () => {
    if (!pendingDeleteCourse) return;
    try {
      setError("");
      await ristekApi.deleteMatkul(pendingDeleteCourse.id);
      await fetchMatkul();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menghapus mata kuliah");
    } finally {
      setPendingDeleteCourse(null);
    }
  };

  const handleCancel = () => {
    setForm({ id: null, nama: "", deskripsi: "", sks: 3 });
    setShowForm(false);
  };

  const totalTasks = matkulList.reduce(
    (acc, m) => acc + (m._count?.tugas || m.tugas?.length || 0),
    0
  );
  const completedTasks = matkulList.reduce((acc, m) => {
    const tugas = m.tugas || [];
    return acc + tugas.filter((t) => t.status === "SELESAI").length;
  }, 0);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* HEADER */}
        <header className="mb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-sky-400/80">
                Tugas Tracker · Dashboard mata kuliah
              </p>
              <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
                Kelola kuliah & semua deadline-mu
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-400 max-w-xl">
                Tambahkan mata kuliah, lihat jumlah tugas, dan pantau progres
                semester dengan tampilan yang rapi dan fokus.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="glass px-4 py-3 min-w-[120px]">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Mata kuliah
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {matkulList.length}
                </p>
              </div>
              <div className="glass px-4 py-3 min-w-[120px]">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Total tugas
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">
                  {totalTasks}
                </p>
              </div>
              <div className="glass px-4 py-3 min-w-[120px]">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                  Tugas selesai
                </p>
                <p className="mt-2 text-2xl font-semibold text-emerald-400">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* CTA Tambah matkul */}
        {!showForm && (
          <div className="mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-50 shadow-md hover:bg-sky-400 hover:shadow-lg active:scale-[0.98]"
            >
              <span className="text-lg">＋</span>
              <span>Tambah mata kuliah baru</span>
            </button>
          </div>
        )}

        {/* MODAL FORM */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="glass-strong max-w-xl w-full p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-50">
                    {form.id ? "Ubah mata kuliah" : "Tambah mata kuliah"}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Simpan nama kuliah agar semua tugasnya rapi di satu tempat.
                  </p>
                </div>
                <button
                  onClick={handleCancel}
                  className="text-slate-400 hover:text-slate-100 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nama mata kuliah *
                  </label>
                  <input
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Contoh: Struktur Data, Aljabar Linear"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Deskripsi (opsional)
                  </label>
                  <input
                    name="deskripsi"
                    value={form.deskripsi}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Kelas B, dosen, atau catatan lainnya"
                  />
                </div>

                <div className="max-w-[120px]">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    SKS *
                  </label>
                  <input
                    type="number"
                    name="sks"
                    min={1}
                    max={6}
                    value={form.sks}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/80"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-50 hover:bg-sky-400"
                  >
                    {form.id ? "Simpan perubahan" : "Tambah mata kuliah"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* LIST MATKUL */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-semibold text-slate-100">
              Daftar Mata Kuliah
            </h2>
            <span className="text-xs text-slate-500">
              {matkulList.length} mata kuliah
            </span>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-slate-400 text-sm">
              Memuat mata kuliah…
            </div>
          ) : matkulList.length === 0 ? (
            <div className="glass-strong border border-dashed border-slate-600/70 px-6 py-10 text-center text-sm text-slate-400">
              Belum ada mata kuliah. Mulai dengan menambahkan yang pertama.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {matkulList.map((course, index) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEdit={handleEdit}
                  onDelete={handleAskDeleteCourse}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Dialog konfirmasi hapus mata kuliah */}
      <ConfirmDialog
        open={!!pendingDeleteCourse}
        title="Hapus mata kuliah?"
        message={
          pendingDeleteCourse
            ? `Apakah kamu yakin ingin menghapus mata kuliah "${pendingDeleteCourse.nama}" beserta seluruh tugasnya?`
            : ""
        }
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleConfirmDeleteCourse}
        onCancel={() => setPendingDeleteCourse(null)}
      />
    </div>
  );
}
