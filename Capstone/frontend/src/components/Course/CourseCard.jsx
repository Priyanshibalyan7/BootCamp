import { Link } from "react-router-dom";
import "./CourseCard.css";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">

      <img
        src="https://picsum.photos/400/250"
        alt={course.title}
      />

      <div className="course-content">

        <span className="category">
          {course.category}
        </span>

        <h3>{course.title}</h3>

        <p className="instructor">
          👨‍🏫 {course.instructor?.name}
        </p>

        <div className="price-rating">

          <h2>₹ {course.price}</h2>

          <span>⭐⭐⭐⭐⭐</span>

        </div>

        <Link to={`/course/${course._id}`}>

          <button>

            View Details

          </button>

        </Link>

      </div>

    </div>
  );
};

export default CourseCard;