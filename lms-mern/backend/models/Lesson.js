const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Lesson content is required'],
    },
    videoUrl: {
      type: String,
      default: '',
    },
    duration: {
      type: Number, // in minutes
      default: 0,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    resources: [
      {
        title: String,
        url: String,
      },
    ],
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
