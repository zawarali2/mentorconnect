const express = require("express");
const BookingRequest = require("../models/BookingRequest.model");
const Mentor = require("../models/Mentor.model");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * POST /api/bookings
 * Student submits a booking request — NO authentication required.
 */
router.post("/", async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      university,
      message,
      preferredDate,
      preferredTime,
      mentorId,
    } = req.body;

    // Validate required fields
    if (
      !studentName ||
      !studentEmail ||
      !university ||
      !message ||
      !preferredDate ||
      !preferredTime ||
      !mentorId
    ) {
      return res.status(400).json({
        message: "All fields are required. Please fill out the complete form.",
      });
    }

    // Validate email format
    if (!studentEmail.includes("@")) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }

    // Verify mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found." });
    }

    // Create booking with mentor details denormalized
    const booking = await BookingRequest.create({
      studentName: studentName.trim(),
      studentEmail: studentEmail.toLowerCase().trim(),
      university: university.trim(),
      message: message.trim(),
      preferredDate,
      preferredTime,
      mentorId: mentor._id,
      mentorName: mentor.name,
      mentorRole: mentor.role,
      status: "pending",
    });

    res.status(201).json({
      message:
        "Booking request submitted successfully! You can check its status on the Check Booked Sessions page.",
      booking,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid mentor ID." });
    }
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error creating booking." });
  }
});

/**
 * GET /api/bookings/check?email=student@example.com
 * Student checks all their bookings by email — NO authentication required.
 * This is the primary "Check Booked Sessions" feature replacing Nodemailer.
 */
router.get("/check", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        message: "Please provide an email address to check your bookings.",
      });
    }

    const bookings = await BookingRequest.find({
      studentEmail: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Check bookings error:", error);
    res.status(500).json({ message: "Server error checking bookings." });
  }
});

/**
 * GET /api/bookings/mentor
 * Returns all bookings for the authenticated mentor.
 * PROTECTED — requires JWT.
 */
router.get("/mentor", protect, async (req, res) => {
  try {
    // Find bookings where mentorName matches the authenticated user's name
    const bookings = await BookingRequest.find({
      mentorName: req.user.name,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Fetch mentor bookings error:", error);
    res.status(500).json({ message: "Server error fetching bookings." });
  }
});

/**
 * PATCH /api/bookings/:id/status
 * Mentor accepts, rejects, or marks a booking as completed.
 * PROTECTED — requires JWT. Also verifies the booking belongs to this mentor.
 */
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status, meetingLink, mentorNote } = req.body;

    // Validate status
    const validStatuses = ["pending", "accepted", "rejected", "completed"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find the booking
    const booking = await BookingRequest.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Verify this booking belongs to the authenticated mentor
    if (booking.mentorName !== req.user.name) {
      return res.status(403).json({
        message:
          "You can only manage your own bookings. This booking belongs to another mentor.",
      });
    }

    // Update booking
    booking.status = status;

    if (meetingLink !== undefined) {
      booking.meetingLink = meetingLink.trim();
    }
    if (mentorNote !== undefined) {
      booking.mentorNote = mentorNote.trim();
    }

    await booking.save();

    res.status(200).json({
      message: `Booking ${status} successfully.`,
      booking,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid booking ID." });
    }
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error updating booking." });
  }
});

/**
 * PATCH /api/bookings/:id/meeting-link
 * Mentor adds or updates the meeting link on an accepted booking.
 * PROTECTED — requires JWT.
 */
router.patch("/:id/meeting-link", protect, async (req, res) => {
  try {
    const { meetingLink } = req.body;

    if (!meetingLink) {
      return res.status(400).json({ message: "Meeting link is required." });
    }

    const booking = await BookingRequest.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Verify ownership
    if (booking.mentorName !== req.user.name) {
      return res.status(403).json({
        message: "You can only manage your own bookings.",
      });
    }

    // Only allow meeting link for accepted or completed bookings
    if (booking.status !== "accepted" && booking.status !== "completed") {
      return res.status(400).json({
        message:
          "Meeting link can only be added to accepted bookings. Current status: " +
          booking.status,
      });
    }

    booking.meetingLink = meetingLink.trim();
    await booking.save();

    res.status(200).json({
      message: "Meeting link updated successfully.",
      booking,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid booking ID." });
    }
    console.error("Update meeting link error:", error);
    res.status(500).json({ message: "Server error updating meeting link." });
  }
});

module.exports = router;
