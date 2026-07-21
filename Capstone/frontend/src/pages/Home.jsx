import { useEffect, useState } from "react";
import "./Home.css";


import API from "../services/api";
import Hero from "../components/Home/Hero";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import CourseCard from "../components/Course/CourseCard";
import WhyChooseUs from "../components/Home/WhyChooseUs";
import Features from "../components/Home/Features";

const Home = () => {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        fetchCourses();

    }, []);

    async function fetchCourses() {

        try {

            const res = await API.get("/courses");

            setCourses(res.data.courses);

        }

        catch (error) {
            console.log(error);
        }

    }
    return (

        <>

            <Navbar />

            <Hero />

            <section className="featured">

                <h2>

                    Our Popular Courses

                </h2>

                <div className="course-grid">

                    {

                        courses.slice(0, 6).map((course) => (

                            <CourseCard
                                key={course._id}

                                course={course} />

                        ))

                    }

                </div>

            </section>
            <WhyChooseUs/>
            <Features/>

            <Footer />

        </>

    )

}

export default Home;