import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api/clothing', withCredentials: true });

export const fetchClothing = () => API.get('/all');
export const addClothing = (data) => API.post('/add', data);
export const deleteClothing = (id) => API.delete(`/delete/${id}`);
export const fetchNotifications = () => API.get('/notifications');
