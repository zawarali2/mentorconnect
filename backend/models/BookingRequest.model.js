const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    studentEmail: {
      type: String,
      required: [true, "Student email is required"],
      lowercase: true,
      trim: true,
    },
    university: {
      type: String,
      required: [true, "University is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    preferredDate: {
      type: String,
      required: [true, "Preferred date is required"],
    },
    preferredTime: {
      type: String,
      required: [true, "Preferred time is required"],
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: [true, "Mentor ID is required"],
    },
    mentorName: {
      type: String,
      required: true,
    },
    mentorRole: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },
    mentorNote: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BookingRequest", bookingRequestSchema);
