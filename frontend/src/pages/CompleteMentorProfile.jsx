import { useState } from "react";
import { mentorAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CompleteMentorProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    bio: "",
    university: "",
    degree: "",
    graduationYear: "",
    skills: "",
    github: "",
    linkedin: "",
    price: "Free",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);

  try {
    const payload = {
      ...formData,

      graduationYear: Number(formData.graduationYear),

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    const response = await mentorAPI.createProfile(payload);

    alert(response.message);

    navigate("/mentors");

  } catch (err) {
    alert(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">

        <h1 className="text-3xl font-bold mb-6">
          Complete Mentor Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            name="role"
            placeholder="Professional Role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <textarea
            name="bio"
            rows="5"
            placeholder="Tell students about yourself"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="university"
            placeholder="University"
            value={formData.university}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
            required
          />

          <input
            name="degree"
            placeholder="Degree"
            value={formData.degree}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="number"
            name="graduationYear"
            placeholder="Graduation Year"
            value={formData.graduationYear}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            name="github"
            placeholder="GitHub URL"
            value={formData.github}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <input
            name="linkedin"
            placeholder="LinkedIn URL"
            value={formData.linkedin}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          />

          <select
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border rounded-lg p-3"
          >
            <option value="Free">Free</option>
            <option value="500 PKR">500 PKR</option>
            <option value="1000 PKR">1000 PKR</option>
          </select>

          <button
  type="submit"
  disabled={loading}
  className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
    loading
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-orange-500 hover:bg-orange-600"
  }`}
>
  {loading ? "Saving Profile..." : "Create Mentor Profile"}
</button>

        </form>

      </div>
    </div>
  );
}