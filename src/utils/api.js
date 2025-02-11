import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-access-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error:', error.message);
    } else if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden: You do not have permission');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error(`Error ${error.response.status}: ${error.response.data?.message || 'Unknown error'}`);
      }
    }
    return Promise.reject(error);
  }
);

const endpoints = {
  accounts: {
    getAll: () => api.get('/superadmin/account-pegawai-cabang'),
    create: (data) => api.post('/superadmin/create-account-pegawai-cabang', data),
  },
  edit: {
    updatePassword: (id, password) => api.patch(`/superadmin/edit-password-pegawai-cabang/${id}`, { password }),
    approve: (id, action, payload = {}) => api.patch(`/superadmin/intern/${id}/${action}`, payload),
    updateUnitKerja: (id, payload) => api.patch(`/superadmin/unit-kerja/${id}`, payload),
    updateEndDate: (id, tanggalSelesai) => api.patch(`/superadmin/intern/ongoing/${id}`, { tanggalSelesai }),
  },
  schedule: {
    create: (data) => api.post('/superadmin/jadwal-pendaftaran', data),
    update: (id, data) => api.patch(`/superadmin/jadwal-pendaftaran/${id}`, data),
  },
  detail: {
    getDetailDone: (id) => api.get(`/superadmin/intern/done/${id}`),
    getDetailDiproses: (id) => api.get(`/superadmin/intern/${id}`),
    getDetailDiterima: (id) => api.get(`/superadmin/intern/diterima/${id}`),
    getDetailTerimaByInstitusi: (type, idInstitusi, idProdi) => 
      type === "Perguruan Tinggi" 
        ? api.get(`/superadmin/intern/diterima/univ/${idInstitusi}/${idProdi}`)
        : api.get(`/superadmin/intern/diterima/smk/${idInstitusi}`),
    getDetailDiverifikasiByInstitusi: (type, idInstitusi, idProdi, idUnitKerja) =>
      type === "Perguruan Tinggi"
        ? api.get(`/superadmin/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`)
        : api.get(`/superadmin/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`),
  },
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
  },
  cabang: {
    unitKerja: () => api.get('/superadmin/unit-kerja'),
  },
  page: {
    getDiproses: () => api.get('/superadmin/intern'),
    getDiverifikasi: () => api.get('/superadmin/interns/diverifikasi'),
    getDiterima: () => api.get('/superadmin/interns/diterima'),      
    getDone: () => api.get('/superadmin/interns/done'),
    getOngoing: () => api.get('/superadmin/interns/start'),
    getSchedules: () => api.get('/superadmin/jadwal-pendaftaran'),   
    getRekap: () => api.get('/superadmin/absensi/rekap'),
    getDashboard: () => api.get('/superadmin/dashboard')
  },
  upload: {
    suratPengantar: (formData) => api.post('/superadmin/intern/send-surat-pengantar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    suratBalasan: (formData) => api.post('/superadmin/intern/send-surat-balasan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  generateDocument: {
    suratBalasan: (type, idInstitusi, idProdi, requestBody) => {
      const config = {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return type === "Perguruan Tinggi"
        ? api.post(`/superadmin/intern/diterima/univ/${idInstitusi}/${idProdi}`, requestBody, config)
        : api.post(`/superadmin/intern/diterima/smk/${idInstitusi}`, requestBody, config);
    },
    suratPengantar: (type, idInstitusi, idProdi, idUnitKerja, requestBody) => {
      const config = {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return type === "Perguruan Tinggi"
        ? api.post(`/superadmin/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`, requestBody, config)
        : api.post(`/superadmin/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`, requestBody, config);
    },
    lampiranRekomen: (selectedTypes) => {
      const config = {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return Promise.all(selectedTypes.map(type => 
        api.post(type === "mahasiswa" ? '/superadmin/generate-lampiran-rekomen-mhs' : '/superadmin/generate-lampiran-rekomen-siswa', {}, config)
      ));
    }
  },
};

export default endpoints;