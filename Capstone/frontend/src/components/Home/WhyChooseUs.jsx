import "./WhyChooseUs.css";

const WhyChooseUs = () => {

    const data = [
        {
            title: "Expert Instructors",
            description: "Learn from experienced professionals with real-world industry knowledge.",
            icon: "👨‍🏫"
        },
        {
            title: "Flexible Learning",
            description: "Study anytime and anywhere at your own pace.",
            icon: "💻"
        },
        {
            title: "Certificate",
            description: "Receive a certificate after successfully completing the course.",
            icon: "🏆"
        },
        {
            title: "Affordable Courses",
            description: "Quality education at student-friendly prices.",
            icon: "💰"
        }
    ];

    return (

        <section className="why-section">

            <h2>Why Choose EduVerse?</h2>

            <div className="why-container">

                {
                    data.map((item, index) => (

                        <div className="why-card" key={index}>

                            <div className="icon">
                                {item.icon}
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.description}</p>

                        </div>

                    ))
                }

            </div>

        </section>

    );

}

export default WhyChooseUs;