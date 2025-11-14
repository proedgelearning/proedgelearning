import { pool } from "../config/db.js";

export const saveStudent = async (req, res) => {
  try {
    const data = req.body || {};

    // Normalize common variants -> canonical snake_case names used in DB
    const normalized = {
      full_name:
        data.full_name ??
        data.fullName ??
        data.full_Name ??
        data.fullname ??
        data.fullname, // fallback
      dob: data.dob ?? data.DOB ?? null,
      gender: data.gender ?? null,
      contact: data.contact ?? data.phone ?? data.mobile ?? null,
      email: data.email ?? null,
      address: data.address ?? data.addr ?? null,
      education_level:
        data.education_level ?? data.educationLevel ?? data.education ?? null,
      school: data.school ?? null,
      board: data.board ?? null,
      subjects: data.subjects ?? null,
      preferred_courses:
        data.preferred_courses ?? data.preferredCourses ?? null,
      other_course: data.other_course ?? data.otherCourse ?? null,
      batch_timing: data.batch_timing ?? data.batchTiming ?? null,
      emergency_name: data.emergency_name ?? data.emergencyName ?? null,
      emergency_relation:
        data.emergency_relation ?? data.emergencyRelation ?? null,
      emergency_phone:
        data.emergency_phone ?? data.emergencyPhone ?? data.emergency_phone ?? null,
    };

    // Required fields (use canonical names)
    const required = ["full_name", "dob", "gender", "contact", "email"];
    const missing = required.filter((f) => {
      const v = normalized[f];
      return v === undefined || v === null || String(v).trim() === "";
    });

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields (normalized names)",
        missing,
        normalized_example: normalized, // helpful for debugging
      });
    }

    // Columns and values in the order we want to insert
    const columns = [
      "full_name",
      "dob",
      "gender",
      "contact",
      "email",
      "address",
      "education_level",
      "school",
      "board",
      "subjects",
      "preferred_courses",
      "other_course",
      "batch_timing",
      "emergency_name",
      "emergency_relation",
      "emergency_phone",
    ];

    const values = columns.map((c) => normalized[c] ?? null);

    // Build placeholders $1..$N
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO students (${columns.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);

    return res.status(201).json({
      success: true,
      student: rows[0],
    });
  } catch (err) {
    console.error("❌ DB ERROR (saveStudent):", err);
    return res.status(500).json({
      success: false,
      error: "Database error",
      details: err.message,
    });
  }
};
