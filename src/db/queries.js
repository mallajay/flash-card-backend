export const Queries = {
  users: {
    insert: "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    findAll: "SELECT * FROM users",
    findById: "SELECT * FROM users WHERE id=$1",
    update: "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
    delete: "DELETE FROM users WHERE id=$1 RETURNING *",
  },

  subjects: {
    insert: `
      INSERT INTO subjects (name, code, description, is_active)
      VALUES ($1, $2, $3, COALESCE($4, TRUE))
      RETURNING *
    `,
    findAll: "SELECT * FROM subjects",
    findById: "SELECT * FROM subjects WHERE id=$1",
    update: `
      UPDATE subjects
      SET name=$1, code=$2, description=$3, is_active=$4, updated_at=(extract(epoch from now())*1000)::bigint
      WHERE id=$5
      RETURNING *
    `,
    delete: "DELETE FROM subjects WHERE id=$1 RETURNING *",
  },

  chapters: {
    insert: `INSERT INTO chapters (subject_id, name, code, description, is_active) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    findAll: `SELECT c.*, s.name as subject_name 
              FROM chapters c 
              JOIN subjects s ON c.subject_id = s.id
              ORDER BY c.created_at DESC`,
    findById: `SELECT c.*, s.name as subject_name 
               FROM chapters c 
               JOIN subjects s ON c.subject_id = s.id
               WHERE c.id=$1`,
    update: `UPDATE chapters 
             SET subject_id=$1, name=$2, code=$3, description=$4, is_active=$5,
                 updated_at=(EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
             WHERE id=$6 RETURNING *`,
    delete: "DELETE FROM chapters WHERE id=$1 RETURNING *",

    findBySubjectId: `SELECT 
              c.*,
              s.name AS subject_name
          FROM chapters c
          JOIN subjects s ON c.subject_id = s.id
          WHERE c.subject_id = $1
          ORDER BY c.created_at DESC;
        `,
  },

  chapter_topic: {
    insert: `
      INSERT INTO chapter_topic (subject_id, chapter_id, name, description, is_active)
      VALUES ($1, $2, $3, $4, COALESCE($5, TRUE))
      RETURNING *
    `,
    bulkInsert: (payload) => {
      const { subject_id, chapter_id, data } = payload;
      if (!data || !data.length) return { text: "", values: [] };

      const values = [];
      const params = [];
      let idx = 1;

      data.forEach((topic) => {
        values.push(`($${idx++}, $${idx++}, $${idx++}, NULL, TRUE)`); // description = NULL, is_active = TRUE
        params.push(subject_id, chapter_id, topic.name);
      });

      return {
        text: `INSERT INTO chapter_topic (subject_id, chapter_id, name, description, is_active) VALUES ${values.join(
          ", "
        )} RETURNING *`,
        values: params,
      };
    },

    findAll: `SELECT * FROM chapter_topic ORDER BY created_at DESC;`,

    findAllWithDetails: `
        SELECT  
            c.subject_id,
            s.name AS subject_name,
            ct.chapter_id,
            c.name as chapter_name,
            ct.id AS topic_id,
            ct.name AS topic_name,
            ct.description,
            ct.created_at,
            ct.updated_at
        FROM chapter_topic ct
        JOIN chapters c ON ct.chapter_id = c.id
        JOIN subjects s ON ct.subject_id = s.id
        ORDER BY ct.chapter_id, ct.created_at DESC;
    `,

    findById: `SELECT * FROM chapter_topic WHERE id=$1`,
    update: `
      UPDATE chapter_topic 
      SET subject_id=$1, chapter_id=$2, name=$3, description=$4, is_active=$5, 
          updated_at=(EXTRACT(EPOCH FROM now())*1000)::BIGINT
      WHERE id=$6
      RETURNING *
    `,
    delete: `DELETE FROM chapter_topic WHERE id=$1 RETURNING *`,
    findByChapterId: `
      SELECT ct.*, c.name AS chapter_name, s.name AS subject_name
      FROM chapter_topic ct
      JOIN chapters c ON ct.chapter_id = c.id
      JOIN subjects s ON ct.subject_id = s.id
      WHERE ct.chapter_id=$1
      ORDER BY ct.created_at DESC
    `,
    findBySubjectId: `
      SELECT ct.*, c.name AS chapter_name, s.name AS subject_name
      FROM chapter_topic ct
      JOIN chapters c ON ct.chapter_id = c.id
      JOIN subjects s ON ct.subject_id = s.id
      WHERE ct.subject_id=$1
      ORDER BY ct.created_at DESC
    `,
    findGroupedByChapter: `
        SELECT 
          c.id AS chapter_id,
          c.name AS chapter_name,
          s.id AS subject_id,
          s.name AS subject_name,
          COALESCE(
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', t.id,
                  'name', t.name
                ) ORDER BY t.name
              ) FILTER (WHERE t.id IS NOT NULL), '[]'   
          ) AS topics
        FROM chapters c
        JOIN subjects s ON c.subject_id = s.id
        LEFT JOIN chapter_topic t ON t.chapter_id = c.id
        WHERE c.is_active = TRUE AND c.id = $1
        GROUP BY c.id, c.name, s.id, s.name
        ORDER BY c.name;
      `,
  },

  questions: {
    insert: `
      INSERT INTO questions 
      (subject_id, chapter_id, topic_id, subtopic, question, explanation, type, difficulty, options, supporting_picture)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)
      RETURNING *;
    `,
    findAll: "SELECT * FROM questions",
    findByTopicId: `
      SELECT * FROM questions
      WHERE topic_id = $1
      ORDER BY created_at DESC;
    `,
    findById: `
      SELECT * FROM questions
      WHERE id = $1;
    `,
    deleteById: `
      DELETE FROM questions
      WHERE id = $1
      RETURNING *;
    `,
  },
};
