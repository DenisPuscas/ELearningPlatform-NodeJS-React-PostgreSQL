import { getCoursesByCategory, getCourses, getLiveCourses, getSelfpacedCourses, getCoursesByName } from "../api/course-api";
import { Divider, FormControl, InputLabel, MenuItem, Select, Skeleton, Snackbar } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { getUserEnrollments } from "../api/enrollment-api";
import { useLocation, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { UpdateModal } from "../components/modal";
import { Course } from "../components/course";
import dayjs from "dayjs";
import "./courses.css";

export const Courses = () => {
    const { categ } = useParams();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [category, setCategory] = useState(categ ? categ : "");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';

    const handleChangeCategory = (event) => {
        setCategory(event.target.value);
    };

    const fetchCoursesByName = async () => {
        try {
            setLoading(true);
            let fetchedCourses = [];

            if (searchTerm) {
                fetchedCourses = await getCoursesByName(searchTerm);
            } else {
                fetchedCourses = await getCourses();
            }

            if (user?.role === "student" && fetchedCourses && fetchedCourses.length > 1) {
                fetchedCourses = await sortCourses(fetchedCourses);
            }

            setCourses(fetchedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCoursesByCategory = async () => {
        try {
            setLoading(true);
            let fetchedCourses = [];

            if (category === "live") {
                fetchedCourses = await getLiveCourses(category);
            } else if (category === "selfpaced") {
                fetchedCourses = await getSelfpacedCourses(category);
            } else if (category !== "") {
                fetchedCourses = await getCoursesByCategory(category);
            } else {
                fetchedCourses = await getCourses();
            }

            if (startDate || endDate) {
                fetchedCourses = fetchedCourses.filter((course) => {
                    if (!course.is_live) return false;

                    const courseStart = dayjs(course.start_date);
                    const courseEnd = dayjs(course.end_date);

                    const startMatch = startDate
                        ? courseStart.isAfter(startDate) || courseStart.isSame(startDate)
                        : true;

                    const endMatch = endDate
                        ? courseEnd.isBefore(endDate) || courseEnd.isSame(endDate)
                        : true;

                    return startMatch && endMatch;
                });
            }

            if (user?.role === "student" && fetchedCourses && fetchedCourses.length > 1) {
                fetchedCourses = await sortCourses(fetchedCourses);
            }

            setCourses(fetchedCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoursesByCategory();
        // eslint-disable-next-line
    }, [category, startDate, endDate, refresh]);

    useEffect(() => {
        fetchCoursesByName();
        // eslint-disable-next-line
    }, [searchTerm]);

    const sortCourses = async (courses) => {
        const enrollments = await getUserEnrollments(user.id);
        const enrolledCourses = courses.map(course => ({
            ...course,
            full: course.is_live ? course.available_seats < 1 : false,
            expired: course.is_live ? dayjs(course.start_date).isBefore(dayjs()) : false,
            owned: enrollments.some(enrollment => enrollment.course_id === course.course_id)
        }));

        return enrolledCourses.sort((a, b) => {
            if (a.expired && !b.expired) return 1;
            if (!a.expired && b.expired) return -1;

            if (a.full && !b.full) return 1;
            if (!a.full && b.full) return -1;

            if (a.owned && !b.owned) return 1;
            if (!a.owned && b.owned) return -1;

            if (a.language === user.language && b.language !== user.language) return -1;
            if (b.language === user.language && a.language !== user.language) return 1;

            return 0;
        });
    };

    return (
        <div>
            <div className="coursesInputs">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={(newDate) => setStartDate(newDate)}
                        slotProps={{
                            textField: {
                                InputProps: {
                                    style: { color: "white", borderColor: "white" },
                                },
                                InputLabelProps: {
                                    style: { color: "white" },
                                },
                                sx: {
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "white", backgroundColor: "var(--blue)" },
                                        "&:hover fieldset": { borderColor: "white" },
                                        "&.Mui-focused fieldset": { borderColor: "white" },
                                        "& .MuiSvgIcon-root": { color: "white", zIndex: "1" },
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "white", zIndex: "1"
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="End date"
                        value={endDate}
                        onChange={(newDate) => setEndDate(newDate)}
                        slotProps={{
                            textField: {
                                InputProps: {
                                    style: { color: "white", borderColor: "white" },
                                },
                                InputLabelProps: {
                                    style: { color: "white" },
                                },
                                sx: {
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": { borderColor: "white", backgroundColor: "var(--blue)" },
                                        "&:hover fieldset": { borderColor: "white" },
                                        "&.Mui-focused fieldset": { borderColor: "white" },
                                        "& .MuiSvgIcon-root": { color: "white", zIndex: "1" },
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "white", zIndex: "1"
                                    },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>
                <FormControl sx={{ width: "250px" }} key={2}>
                    <InputLabel id="select-label"> Category </InputLabel>
                    <Select
                        labelId="select-label"
                        value={category}
                        onChange={handleChangeCategory}
                        label="Category"
                        sx={{
                            color: "#303030",
                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#0080FF" }, // Border alb
                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00509f" }, // Hover
                        }}
                    >
                        <MenuItem value=""> <em>All</em> </MenuItem>
                        <MenuItem value="ChatGPT">ChatGPT</MenuItem>
                        <MenuItem value="DataScience">Data Science</MenuItem>
                        <MenuItem value="Python">Python</MenuItem>
                        <Divider />
                        <MenuItem value="live">Live</MenuItem>
                        <MenuItem value="selfpaced">Self-Paced</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className="coursesGrid">
                {!loading ? (
                    courses && courses.length > 0 ?
                        courses.map((course) => (
                            <Course key={course.course_id}
                                id={course.course_id}
                                title={course.title}
                                category={course.category}
                                duration={course.duration}
                                startDate={course.start_date}
                                endDate={course.end_date}
                                price={course.price}
                                discount={course.discount}
                                availableSeats={course.available_seats}
                                isLive={course.is_live}
                                owned={course.owned}
                                expired={course.expired}
                                toggleRefresh={() => setRefresh(!refresh)}
                            />
                        ))
                        :
                        <div className="coursesEmpty">No courses available!</div>
                ) : (
                    loading && Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton
                            key={index}
                            sx={{
                                bgcolor: 'rgba(60, 60, 60, 0.5)',
                                borderRadius: '20px',
                            }}
                            variant="rectangular"
                            width="100%"
                            height={184}
                        />
                    ))
                )}
                {user?.role === "teacher" &&
                    <div className="coursesAddCard" onClick={() => setOpen(true)}>
                        <span>Add course</span>
                        <span style={{ fontSize: '30px', fontWeight: 'bold' }}> + </span>
                    </div>
                }
            </div>
            <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={() => setSnackbar(false)}
                message="Course created successfully!"
            />
            <UpdateModal
                open={isOpen}
                onClose={() => setOpen(false)}
                create={true}
                toggleRefresh={() => setRefresh(!refresh)}
            />
        </div>
    )
}