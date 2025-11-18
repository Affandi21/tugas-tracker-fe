const API_BASE_URL = "https://pekris-webdev.vercel.app/api";
const API_KEY = import.meta.env.VITE_API_KEY;

// Helper umum untuk panggil API dengan Bearer Token
async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `API error ${response.status} ${response.statusText}: ${text}`
    );
  }

  if (response.status === 204) return null;
  return response.json();
}

// Helper untuk query string dari object
function withQuery(path, params = {}) {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
  if (entries.length === 0) return path;
  const qs = new URLSearchParams(entries).toString();
  return `${path}?${qs}`;
}

export const ristekApi = {
  // ---------- MATA KULIAH ----------
  getMatkul({ include } = {}) {
    return apiFetch(withQuery("/matkul", { include }), { method: "GET" });
  },

  getMatkulById(id, { include } = {}) {
    return apiFetch(withQuery(`/matkul/${id}`, { include }), {
      method: "GET",
    });
  },

  createMatkul({ nama, deskripsi, sks }) {
    return apiFetch("/matkul", {
      method: "POST",
      body: JSON.stringify({
        nama,
        deskripsi,
        sks: Number(sks),
      }),
    });
  },

  updateMatkul(id, { nama, deskripsi, sks }) {
    return apiFetch(`/matkul/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nama,
        deskripsi,
        sks: Number(sks),
      }),
    });
  },

  deleteMatkul(id) {
    return apiFetch(`/matkul/${id}`, { method: "DELETE" });
  },

  // ---------- TUGAS ----------
  getTugas(filter = {}) {
    return apiFetch(withQuery("/tugas", filter), { method: "GET" });
  },

  createTugas({ nama, deskripsi, deadline, mataKuliahId, status }) {
    return apiFetch("/tugas", {
      method: "POST",
      body: JSON.stringify({
        nama,
        deskripsi,
        deadline,
        mataKuliahId,
        status,
      }),
    });
  },

  updateTugas(id, payload) {
    return apiFetch(`/tugas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteTugas(id) {
    return apiFetch(`/tugas/${id}`, { method: "DELETE" });
  },
};
