import { BookOpen, CalendarDots, Clock, CurrencyEur, Globe, ListBullets, UsersThree } from "@phosphor-icons/react";
import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { enrollCourse, getCourseEnrollments, getUserEnrollments } from "../api/enrollment-api";
import { DateCalendar, LocalizationProvider, PickersDay } from "@mui/x-date-pickers";
import { deleteCourse, getCourseById, updateCourseSeats } from "../api/course-api";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Badge, Box, Typography } from "@mui/material";
import { AuthContext } from "../context/auth-context";
import { UpdateModal } from "../components/modal";
import dayjs from "dayjs";
import "./info.css"

export const Info = () => {
    const { id } = useParams();
    const [owned, setOwned] = useState(false);
    const [isOpen, setOpen] = useState(false);
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [enrolledDates, setEnrolledDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const allMonths = Array.from({ length: 12 }, (_, i) => ({
        name: dayjs().month(i).format("MMM"),
        students: 0
    }));

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getCourseById(id);
                if (data.is_live && dayjs(data.start_date).isBefore(dayjs())) {
                    setOwned(true);
                } else if (user) {
                    const userEnrollments = await getUserEnrollments(user.id);
                    if (userEnrollments.some(enrollment => enrollment.course_id === data.course_id)) {
                        setOwned(true);
                    }
                }
                setCourse(data);

                const dates = await getCourseEnrollments(data.course_id);
                setEnrollments(dates);
                setEnrolledDates([...new Set(dates.map(e => dayjs(e.enrolled_at).format("YYYY-MM-DD")))]);

                const enrollmentByMonth = dates.reduce((acc, enrollment) => {
                    const month = dayjs(enrollment.enrolled_at).format("MMM");
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {});

                setChartData(allMonths.map(({ name }) => ({
                    name,
                    students: enrollmentByMonth[name] || 0
                })));

            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourse();

        // eslint-disable-next-line
    }, [refresh]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(id);
                navigate("/courses");
            } catch (error) {
                console.error('Error deleting course');
            }
        }
    };

    const handleEnroll = async () => {
        if (user) {
            if (window.confirm(`Are you sure you want to ${course.is_live ? "enroll in" : "buy"} this course?`)) {
                try {
                    await enrollCourse(id, user.id);
                    await updateCourseSeats(id, course.available_seats - 1);
                    setCourse(prevCourse => ({
                        ...prevCourse,
                        available_seats: prevCourse.available_seats - 1
                    }));
                    setOwned(true);
                } catch (error) {
                    console.error('Error enrolling in course');
                }
            }
        } else {
            navigate("/login");
        }
    };

    const handleDateChange = (newDate) => {
        const formattedDate = newDate.format("YYYY-MM-DD");
        setSelectedDate(formattedDate);

        const studentsOnDate = enrollments
            .filter((e) => dayjs(e.enrolled_at).format("YYYY-MM-DD") === formattedDate)
            .map((e) => e.student_name);

        setStudents(studentsOnDate);
    };

    return (
        <>
            {course && (
                user?.role !== "teacher" ?
                    <>
                        <div className="infoPanelLeft">
                            <div className="infoTitle"> {course.title} </div>
                            <div className="infoDescription"> {course.description} </div>
                            <div className="infoGroup">
                                <ListBullets className="infoIcon" />
                                <div style={{ fontStyle: 'italic' }}> {course.category} </div>
                            </div>
                            <div className="infoGroup">
                                <Globe className="infoIcon" />
                                <div> {course.language} </div>
                            </div>
                        </div>
                        <div className="infoPanelRight">
                            <div style={{ textAlign: 'right' }}>
                                {course.discount && <div style={{ color: '#606060', textDecoration: 'line-through' }}> {course.price} </div>}
                                <div className="infoGroup">
                                    <CurrencyEur className="infoIcon" weight="bold" />
                                    <div style={{ fontWeight: 'bold' }}> {course.discount ? course.discount : course.price} </div>
                                </div>
                            </div>
                            <div className="infoGroup">
                                <BookOpen className="infoIcon" />
                                <div>
                                    {course.is_live ?
                                        course.sessions + " sessions" :
                                        course.lessons + " lessons"}
                                </div>
                            </div>
                            {course.is_live &&
                                <div className="infoGroup">
                                    <UsersThree className="infoIcon" />
                                    <div> {course.available_seats} available seats </div>
                                </div>
                            }
                            {course.is_live ?
                                <div className="infoGroup">
                                    <CalendarDots className="infoIcon" />
                                    <div> {dayjs(course.start_date).format("DD MMM") + " - " + dayjs(course.end_date).format("DD MMM")} </div>
                                    {!owned && course.available_seats > 0 &&
                                        <div className="infoButton" onClick={handleEnroll}> Enroll </div>
                                    }
                                </div>
                                :
                                <div className="infoGroup">
                                    <Clock className="infoIcon" />
                                    <> {course.duration} weeks </>
                                    {!owned &&
                                        <div className="infoButton" onClick={handleEnroll}> Buy </div>
                                    }
                                </div>
                            }
                        </div>
                    </>
                    :
                    <>
                        <div className="infoPanelLeft" style={{ height: '80vh' }}>
                            <div className="infoTitle"> {course.title} </div>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={selectedDate ? dayjs(selectedDate) : null}
                                    onChange={handleDateChange}
                                    sx={{
                                        marginLeft: '0',
                                        backgroundColor: 'white',
                                        borderRadius: '20px',
                                        '& .MuiPickersCalendarHeader-root': {
                                            color: '#303030',
                                        }, '& .MuiPickersYear-root': {
                                            color: '#303030',
                                        },
                                    }}
                                    slots={{
                                        day: (dayProps) => {
                                            const date = dayjs(dayProps.day).format("YYYY-MM-DD");
                                            const isEnrolled = enrolledDates.includes(date);

                                            return (
                                                <Badge
                                                    key={date}
                                                    color={isEnrolled ? "primary" : "default"}
                                                    variant={isEnrolled ? "dot" : "standard"}
                                                >
                                                    <PickersDay {...dayProps} />
                                                </Badge>
                                            );
                                        },
                                    }}
                                />
                            </LocalizationProvider>
                            <Box mt={2} style={{ width: '280px', height: '85px', overflow: 'auto' }}>

                                {selectedDate && (<>
                                    <Typography variant="h6">Enrollments on {selectedDate}</Typography>
                                    {students.length > 0 ? (
                                        students.map((student_name, index) => <Typography key={index}>{student_name}</Typography>)
                                    ) : (
                                        <Typography>No enrollments on this day.</Typography>
                                    )}
                                </>)}
                            </Box>

                            {course.is_live &&
                                <div className="infoGroup">
                                    <CalendarDots className="infoIcon" />
                                    <div> {dayjs(course.startDate).format("DD MMM") + " - " + dayjs(course.endDate).format("DD MMM")} </div>
                                </div>
                            }
                        </div>
                        <div className="infoPanelRight">
                            <div className="infoGroup">
                                <div className="infoButton" onClick={() => setOpen(true)}> Update </div>
                                <div className="infoButton" onClick={handleDelete}> Delete </div>
                            </div>
                            {/* <ResponsiveContainer width={600} height={200}> */}
                            <ResponsiveContainer width={500}>
                                <BarChart data={chartData} margin={{ top: 50, bottom: 20 }} >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke="black" tick={{ angle: -45, textAnchor: "end", fontSize: 20 }} />
                                    <YAxis stroke="black" allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="students" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                                </BarChart>
                            </ResponsiveContainer>
                            {course.is_live &&
                                <div className="infoGroup">
                                    <UsersThree className="infoIcon" />
                                    <div> {course.available_seats} available seats </div>
                                </div>
                            }
                        </div>
                    </>
            )}
            <UpdateModal
                open={isOpen}
                onClose={() => setOpen(false)}
                course={course}
                toggleRefresh={() => setRefresh(!refresh)} />
        </>
    )
}