import { getLiveCourses, getSelfpacedCourses } from '../api/course-api';
import { useNavigate } from 'react-router-dom';
import { Course } from '../components/course';
import { useEffect, useState } from 'react';
import './home.css'

export const Home = () => {
    const [refresh, setRefresh] = useState(false);
    const [liveCourses, setLiveCourses] = useState([]);
    const [selfpacedCourses, setSelfpacedCourses] = useState([]);
    const navigate = useNavigate();

    const goToCourses = (category) => {
        navigate(`/courses/${category}`);
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const lc = await getLiveCourses();
                setLiveCourses(lc);
                const spc = await getSelfpacedCourses();
                setSelfpacedCourses(spc);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, [refresh]);

    return (
        <div>
            <div className="homeTitle">Bring your goals into focus</div>
            <div className='homeSubtitle'> <span style={{ fontFamily: 'Sigmar, sans-serif' }}>E-learn</span> offers online courses and programs that prepare you for every career moment </div>
            <div className='homeTypeGroup'>
                <div className='homeCourseType'> Self-paced courses </div>
                <div className='homeViewAllBtn' onClick={() => goToCourses('live')}> View all </div>
            </div>
            <div className='homeGrid'>
                {selfpacedCourses && selfpacedCourses.length > 0 ?
                    selfpacedCourses.filter((c) => !c.is_live).slice(0, 3).map((course) => (
                        <Course key={course.course_id}
                            id={course.course_id}
                            title={course.title}
                            category={course.category}
                            duration={course.duration}
                            startDate={course.start_date}
                            endDate={course.end_date}
                            price={course.price}
                            discount={course.discount}
                            isLive={course.is_live}
                            toggleRefresh={() => setRefresh(!refresh)}
                        />
                    ))
                    :
                    <div className="coursesEmpty">No courses available!</div>
                }
            </div>
            <div className='homeTypeGroup'>
                <div className='homeCourseType'> Live courses </div>
                <div className='homeViewAllBtn' onClick={() => goToCourses('selfpaced')}> View all </div>
            </div>
            <div className='homeGrid'>
                {liveCourses && liveCourses.length > 0 ?
                    liveCourses.filter((c) => c.is_live).slice(0, 3).map((course) => (
                        <Course key={course.course_id}
                            id={course.course_id}
                            title={course.title}
                            category={course.category}
                            duration={course.duration}
                            startDate={course.start_date}
                            endDate={course.end_date}
                            price={course.price}
                            discount={course.discount}
                            isLive={course.is_live}
                            toggleRefresh={() => setRefresh(!refresh)}
                        />
                    ))
                    :
                    <div className="coursesEmpty">No courses available!</div>
                }
            </div>
        </div>
    )
}