/**
 * Subject Controller
 * Handles listing and creating subjects for resource uploads.
 */

const { pool } = require('../config/db');
const {
  validateCreateSubjectInput,
  validateSubjectListQuery,
} = require('../utils/validateSubject');

const toSubjectResponse = (row) => ({
  id: row.id,
  name: row.name,
  branch: row.branch,
  semester: row.semester,
  created_at: row.created_at,
});

/**
 * GET /api/subjects
 * List subjects filtered by branch and semester.
 * Public route.
 */
const getSubjects = async (req, res, next) => {
  try {
    const parsed = validateSubjectListQuery(req.query);

    if (!parsed.isValid) {
      return res.status(400).json({
        success: false,
        message: parsed.message,
      });
    }

    const { branch, semester } = parsed.filters;

    const [rows] = await pool.execute(
      `SELECT id, name, branch, semester, created_at
       FROM subjects
       WHERE branch = ? AND semester = ?
       ORDER BY name ASC`,
      [branch, semester]
    );

    return res.status(200).json({
      success: true,
      count: rows.length,
      subjects: rows.map(toSubjectResponse),
    });
  } catch (error) {
    console.error('Failed to fetch subjects:', error.message);
    next(error);
  }
};

/**
 * POST /api/subjects
 * Create a new subject when the user selects "Other".
 * Protected route.
 */
const createSubject = async (req, res, next) => {
  try {
    const validation = validateCreateSubjectInput(req.body);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
        errors: validation.errors,
      });
    }

    const { name, branch, semester } = validation.data;

    const [existing] = await pool.execute(
      `SELECT id, name, branch, semester, created_at
       FROM subjects
       WHERE name = ? AND branch = ? AND semester = ?
       LIMIT 1`,
      [name, branch, semester]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Subject already exists.',
        subject: toSubjectResponse(existing[0]),
      });
    }

    const [result] = await pool.execute(
      'INSERT INTO subjects (name, branch, semester) VALUES (?, ?, ?)',
      [name, branch, semester]
    );

    const [rows] = await pool.execute(
      'SELECT id, name, branch, semester, created_at FROM subjects WHERE id = ? LIMIT 1',
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: 'Subject created successfully.',
      subject: toSubjectResponse(rows[0]),
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      const [rows] = await pool.execute(
        `SELECT id, name, branch, semester, created_at
         FROM subjects
         WHERE name = ? AND branch = ? AND semester = ?
         LIMIT 1`,
        [req.body.name?.trim(), req.body.branch?.trim(), req.body.semester]
      );

      if (rows.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Subject already exists.',
          subject: toSubjectResponse(rows[0]),
        });
      }
    }

    console.error('Failed to create subject:', error.message);
    next(error);
  }
};

module.exports = { getSubjects, createSubject };
