import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Add headers that match backend corsOptions
  config.headers['x-access-token'] = token;
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
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
    } else if (error.request) {
      console.error('Network error: No response received');
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

const endpoints = {
  accounts: {
    getAll: () => api.get('/admin/account-pegawai-cabang'),
    create: (data) => api.post('/admin/create-account-pegawai-cabang', data),
  },
  edit : {
    updatePassword: (id, password) => api.patch(`/admin/edit-password-pegawai-cabang/${id}`, { password }),
    approve: (id, action, payload = {}) => api.patch(`/intern/${id}/${action}`, payload),
    updateUnitKerja: (id, payload) => api.patch(`/admin/unit-kerja/${id}`, payload),
    updateEndDate: (id, tanggalSelesai) => api.patch(`/admin/intern/ongoing/${id}`, { tanggalSelesai }),
  },
  schedule: {
    create: (data) => api.post('/admin/jadwal-pendaftaran', data),
    update: (id, data) => api.patch(`/admin/jadwal-pendaftaran/${id}`, data),
  },
  
  detail: {
    getDetailDone: (id) => api.get(`/admin/intern/done/${id}`),
    getDetailDiproses: (id) => api.get(`/intern/${id}`),
    getDetailDiterima: (id) => api.get(`/intern/diterima/${id}`),
    getDetailTerimaByInstitusi: (type, idInstitusi, idProdi) => 
      type === "Perguruan Tinggi" 
        ? api.get(`/intern/diterima/univ/${idInstitusi}/${idProdi}`)
        : api.get(`/intern/diterima/smk/${idInstitusi}`),
    getDetailDiverifikasiByInstitusi: (type, idInstitusi, idProdi, idUnitKerja) =>
      type === "Perguruan Tinggi"
        ? api.get(`/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`)
        : api.get(`/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`),
  },
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
  },
  cabang: {
    unitKerja: () => api.get('/admin/unit-kerja'),
  },
  page: {
    getDiproses: () => api.get('/intern'),
    getDiverifikasi: () => api.get('/admin/diverifikasi'),
    getDiterima: () => api.get('/intern/diterima'),      
    getDone: () => api.get('/admin/intern/done'),
    getOngoing: () => api.get('/admin/intern/start'),
    getSchedules: () => api.get('/jadwal-pendaftaran'),   
    getRekap: () => api.get('/admin/absensi/rekap'),
    getDashboard: () => api.get('/admin/dashboard')
  },
  upload: {
    suratPengantar: (formData) => api.post('/intern/send-surat-pengantar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),
    suratBalasan: (formData) => api.post('/intern/send-surat-balasan', formData, {
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
        ? api.post(`/intern/diterima/univ/${idInstitusi}/${idProdi}`, requestBody, config)
        : api.post(`/intern/diterima/smk/${idInstitusi}`, requestBody, config);
    },
    suratPengantar: (type, idInstitusi, idProdi, idUnitKerja, requestBody) => {
      const config = {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return type === "Perguruan Tinggi"
        ? api.post(`/intern/diverifikasi/univ/${idInstitusi}/${idProdi}/${idUnitKerja}`, requestBody, config)
        : api.post(`/intern/diverifikasi/smk/${idInstitusi}/${idUnitKerja}`, requestBody, config);
    },
    lampiranRekomen: (selectedTypes) => {
      const config = {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      return Promise.all(selectedTypes.map(type => 
        api.post(type === "mahasiswa" ? '/generate-lampiran-rekomen-mhs' : '/generate-lampiran-rekomen-siswa', {}, config)
      ));
    }
  },
};

export default endpoints;