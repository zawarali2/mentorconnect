const express = require("express");
const Mentor = require("../models/Mentor.model");
// const { protect } = require("../middleware/auth");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * GET /api/mentors
 * Returns all mentors. Supports ?search= and ?skill= query params.
 * Public — no authentication required.
 */
router.get("/", async (req, res) => {
  try {
    const { search, skill } = req.query;
    let query = {};

    // Filter by skill
    if (skill) {
      query.skills = { $in: [skill] };
    }

    // Search by name, role, university, or skills
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { role: searchRegex },
        { university: searchRegex },
        { skills: searchRegex },
      ];
    }

    const mentors = await Mentor.find(query).sort({ rating: -1 });

    res.status(200).json({
      count: mentors.length,
      mentors,
    });
  } catch (error) {
    console.error("Fetch mentors error:", error);
    res.status(500).json({ message: "Server error fetching mentors." });
  }
});

/**
 * GET /api/mentors/:id
 * Returns a single mentor by MongoDB ObjectId
 * Public — no authentication required.
 */
router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found." });
    }

    res.status(200).json({ mentor });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid mentor ID format." });
    }
    console.error("Fetch mentor error:", error);
    res.status(500).json({ message: "Server error fetching mentor." });
  }
});

/**
 * POST /api/mentors/seed
 * Seeds 4 sample mentor profiles into the database.
 * Only works if no mentors exist yet.
 * Public — for development convenience.
 */
// POST /api/mentors/profile
router.post("/profile", protect, async (req, res) => {
  try {

    // Check if mentor profile already exists
    const existingMentor = await Mentor.findOne({
      user: req.user._id,
    });

    if (existingMentor) {
      return res.status(400).json({
        message: "You already have a mentor profile.",
      });
    }

    const {
      role,
      bio,
      university,
      degree,
      graduationYear,
      skills,
      github,
      linkedin,
      price,
    } = req.body;

  const mentor = await Mentor.create({

    user: req.user._id,

    name: req.user.name,

    avatar: req.user.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase(),

    avatarBg: req.user.avatarColor,

    role,
    bio,
    university,
    degree,
    graduationYear,
    skills,
    github,
    linkedin,
    price,

    rating: 5,

    sessions: 0,

    reviews: []

});
    res.status(201).json({
      message: "Mentor profile created successfully.",
      mentor,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
});

module.exports = router;
