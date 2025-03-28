import axios from 'axios';

const API_URL = 'http://localhost:4000/api/enrollments';

export const enrollCourse = async (courseId, userId) => {
    try {
        const response = await axios.post(API_URL, { course_id: courseId, user_id: userId });
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to enroll';
    }
};

export const getUserEnrollments = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/my/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch enrollments';
    }
};

export const getCourseEnrollments = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/course/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.error || 'Failed to fetch enrollments';
    }
};

export const unenrollCourse = async (enrollmentId) => {
    try {
        await axios.delete(`${API_URL}/${enrollmentId}`);
    } catch (error) {
        throw error.response?.data?.error || 'Failed to unenroll';
    }
};
