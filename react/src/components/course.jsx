import { CalendarDots, Clock, CurrencyEur, ListBullets, Trash } from '@phosphor-icons/react'
import { AuthContext } from '../context/auth-context';
import { enrollCourse } from '../api/enrollment-api';
import { deleteCourse } from '../api/course-api';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { Snackbar } from '@mui/material';
import dayjs from 'dayjs';
import './course.css'

export const Course = ({ id, title, category, duration, startDate, endDate, price, discount, isLive, availableSeats, owned = false, expired = false, toggleRefresh }) => {
    const [snackbar, setSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/info/${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await deleteCourse(id);
                setSnackbarMessage("Course deleted successfully!");
                setSnackbar(true);
                toggleRefresh();
            } catch (error) {
                console.error('Error deleting course');
            }
        }
    };

    const handleEnroll = async () => {
        if (user) {
            if (window.confirm(`Are you sure you want to ${isLive ? "enroll in" : "buy"} this course?`)) {
                try {
                    await enrollCourse(id, user.id);
                    setSnackbarMessage(isLive ? "Enrolled successfully!" : "Purchased successfully!");
                    setSnackbar(true);
                    toggleRefresh();
                } catch (error) {
                    console.error('Error enrolling in course');
                }
            }
        } else {
            navigate("/login");
        }
    };

    return (
        <>
            <div className={`courseCard ${expired || (isLive && availableSeats < 1) ? 'expired' : ''} ${owned ? 'owned' : ''}`} onClick={handleRedirect}>
                <div className="courseTitle"> {title} </div>
                <div className='courseGroup'>
                    <ListBullets className='courseIcon' />
                    <div className="courseCategory"> {category} </div>
                </div>
                <div className='courseGroup'>
                    {isLive ? <CalendarDots className='courseIcon' /> : <Clock className='courseIcon' />}
                    <div className="courseDuration">
                        {isLive ?
                            dayjs(startDate).format("DD MMM") + " - " + dayjs(endDate).format("DD MMM")
                            :
                            <>{duration} weeks</>
                        }
                    </div>
                </div>
                <div className='courseGroup'>
                    <CurrencyEur className='courseIcon' />
                    <div className="coursePrice">
                        {discount ?
                            <>
                                {discount}
                                <span style={{ textDecoration: 'line-through', marginLeft: '8px', color: "#606060" }}>
                                    {price}
                                </span>
                            </>
                            :
                            price
                        }
                    </div>
                </div>
                {user?.role === "teacher" ?
                    <Trash className='courseTrash' onClick={(e) => { e.stopPropagation(); handleDelete(); }} />
                    :
                    <>{owned ?
                        <div className="courseDisabled"> {isLive ? "Enrolled" : "Owned"} </div>
                        :
                        (expired ?
                            <div className="courseDisabled"> Expired </div>
                            :
                            (isLive && availableSeats < 1 ?
                                <div className="courseDisabled"> Full </div>
                                :
                                <div className="courseEnroll" onClick={(e) => { e.stopPropagation(); handleEnroll(); }}> {isLive ? "Enroll" : "Buy"} </div>
                            )
                        )
                    }</>
                }
            </div>
            <Snackbar
                open={snackbar}
                autoHideDuration={6000}
                onClose={() => setSnackbar(false)}
                message={snackbarMessage}
            />
        </>
    )
}