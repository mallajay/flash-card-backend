import pool from "../db/db.js";
import { Queries } from "../db/queries.js";

export const QuestionRepository = {
  create: async (data) => {
    const {
      subject_id,
      chapter_id,
      topic_id,
      subtopic,
      question,
      explanation,
      type,
      difficulty,
      options,
      supporting_picture,
    } = data;

    const result = await pool.query(Queries.questions.insert, [
      subject_id,
      chapter_id,
      topic_id,
      subtopic,
      question,
      explanation,
      type,
      difficulty,
      JSON.stringify(options), // store options as JSON
      supporting_picture,
    ]);

    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query(Queries.questions.findAll);
    return result.rows;
  },

  findByTopicId: async (topic_id) => {
    const result = await pool.query(Queries.questions.findByTopicId, [
      topic_id,
    ]);
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(Queries.questions.findById, [id]);
    return result.rows[0];
  },

  deleteById: async (id) => {
    const result = await pool.query(Queries.questions.deleteById, [id]);
    return result.rows[0];
  },

  // getPaginated: async ({ startRow, endRow, sortModel, searchText }) => {
  //   const limit = endRow - startRow;
  //   const offset = startRow;

  //   const colMap = {
  //     subject_name: "s.name",
  //     chapter_name: "c.name",
  //     topic_name: "t.name",
  //     type: "q.type",
  //     subtopic: "q.subtopic",
  //     question: "q.question",
  //     difficulty: "q.difficulty",
  //     created_at: "q.created_at",
  //   };

  //   // ✅ Sorting
  //   let orderBy = "ORDER BY q.created_at DESC";
  //   if (sortModel && sortModel.length > 0) {
  //     const clauses = sortModel.map((s) => {
  //       const dbCol = colMap[s.colId] || "q.created_at";
  //       return `${dbCol} ${s.sort.toUpperCase()}`;
  //     });
  //     orderBy = `ORDER BY ${clauses.join(", ")}`;
  //   }

  //   // ✅ Search filter
  //   const whereConditions = [];
  //   const params = [];
  //   let paramIndex = 1;

  //   if (searchText && searchText.trim() !== "") {
  //     whereConditions.push(
  //       `(
  //         q.question ILIKE $${paramIndex}
  //         OR q.subtopic ILIKE $${paramIndex}
  //         OR q.difficulty ILIKE $${paramIndex}
  //         OR s.name ILIKE $${paramIndex}
  //         OR c.name ILIKE $${paramIndex}
  //         OR t.name ILIKE $${paramIndex}
  //       )`
  //     );
  //     params.push(`%${searchText}%`);
  //     paramIndex++;
  //   }

  //   const whereClause = whereConditions.length
  //     ? `WHERE ${whereConditions.join(" AND ")}`
  //     : "";

  //   // ✅ Main query
  //   const query = `
  //     SELECT
  //       q.id,
  //       q.question,
  //       q.type,
  //       q.subtopic,
  //       q.difficulty,
  //       q.created_at,
  //       s.name AS subject_name,
  //       c.name AS chapter_name,
  //       t.name AS topic_name
  //     FROM questions q
  //     JOIN subjects s ON q.subject_id = s.id
  //     JOIN chapters c ON q.chapter_id = c.id
  //     JOIN chapter_topic t ON q.topic_id = t.id
  //     ${whereClause}
  //     ${orderBy}
  //     LIMIT $${paramIndex++} OFFSET $${paramIndex}
  //   `;

  //   const result = await pool.query(query, [...params, limit, offset]);
  //   return result.rows;
  // },

  // getCount: async ({ searchText }) => {
  //   const whereConditions = [];
  //   const params = [];
  //   let paramIndex = 1;

  //   if (searchText && searchText.trim() !== "") {
  //     whereConditions.push(
  //       `(
  //       q.question ILIKE $${paramIndex}
  //       OR q.subtopic ILIKE $${paramIndex}
  //       OR q.difficulty ILIKE $${paramIndex}
  //       OR s.name ILIKE $${paramIndex}
  //       OR c.name ILIKE $${paramIndex}
  //       OR t.name ILIKE $${paramIndex}
  //     )`
  //     );
  //     params.push(`%${searchText}%`);
  //     paramIndex++;
  //   }

  //   const whereClause = whereConditions.length
  //     ? `WHERE ${whereConditions.join(" AND ")}`
  //     : "";

  //   const result = await pool.query(
  //     `
  //   SELECT COUNT(*)
  //   FROM questions q
  //   JOIN subjects s ON q.subject_id = s.id
  //   JOIN chapters c ON q.chapter_id = c.id
  //   JOIN chapter_topic t ON q.topic_id = t.id
  //   ${whereClause}
  // `,
  //     params
  //   );

  //   return parseInt(result.rows[0].count, 10);
  // },

  // getPaginated: async ({
  //   startRow,
  //   endRow,
  //   sortModel,
  //   searchText,
  //   filters,
  // }) => {
  //   const limit = endRow - startRow;
  //   const offset = startRow;

  //   const colMap = {
  //     subject_name: "s.name",
  //     chapter_name: "c.name",
  //     topic_name: "t.name",
  //     type: "q.type",
  //     subtopic: "q.subtopic",
  //     question: "q.question",
  //     difficulty: "q.difficulty",
  //     created_at: "q.created_at",
  //   };

  //   // ✅ Sorting
  //   let orderBy = "ORDER BY q.created_at DESC";
  //   if (sortModel && sortModel.length > 0) {
  //     const clauses = sortModel.map((s) => {
  //       const dbCol = colMap[s.colId] || "q.created_at";
  //       return `${dbCol} ${s.sort.toUpperCase()}`;
  //     });
  //     orderBy = `ORDER BY ${clauses.join(", ")}`;
  //   }

  //   // ✅ Filters + Search
  //   const whereConditions = [];
  //   const params = [];
  //   let paramIndex = 1;

  //   // SearchText
  //   if (searchText && searchText.trim() !== "") {
  //     whereConditions.push(
  //       `(
  //       q.question ILIKE $${paramIndex}
  //       OR q.subtopic ILIKE $${paramIndex}
  //       OR q.difficulty ILIKE $${paramIndex}
  //       OR s.name ILIKE $${paramIndex}
  //       OR c.name ILIKE $${paramIndex}
  //       OR t.name ILIKE $${paramIndex}
  //     )`
  //     );
  //     params.push(`%${searchText}%`);
  //     paramIndex++;
  //   }

  //   // ✅ Extra Filters
  //   if (filters?.chapter_name) {
  //     whereConditions.push(`c.name = $${paramIndex}`);
  //     params.push(filters.chapter_name);
  //     paramIndex++;
  //   }

  //   if (filters?.topic_name) {
  //     whereConditions.push(`t.name = $${paramIndex}`);
  //     params.push(filters.topic_name);
  //     paramIndex++;
  //   }

  //   if (filters?.type) {
  //     whereConditions.push(`q.type = $${paramIndex}`);
  //     params.push(filters.type);
  //     paramIndex++;
  //   }

  //   if (filters?.difficulty) {
  //     whereConditions.push(`q.difficulty = $${paramIndex}`);
  //     params.push(filters.difficulty);
  //     paramIndex++;
  //   }

  //   const whereClause = whereConditions.length
  //     ? `WHERE ${whereConditions.join(" AND ")}`
  //     : "";

  //   // ✅ Main Query
  //   const query = `
  //   SELECT
  //     q.id,
  //     q.question,
  //     q.type,
  //     q.subtopic,
  //     q.difficulty,
  //     q.created_at,
  //     s.name AS subject_name,
  //     c.name AS chapter_name,
  //     t.name AS topic_name
  //   FROM questions q
  //   JOIN subjects s ON q.subject_id = s.id
  //   JOIN chapters c ON q.chapter_id = c.id
  //   JOIN chapter_topic t ON q.topic_id = t.id
  //   ${whereClause}
  //   ${orderBy}
  //   LIMIT $${paramIndex++} OFFSET $${paramIndex}
  // `;

  //   const result = await pool.query(query, [...params, limit, offset]);
  //   return result.rows;
  // },

  // // ✅ Updated getCount
  // getCount: async ({ searchText, filters }) => {
  //   const whereConditions = [];
  //   const params = [];
  //   let paramIndex = 1;

  //   // SearchText
  //   if (searchText && searchText.trim() !== "") {
  //     whereConditions.push(
  //       `(
  //       q.question ILIKE $${paramIndex}
  //       OR q.subtopic ILIKE $${paramIndex}
  //       OR q.difficulty ILIKE $${paramIndex}
  //       OR s.name ILIKE $${paramIndex}
  //       OR c.name ILIKE $${paramIndex}
  //       OR t.name ILIKE $${paramIndex}
  //     )`
  //     );
  //     params.push(`%${searchText}%`);
  //     paramIndex++;
  //   }

  //   // ✅ Extra Filters
  //   if (filters?.chapter_name) {
  //     whereConditions.push(`c.name = $${paramIndex}`);
  //     params.push(filters.chapter_name);
  //     paramIndex++;
  //   }

  //   if (filters?.topic_name) {
  //     whereConditions.push(`t.name = $${paramIndex}`);
  //     params.push(filters.topic_name);
  //     paramIndex++;
  //   }

  //   if (filters?.type) {
  //     whereConditions.push(`q.type = $${paramIndex}`);
  //     params.push(filters.type);
  //     paramIndex++;
  //   }

  //   if (filters?.difficulty) {
  //     whereConditions.push(`q.difficulty = $${paramIndex}`);
  //     params.push(filters.difficulty);
  //     paramIndex++;
  //   }

  //   const whereClause = whereConditions.length
  //     ? `WHERE ${whereConditions.join(" AND ")}`
  //     : "";

  //   const result = await pool.query(
  //     `
  //     SELECT COUNT(*)
  //     FROM questions q
  //     JOIN subjects s ON q.subject_id = s.id
  //     JOIN chapters c ON q.chapter_id = c.id
  //     JOIN chapter_topic t ON q.topic_id = t.id
  //     ${whereClause}
  //   `,
  //     params
  //   );

  //   return parseInt(result.rows[0].count, 10);
  // },

  getPaginated: async ({
    startRow,
    endRow,
    sortModel,
    searchText,
    filters,
  }) => {
    const limit = endRow - startRow;
    const offset = startRow;

    const colMap = {
      subject_name: "s.name",
      chapter_name: "c.name",
      topic_name: "t.name",
      type: "q.type",
      subtopic: "q.subtopic",
      question: "q.question",
      difficulty: "q.difficulty",
      created_at: "q.created_at",
    };

    // ✅ Sorting
    let orderBy = "ORDER BY q.created_at DESC";
    if (sortModel && sortModel.length > 0) {
      const clauses = sortModel.map((s) => {
        const dbCol = colMap[s.colId] || "q.created_at";
        return `${dbCol} ${s.sort.toUpperCase()}`;
      });
      orderBy = `ORDER BY ${clauses.join(", ")}`;
    }

    // ✅ Filters + Search
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    // SearchText
    if (searchText && searchText.trim() !== "") {
      whereConditions.push(
        `(
        q.question ILIKE $${paramIndex}
        OR q.subtopic ILIKE $${paramIndex}
        OR q.difficulty ILIKE $${paramIndex}
        OR s.name ILIKE $${paramIndex}   
        OR c.name ILIKE $${paramIndex}   
        OR t.name ILIKE $${paramIndex}   
      )`
      );
      params.push(`%${searchText}%`);
      paramIndex++;
    }

    // ✅ Multi-select Filters
    if (filters?.chapter_name?.length) {
      const placeholders = filters.chapter_name
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`c.name IN (${placeholders})`);
      params.push(...filters.chapter_name);
    }

    if (filters?.topic_name?.length) {
      const placeholders = filters.topic_name
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`t.name IN (${placeholders})`);
      params.push(...filters.topic_name);
    }

    if (filters?.type?.length) {
      const placeholders = filters.type
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`q.type IN (${placeholders})`);
      params.push(...filters.type);
    }

    if (filters?.difficulty?.length) {
      const placeholders = filters.difficulty
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`q.difficulty IN (${placeholders})`);
      params.push(...filters.difficulty);
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    // ✅ Main Query
    const query = `
    SELECT 
      q.id,
      q.question,
      q.type,
      q.subtopic,
      q.difficulty,
      q.created_at,
      s.name AS subject_name,
      c.name AS chapter_name,
      t.name AS topic_name
    FROM questions q
    JOIN subjects s ON q.subject_id = s.id
    JOIN chapters c ON q.chapter_id = c.id
    JOIN chapter_topic t ON q.topic_id = t.id
    ${whereClause}
    ${orderBy}
    LIMIT $${paramIndex++} OFFSET $${paramIndex}
  `;

    const result = await pool.query(query, [...params, limit, offset]);
    return result.rows;
  },

  // ✅ Updated getCount with Multi-select
  getCount: async ({ searchText, filters }) => {
    const whereConditions = [];
    const params = [];
    let paramIndex = 1;

    // SearchText
    if (searchText && searchText.trim() !== "") {
      whereConditions.push(
        `(
        q.question ILIKE $${paramIndex}
        OR q.subtopic ILIKE $${paramIndex}
        OR q.difficulty ILIKE $${paramIndex}
        OR s.name ILIKE $${paramIndex}
        OR c.name ILIKE $${paramIndex}
        OR t.name ILIKE $${paramIndex}
      )`
      );
      params.push(`%${searchText}%`);
      paramIndex++;
    }

    // ✅ Multi-select Filters
    if (filters?.chapter_name?.length) {
      const placeholders = filters.chapter_name
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`c.name IN (${placeholders})`);
      params.push(...filters.chapter_name);
    }

    if (filters?.topic_name?.length) {
      const placeholders = filters.topic_name
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`t.name IN (${placeholders})`);
      params.push(...filters.topic_name);
    }

    if (filters?.type?.length) {
      const placeholders = filters.type
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`q.type IN (${placeholders})`);
      params.push(...filters.type);
    }

    if (filters?.difficulty?.length) {
      const placeholders = filters.difficulty
        .map(() => `$${paramIndex++}`)
        .join(", ");
      whereConditions.push(`q.difficulty IN (${placeholders})`);
      params.push(...filters.difficulty);
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(" AND ")}`
      : "";

    const result = await pool.query(
      `
      SELECT COUNT(*) 
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      JOIN chapters c ON q.chapter_id = c.id
      JOIN chapter_topic t ON q.topic_id = t.id
      ${whereClause}
    `,
      params
    );

    return parseInt(result.rows[0].count, 10);
  },
};
