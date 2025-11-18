import React, { useEffect, useState } from "react";
import { ristekApi } from "../api/ristekApi";
import CourseCard from "../components/CourseCard";

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
    setForm((prev) => ({ ...prev, [name]: value }));
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

      setForm({
        id: null,
        nama: "",
        deskripsi: "",
        sks: 3,
      });
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus mata kuliah ini?")) return;
    try {
      setError("");
      await ristekApi.deleteMatkul(id);
      await fetchMatkul();
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal menghapus mata kuliah");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tugas Tracker</h1>
        <p className="text-gray-600">
          Kelola mata kuliah dan tugasmu dalam satu tempat.
        </p>
      </header>

      <section className="mb-10 bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-3">
          {form.id ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 md:grid-cols-3 md:items-end"
        >
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Nama Mata Kuliah</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Misal: DDP"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Deskripsi</label>
            <input
              name="deskripsi"
              value={form.deskripsi}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Opsional, contoh: Kelas B Pak X"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">SKS</label>
            <input
              type="number"
              name="sks"
              min={1}
              value={form.sks}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="mt-1 px-4 py-2 rounded bg-blue-600 text-white text-sm"
            >
              {form.id ? "Simpan Perubahan" : "Tambah Mata Kuliah"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Daftar Mata Kuliah</h2>
        {isLoading && <p>Memuat data...</p>}
        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
        {matkulList.length === 0 && !isLoading ? (
          <p>Belum ada mata kuliah. Tambahkan melalui form di atas.</p>
        ) : (
          matkulList.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </section>
    </div>
  );
}
