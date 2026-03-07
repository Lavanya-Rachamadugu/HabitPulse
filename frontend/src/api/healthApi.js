import axios from "axios";

const API = "http://localhost:5000/api/health";

export const getTasks = (userId) => axios.get(`${API}/${userId}`);
export const addTask = (data) => axios.post(API, data);
export const updateTask = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API}/${id}`);