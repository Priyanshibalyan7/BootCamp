const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: 200,
    },
    thumbnail: {
      type: String,
      default: 'https://placehold.co/600x400?text=Course',
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Web Development',
        'Data Science',
        'Mobile Development',
        'Design',
        'Business',
        'Marketing',
        'Programming Languages',
        'Other',
      ],
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  { timestamps: true }
);

courseSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-5);
  }
  next();
});

courseSchema.methods.calculateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    return;
  }
  const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
  this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
};

module.exports = mongoose.model('Course', courseSchema);
