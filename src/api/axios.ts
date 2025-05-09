import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use((req) => {
  // Comentado temporalmente hasta implementar autenticación
  /*
  const store = userStore();
  const { token, tenantId } = store;
  if (!token) {
    console.warn('No token available for API request');
  }
  req.headers.Authorization = `Bearer ${token}`;
  req.headers['X-tenantName'] = `${tenantId}`;
  */
  return req;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle token-related errors (401 Unauthorized)
    /*
    if (error.response && error.response.status === 401) {
      const store = userStore();

      // Show toast notification about session expiration
      toast.error('Su sesión ha expirado o es inválida. Por favor, inicie sesión nuevamente.', {
        autoClose: 3000
      });

      // Clear user data and token
      store.logout();

      // Redirect to login page
      const router = useRouter();
      router.push({ name: 'Authentication' });
    }
    */
    // Manejo básico de errores
    if (error.response) {
      console.error(`Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      console.error('Error de conexión: No se recibió respuesta del servidor');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
