import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ristekApi } from "../api/ristekApi";
import TaskItem from "../components/TaskItem";

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

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // Ambil matkul + tugas2nya sekaligus
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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toIsoDeadline = (dateStr) => {
    if (!dateStr) return null;
    // input type="date" → "YYYY-MM-DD"
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
    if (!window.confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      setError("");
      await ristekApi.deleteTugas(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menghapus tugas");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Tugas {matkul ? matkul.nama : ""}
          </h1>
          {matkul?.deskripsi && (
            <p className="text-sm text-gray-600">{matkul.deskripsi}</p>
          )}
        </div>
        <Link
          to="/"
          className="px-4 py-2 rounded bg-gray-700 text-white text-sm"
        >
          ← Kembali ke Daftar Mata Kuliah
        </Link>
      </header>

      <section className="mb-8 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Tambah Tugas</h2>
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-3 md:items-end"
        >
          <div>
            <label className="block text-sm mb-1">Nama Tugas</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Misal: Laporan Praktikum 1"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Deskripsi</label>
            <input
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Opsional"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="mt-1 px-4 py-2 rounded bg-blue-600 text-white text-sm"
            >
              Tambah Tugas
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Daftar Tugas</h2>
        {isLoading && <p>Memuat tugas...</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {tugasList.length === 0 && !isLoading ? (
          <p>Belum ada tugas untuk mata kuliah ini.</p>
        ) : (
          tugasList.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </section>
    </div>
  );
}
