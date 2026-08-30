const BASE = '/api';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}
export { getCookie };

async function request(path, options = {}) {
  const method = options.method || 'GET';
  const headers = { ...(options.headers || {}) };
  if (options.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (method !== 'GET') {
    const csrf = getCookie('csrftoken');
    if (csrf) headers['X-CSRFToken'] = csrf;
  }
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail =
        body.detail ||
        body.error ||
        (body.non_field_errors && body.non_field_errors.join(', ')) ||
        JSON.stringify(body).slice(0, 200);
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

/** Liste DRF (tableau simple ou paginé). */
export async function listAll(path, extra = '') {
  const data = await request(`${path}/?${extra}`, { headers: { Accept: 'application/json' } });
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export const get = (path) => request(path, { headers: { Accept: 'application/json' } });
export const post = (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) });

export const api = {
  destinations: (q = '') => listAll('/destinations', q),
  destination: (id) => get(`/destinations/${id}/`),
  hotels: (q = '') => listAll('/hotels', q),
  packs: (q = '') => listAll('/packs', q),
  pack: (id) => get(`/packs/${id}/`),
  blogPosts: (q = '') => listAll('/blog-posts', q),
  blogComments: (q = '') => listAll('/blog-comments', q),
  bookings: (q = '') => listAll('/bookings', q),
  booking: (id) => get(`/bookings/${id}/`),
  paymentRecords: (q = '') => listAll('/payment-records', q),
  contacts: (body) => post('/contacts/', body),
  testimonials: (q = '') => listAll('/testimonials', q),
  newsletter: (email) => post('/newsletter-subscribers/', { email }),
  createComment: (body) => post('/blog-comments/', body),
  createBooking: (body) => post('/bookings/', body),
  createCircuitBooking: (body) => post('/reser-circuits/', body),

  // Auth JSON
  me: () => get('/auth/me/'),
  login: (username, password) => post('/auth/login/', { username, password }),
  register: (data) => post('/auth/register/', data),
  logout: () => post('/auth/logout/', {}),
};

export default api;
