import { Course } from "../components/course";
import { getOffers } from "../api/course-api";
import { useEffect, useState } from "react";
import "./offers.css"

export const Offers = () => {
    const [refresh, setRefresh] = useState(false);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await getOffers();
                setOffers(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourse();
    }, [refresh]);

    return (
        <div>
            <div className="offersTitle"> Offers </div>
            <div className="coursesGrid">
                {offers && offers.length > 0 ?
                    offers.map((course) => (
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