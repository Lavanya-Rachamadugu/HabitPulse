import axios from "axios";

const API = "https://habitpulse-cgk3.onrender.com/health";

export const getTasks = (userId) => axios.get(`${API}/${userId}`);
export const addTask = (data) => axios.post(API, data);
export const updateTask = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTask = (id) => axios.delete(`${API}/${id}`);