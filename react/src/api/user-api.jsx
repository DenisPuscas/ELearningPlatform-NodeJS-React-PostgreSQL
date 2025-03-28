import axios from 'axios';

const API_URL = 'http://localhost:4000/api/users';

const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/register`, userData);
};

const authUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};

const getUser = async (token) => {
    return await axios.get(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export {
    registerUser,
    authUser,
    getUser,
};