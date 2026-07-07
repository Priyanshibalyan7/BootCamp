import students from "../database/data.js";
const getStudent = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "data fetched successfully",
            data: students

        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed to fetch data : ", error
        })
    }
}

const addStudent = (req, res) => {
    const { name, age, Gender } = req.body

    if (!name || !age || !Gender) {
        res.status(400).json({
            success: false,
            message: " data is incomplete"
        })
    }
    students.push({ name, age, Gender })

    res.status(201).json({
        success: true,
        message: "data added successfully",
    })


}

const updateStudent = (req, res) => {
    const { name, Gender } = req.body

    if (!name || !Gender) {
        res.status(400).json({
            success: false,
            message: " Gender needed"
        })
    }
    let Student = students.find((value) => value.Gender === Gender)

    if (!Student) {
        res.status(404).json({
            success: false,
            message: "Student doesn't exists"
        })
    }

    Student.name = name;
    res.json({
        success: true,
        message: "Student updated",
        data: students
    })

}

const deleteStudent = (req, res) => {
    const { Gender } = req.body
    if (!Gender) {
        res.status(400).json({
            success: false,
            message: "Gender needed"
        })
    }
    const index = students.findIndex((value) => value.Gender === Gender);
    students.splice(index, 1);
    res.status(200).json({
        success: true,
        message: "Student deleted successfully",
        data: students
    })

}

export { getStudent, addStudent, updateStudent, deleteStudent }