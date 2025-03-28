import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Snackbar, TextField, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { createCourse, updateCourse } from "../api/course-api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export const UpdateModal = ({ create = false, open, onClose, toggleRefresh, course = null }) => {
    const [snackbar, setSnackbar] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        language: 'English',
        price: '',
        discount: '',
        is_live: true,
        start_date: null,
        end_date: null,
        sessions: '',
        available_seats: '',
        duration: '',
        lessons: '',
    });

    const clearForm = () => {
        if (formData.is_live) {
            formData.lessons = '';
            formData.duration = '';
        } else {
            formData.start_date = null;
            formData.end_date = null;
            formData.sessions = '';
            formData.available_seats = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.is_live && (!formData.start_date || !formData.end_date)) {
            setSnackbar(true);
            return;
        }
        if (formData.discount === '') {
            formData.discount = null;
        }
        clearForm();
        if (create) {
            createCourse(formData);
        } else {
            updateCourse(course.course_id, formData)
        }
        toggleRefresh();
        onClose();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!create && course) {
            formData.title = course.title;
            formData.description = course.description;
            formData.category = course.category;
            formData.language = course.language;
            formData.price = course.price;
            formData.discount = course.discount || '';
            formData.is_live = course.is_live;
            formData.start_date = dayjs(course.start_date);
            formData.end_date = dayjs(course.end_date);
            formData.sessions = course.sessions || '';
            formData.available_seats = course.available_seats || '';
            formData.lessons = course.lessons || '';
            formData.duration = course.duration || '';
        }
        // eslint-disable-next-line
    }, [course, create])

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid var(--blue)',
        borderRadius: '20px',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={modalStyle}>
                    <Typography variant="h6" mb={2} color="var(--black)">
                        {create ? "Create" : "Update"} Course
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="modalInputs" style={{ maxHeight: '60vh', overflow: 'auto' }}>
                            <TextField
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                                multiline
                                rows={2}
                            />
                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                                multiline
                                rows={3}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    required
                                    onChange={handleChange}
                                >
                                    <MenuItem value="ChatGPT">ChatGPT</MenuItem>
                                    <MenuItem value="Data Science">Data Science</MenuItem>
                                    <MenuItem value="Python">Python</MenuItem>
                                    <MenuItem value="MachineLearning">Machine Learning</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Language</InputLabel>
                                <Select
                                    label="Language"
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="English">English</MenuItem>
                                    <MenuItem value="Romanian">Romanian</MenuItem>
                                    <MenuItem value="Spanish">Spanish</MenuItem>
                                    <MenuItem value="German">German</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                required
                            />
                            <TextField
                                label="Discount"
                                name="discount"
                                type="number"
                                value={formData.discount}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    label="Type"
                                    name="is_live"
                                    value={formData.is_live}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={true}>Live</MenuItem>
                                    <MenuItem value={false}>Self-paced</MenuItem>
                                </Select>
                            </FormControl>
                            {formData.is_live ?
                                <>
                                    <TextField
                                        label="Sessions"
                                        name="sessions"
                                        type="number"
                                        value={formData.sessions}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Start Date"
                                            value={formData.start_date}
                                            onChange={(newValue) =>
                                                handleChange({ target: { name: "start_date", value: newValue } })
                                            }
                                            sx={{ width: '100%', margin: '18px 0' }}
                                        />
                                        <DatePicker
                                            label="End Date"
                                            value={formData.end_date}
                                            onChange={(newValue) =>
                                                handleChange({ target: { name: "end_date", value: newValue } })
                                            }
                                            required
                                            sx={{ width: '100%', margin: '8px 0' }}
                                        />
                                    </LocalizationProvider>
                                    <TextField
                                        label="Available seats"
                                        name="available_seats"
                                        type="number"
                                        value={formData.available_seats}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                </>
                                :
                                <>
                                    <TextField
                                        label="Lessons"
                                        name="lessons"
                                        type="number"
                                        value={formData.lessons}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <TextField
                                        label="Duration (weeks)"
                                        name="duration"
                                        type="number"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                </>
                            }
                        </div>
                        <Box mt={2} display="flex" justifyContent="space-between">
                            <Button onClick={onClose} variant="outlined">
                                Cancel
                            </Button>
                            {create ?
                                <Button type="submit" variant="contained" color="primary">
                                    Create
                                </Button>
                                :
                                <Button type="submit" variant="contained" color="primary">
                                    Update
                                </Button>
                            }
                        </Box>
                    </form>
                </Box>

            </Modal>
            <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={() => setSnackbar(false)}
                message="The date is required!"
            />
        </>
    );
};