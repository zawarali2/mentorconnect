const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    // Link mentor profile with logged in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // Basic Information
    name: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    avatarBg: {
      type: String,
      default: "#e07a5f",
    },

    role: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      required: true,
    },

    university: {
      type: String,
      required: true,
    },

    degree: {
      type: String,
      required: true,
    },

    graduationYear: {
      type: Number,
      required: true,
    },

    // Skills
    skills: [
      {
        type: String,
      },
    ],

    // Social Links
    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    // Session Information
    price: {
      type: String,
      default: "Free",
    },

    rating: {
      type: Number,
      default: 5,
    },

    sessions: {
      type: Number,
      default: 0,
    },

    // Reviews
    reviews: [
      {
        name: String,
        text: String,
        stars: Number,
      },
    ],

    // Optional Intro Video
    videoId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mentor", mentorSchema);