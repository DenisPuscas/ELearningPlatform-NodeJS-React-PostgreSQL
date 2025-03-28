import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.post('/', async (req, res) => {
    const { course_id, user_id } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO enrollment (course_id, user_id) VALUES ($1, $2) RETURNING *`,
            [course_id, user_id]
        );

        res.status(201).json({ message: 'Enrollment successful', enrollment: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'User is already enrolled in this course' });
        }
        console.error('Error enrolling user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT e.id, e.date, u.email AS student_email, c.title AS course_name
             FROM enrollment e
             JOIN users u ON e.user_id = u.id
             JOIN course c ON e.course_id = c.id`
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching enrollments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/my/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT id, course_id, enrolled_at
             FROM enrollment
             WHERE user_id = $1`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching user enrollments:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/course/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT e.id, e.course_id, e.user_id, e.enrolled_at, u.name AS student_name, u.email
             FROM enrollment e
             JOIN users u ON e.user_id = u.id
             WHERE e.course_id = $1
             ORDER BY e.enrolled_at ASC`,
            [id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error("Error fetching enrollments:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM enrollment WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        res.status(200).json({ message: 'Unenrolled successfully' });
    } catch (err) {
        console.error('Error unenrolling user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
