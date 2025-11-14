import { pool } from "../config/db.js";

/**
 * Save student record to the database.
 * Includes:
 * - Required field validation
 * - Safe default NULL values
 * - Detailed DB error response (temporary for debugging)
 */
export const saveStudent = async (req, res) => {
  try {
    const data = req.body || {};

    // Required fields
    const required = ["fullName", "dob", "gender", "contact", "email"];

    const missing = required.filter((f) => !data[f]);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missing,
      });
    }

    const query = `
      INSERT INTO students (
        full_name, dob, gender, contact, email, address,
        education_level, school, board, subjects,
        preferred_courses, other_course, batch_timing,
        emergency_name, emergency_relation, emergency_phone
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    `;

    const values = [
      data.fullName,
      data.dob,
      data.gender,
      data.contact,
      data.email,
      data.address || null,
      data.educationLevel || null,
      data.school || null,
      data.board || null,
      data.subjects || null,
      data.preferredCourses || null,
      data.otherCourse || null,
      data.batchTiming || null,
      data.emergencyName || null,
      data.emergencyRelation || null,
      data.emergencyPhone || null,
    ];

    await pool.query(query, values);

    return res.json({
      success: true,
      message: "Student registered successfully",
    });
  } catch (err) {
    console.error("❌ DB ERROR:", err);

    return res.status(500).json({
      error: "Database error",
      details: err.message, // <— ADDED for debugging
    });
  }
};
