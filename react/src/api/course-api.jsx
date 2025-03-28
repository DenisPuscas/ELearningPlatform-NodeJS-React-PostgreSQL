import axios from 'axios';

const API_URL = 'http://localhost:4000/api/courses';

const getCourses = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/courses');
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const getCourseById = async (id) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/courses/id/${id}`);
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const getLiveCourses = async () => {
    try {
        const response = await axios.get("http://localhost:4000/api/courses/live");
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const getSelfpacedCourses = async () => {
    try {
        const response = await axios.get("http://localhost:4000/api/courses/selfpaced");
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const getOffers = async () => {
    try {
        const response = await axios.get("http://localhost:4000/api/courses/offers");
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const getCoursesByCategory = async (category) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/courses/category/${category}`);
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

const getCoursesByName = async (keyword) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/courses/search`, {
            params: { query: keyword }
        });
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};

const createCourse = async (courseData) => {
    try {
        const response = await axios.post(API_URL, courseData);
        return response.data;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
};

const updateCourse = async (id, courseData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, courseData);
        return response.data;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
};

const updateCourseSeats = async (id, seats) => {
    try {
        const response = await axios.put(`${API_URL}/seats/${id}`, { available_seats: seats });
        return response.data;
    } catch (error) {
        console.error("Error updating course seats", error);
        throw error;
    }
};

const deleteCourse = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
};

export {
    getCourses,
    getCourseById,
    getLiveCourses,
    getSelfpacedCourses,
    getOffers,
    getCoursesByCategory,
    getCoursesByName,
    createCourse,
    updateCourse,
    deleteCourse,
    updateCourseSeats,
};

// const fetchCourses = async () => {
//     try {
//         const data = await getCourses();
//         setCourses(data);
//         console.log(courses);
//     } catch (err) {
//         console.log(err);
//     }
// };

// useEffect(() => {
//     fetchCourses();
// }, []);