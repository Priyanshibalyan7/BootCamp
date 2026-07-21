/**
 * Seed script - populates the database with demo users, courses and lessons.
 * Run with: npm run seed
 */
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Course.deleteMany(),
    Lesson.deleteMany(),
    Enrollment.deleteMany(),
  ]);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@lms.com',
    password: 'password123',
    role: 'admin',
  });

  const instructor = await User.create({
    name: 'Jane Instructor',
    email: 'instructor@lms.com',
    password: 'password123',
    role: 'instructor',
    bio: 'Full-stack developer and educator with 10 years of experience.',
  });

  const student = await User.create({
    name: 'John Student',
    email: 'student@lms.com',
    password: 'password123',
    role: 'student',
  });

  console.log('Creating courses...');
  const course1 = await Course.create({
    title: 'Complete MERN Stack Development',
    description:
      'Learn to build full-stack web applications using MongoDB, Express, React and Node.js from scratch. This course covers everything from basic setup to deployment.',
    shortDescription: 'Master the MERN stack from zero to production.',
    category: 'Web Development',
    level: 'Intermediate',
    price: 49.99,
    instructor: instructor._id,
    published: true,
    tags: ['mern', 'react', 'node', 'mongodb'],
  });

  const course2 = await Course.create({
    title: 'Python for Data Science',
    description:
      'A comprehensive introduction to using Python for data analysis, visualization and machine learning using pandas, numpy and scikit-learn.',
    shortDescription: 'Analyze data like a pro using Python.',
    category: 'Data Science',
    level: 'Beginner',
    price: 0,
    instructor: instructor._id,
    published: true,
    tags: ['python', 'data-science', 'pandas'],
  });

  console.log('Creating lessons...');
  const lessons1 = await Lesson.insertMany([
    {
      course: course1._id,
      title: 'Introduction to MERN Stack',
      content: 'Overview of MongoDB, Express, React and Node.js and how they work together.',
      duration: 12,
      order: 0,
      isPreview: true,
    },
    {
      course: course1._id,
      title: 'Setting up the Backend with Express',
      content: 'Building a REST API using Express.js and connecting to MongoDB with Mongoose.',
      duration: 25,
      order: 1,
    },
    {
      course: course1._id,
      title: 'Building the Frontend with React',
      content: 'Creating components, managing state, and connecting to the backend API.',
      duration: 30,
      order: 2,
    },
  ]);

  const lessons2 = await Lesson.insertMany([
    {
      course: course2._id,
      title: 'Python Basics Recap',
      content: 'A quick refresher on Python syntax, data types and control flow.',
      duration: 15,
      order: 0,
      isPreview: true,
    },
    {
      course: course2._id,
      title: 'Working with Pandas DataFrames',
      content: 'Loading, cleaning and transforming tabular data with pandas.',
      duration: 20,
      order: 1,
    },
  ]);

  course1.lessons = lessons1.map((l) => l._id);
  await course1.save();

  course2.lessons = lessons2.map((l) => l._id);
  await course2.save();

  instructor.createdCourses = [course1._id, course2._id];
  await instructor.save();

  console.log('Enrolling demo student...');
  const enrollment = await Enrollment.create({
    student: student._id,
    course: course1._id,
    completedLessons: [lessons1[0]._id],
    progress: Math.round((1 / lessons1.length) * 100),
  });

  course1.enrolledStudents.push(student._id);
  await course1.save();

  student.enrolledCourses = [course1._id];
  await student.save();

  console.log('\nSeed complete! Demo accounts:');
  console.log('  Admin:      admin@lms.com / password123');
  console.log('  Instructor: instructor@lms.com / password123');
  console.log('  Student:    student@lms.com / password123');

  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
