import { Router } from 'express';
import pool from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
      const query = `
        SELECT 
          c.id AS course_id,
          c.title,
          c.description,
          c.category,
          c.language,
          c.price,
          c.discount,
          lc.id AS live_course_id,
          lc.start_date,
          lc.end_date,
          lc.sessions,
          lc.available_seats,
          spc.id AS self_paced_course_id,
          spc.duration,
          spc.lessons
        FROM course c
        LEFT JOIN live_course lc ON c.id = lc.course_id
        LEFT JOIN self_paced_course spc ON c.id = spc.course_id
        ORDER BY c.id;
      `;
  
      const result = await pool.query(query);
      const coursesWithLiveStatus = result.rows.map(course => {
        const is_live = course.live_course_id !== null;
        return { ...course, is_live };
      });
      res.json(coursesWithLiveStatus);

    } catch (err) {
      console.error('Error fetching courses:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  router.get('/id/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const query = `
        SELECT 
          c.id AS course_id,
          c.title,
          c.description,
          c.category,
          c.language,
          c.price,
          c.discount,
          lc.id AS live_course_id,
          lc.start_date,
          lc.end_date,
          lc.sessions,
          lc.available_seats,
          spc.id AS self_paced_course_id,
          spc.duration,
          spc.lessons
        FROM course c
        LEFT JOIN live_course lc ON c.id = lc.course_id
        LEFT JOIN self_paced_course spc ON c.id = spc.course_id
        WHERE c.id = $1
        `;

        const result = await pool.query(query, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const course = result.rows[0];
        course.is_live = course.live_course_id !== null;
        res.json(course);

    } catch (err) {
        console.error('Error fetching course by ID:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/live', async (req, res) => {
  try {
      const query = `
      SELECT 
        c.id AS course_id,
        c.title,
        c.description,
        c.category,
        c.language,
        c.price,
        c.discount,
        lc.id AS live_course_id,
        lc.start_date,
        lc.end_date,
        lc.sessions,
        lc.available_seats
      FROM course c
      INNER JOIN live_course lc ON c.id = lc.course_id
      ORDER BY c.id;
    `;

      const result = await pool.query(query);
      const liveCourses = result.rows.map(course => ({...course, is_live: true}));
      res.json(liveCourses);
    
  } catch (err) {
      console.error('Error fetching live courses:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/selfpaced', async (req, res) => {
  try {
      const query = `
      SELECT 
        c.id AS course_id,
        c.title,
        c.description,
        c.category,
        c.language,
        c.price,
        c.discount,
        spc.id AS self_paced_course_id,
        spc.duration,
        spc.lessons
      FROM course c
      INNER JOIN self_paced_course spc ON c.id = spc.course_id
      ORDER BY c.id;
    `;

      const result = await pool.query(query);
      const selfPacedCourses = result.rows.map(course => ({...course, is_live: false}));
      res.json(selfPacedCourses);

  } catch (err) {
      console.error('Error fetching self-paced courses:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/offers', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id AS course_id,
        c.title,
        c.description,
        c.category,
        c.language,
        c.price,
        c.discount,
        lc.id AS live_course_id,
        lc.start_date,
        lc.end_date,
        lc.sessions,
        lc.available_seats,
        spc.id AS self_paced_course_id,
        spc.duration,
        spc.lessons
      FROM course c
      LEFT JOIN live_course lc ON c.id = lc.course_id
      LEFT JOIN self_paced_course spc ON c.id = spc.course_id
      WHERE c.discount IS NOT NULL
      ORDER BY c.id;
    `;

    const result = await pool.query(query);
    const coursesWithLiveStatus = result.rows.map(course => {
      const is_live = course.live_course_id !== null;
      return { ...course, is_live };
    });
    res.json(coursesWithLiveStatus);

  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).send('Internal Server Error');
  }
});


router.get('/category/:category', async (req, res) => {
  try {
      const { category } = req.params;

      const query = `
      SELECT 
        c.id AS course_id,
        c.title,
        c.description,
        c.category,
        c.language,
        c.price,
        c.discount,
        lc.id AS live_course_id,
        lc.start_date,
        lc.end_date,
        lc.sessions,
        lc.available_seats,
        spc.id AS self_paced_course_id,
        spc.duration,
        spc.lessons
      FROM course c
      LEFT JOIN live_course lc ON c.id = lc.course_id
      LEFT JOIN self_paced_course spc ON c.id = spc.course_id
      WHERE c.category = $1
      ORDER BY c.id;
    `;

      const result = await pool.query(query, [category]);
      const coursesWithLiveStatus = result.rows.map(course => {
        const is_live = course.live_course_id !== null;
        return { ...course, is_live };
      });
      res.json(coursesWithLiveStatus);

  } catch (err) {
      console.error('Error fetching courses by category:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.get('/search', async (req, res) => {
  try {
      const { query } = req.query;

      if (!query) {
          return res.status(400).json({ error: 'Search query is required' });
      }

      const searchQuery = `
          SELECT 
              c.id AS course_id,
              c.title,
              c.description,
              c.category,
              c.language,
              c.price,
              c.discount,
              lc.id AS live_course_id,
              lc.start_date,
              lc.end_date,
              lc.sessions,
              lc.available_seats,
              spc.id AS self_paced_course_id,
              spc.duration,
              spc.lessons
          FROM course c
          LEFT JOIN live_course lc ON c.id = lc.course_id
          LEFT JOIN self_paced_course spc ON c.id = spc.course_id
          WHERE 
              LOWER(c.title) LIKE LOWER($1) OR
              LOWER(c.description) LIKE LOWER($1) OR
              LOWER(c.category) LIKE LOWER($1)
          ORDER BY c.id;
      `;

      const result = await pool.query(searchQuery, [`%${query}%`]);
      
      if (result.rows.length === 0) {
          return res.json(result.rows);
      }
      const coursesWithLiveStatus = result.rows.map(course => {
        const is_live = course.live_course_id !== null;
        return { ...course, is_live };
      });
      res.json(coursesWithLiveStatus);
  } catch (err) {
      console.error('Error searching courses:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.post('/', async (req, res) => {
  try {
      const {
          title,
          description,
          category,
          language,
          price,
          discount,
          is_live,
          start_date,
          end_date,
          sessions,
          available_seats,
          duration,
          lessons
      } = req.body;

      if (!title || !description || !category || !language || !price) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const courseResult = await pool.query(
          `INSERT INTO course (title, description, category, language, price, discount) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [title, description, category, language, price, discount || null]
      );

      const courseId = courseResult.rows[0].id;

      if (is_live) {
          await pool.query(
              `INSERT INTO live_course (course_id, start_date, end_date, sessions, available_seats) 
               VALUES ($1, $2, $3, $4, $5)`,
              [courseId, start_date, end_date, sessions, available_seats]
          );
      } else {
          await pool.query(
              `INSERT INTO self_paced_course (course_id, duration, lessons) 
               VALUES ($1, $2, $3)`,
              [courseId, duration, lessons]
          );
      }

      res.status(201).json({ message: 'Course created successfully', courseId });
  } catch (err) {
      console.error('Error creating course:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.put('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const {
          title,
          description,
          category,
          language,
          price,
          discount,
          is_live,
          start_date,
          end_date,
          sessions,
          available_seats,
          duration,
          lessons
      } = req.body;

      await pool.query(
          `UPDATE course 
           SET title = $1, description = $2, category = $3, language = $4, price = $5, discount = $6
           WHERE id = $7`,
          [title, description, category, language, price, discount, id]
      );

      if (is_live) {
          await pool.query(
              `INSERT INTO live_course (course_id, start_date, end_date, sessions, available_seats) 
               VALUES ($1, $2, $3, $4, $5)
               ON CONFLICT (course_id) 
               DO UPDATE SET start_date = $2, end_date = $3, sessions = $4, available_seats = $5`,
              [id, start_date, end_date, sessions, available_seats]
          );

          await pool.query('DELETE FROM self_paced_course WHERE course_id = $1', [id]);
      } else {
          await pool.query(
              `INSERT INTO self_paced_course (course_id, duration, lessons) 
               VALUES ($1, $2, $3)
               ON CONFLICT (course_id) 
               DO UPDATE SET duration = $2, lessons = $3`,
              [id, duration, lessons]
          );

          await pool.query('DELETE FROM live_course WHERE course_id = $1', [id]);
      }

      res.json({ message: 'Course updated successfully' });
  } catch (err) {
      console.error('Error updating course:', err);
      res.status(500).send('Internal Server Error');
  }
});

router.put('/seats/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { available_seats } = req.body;

      await pool.query(
          `UPDATE live_course SET available_seats = $1 WHERE course_id = $2`,
          [available_seats, id]
      );
      res.status(200).send({ message: 'Course seats updated successfully' });
  } catch (error) {
      console.error('Error updating course seats', error);
      res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params;

      await pool.query('DELETE FROM live_course WHERE course_id = $1', [id]);
      await pool.query('DELETE FROM self_paced_course WHERE course_id = $1', [id]);

      const deleteResult = await pool.query('DELETE FROM course WHERE id = $1 RETURNING *', [id]);

      if (deleteResult.rowCount === 0) {
          return res.status(404).json({ error: 'Course not found' });
      }

      res.json({ message: 'Course deleted successfully' });
  } catch (err) {
      console.error('Error deleting course:', err);
      res.status(500).send('Internal Server Error');
  }
});

export default router;
