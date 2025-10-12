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

  //   // 🔎 SearchText (still name-based, makes sense for search UI)
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

  //   // ✅ Multi-select Filters (ID based now)
  //   if (filters?.subject_id?.length) {
  //     const placeholders = filters.subject_id
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`s.id IN (${placeholders})`);
  //     params.push(...filters.subject_id);
  //   }

  //   if (filters?.chapter_id?.length) {
  //     const placeholders = filters.chapter_id
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`c.id IN (${placeholders})`);
  //     params.push(...filters.chapter_id);
  //   }

  //   if (filters?.topic_id?.length) {
  //     const placeholders = filters.topic_id
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`t.id IN (${placeholders})`);
  //     params.push(...filters.topic_id);
  //   }

  //   if (filters?.type?.length) {
  //     const placeholders = filters.type
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`q.type IN (${placeholders})`);
  //     params.push(...filters.type);
  //   }

  //   if (filters?.difficulty?.length) {
  //     const placeholders = filters.difficulty
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`q.difficulty IN (${placeholders})`);
  //     params.push(...filters.difficulty);
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

  // getCount: async ({ searchText, filters }) => {
  //   const whereConditions = [];
  //   const params = [];
  //   let paramIndex = 1;

  //   // 🔎 SearchText (same as above)
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

  //   // ✅ Multi-select Filters (ID based now)
  //   if (filters?.subject_id?.length) {
  //     const placeholders = filters.subject_id
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`s.id IN (${placeholders})`);
  //     params.push(...filters.subject_id);
  //   }

  //   if (filters?.chapter_id?.length) {
  //     const placeholders = filters.chapter_id
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`c.id IN (${placeholders})`);
  //     params.push(...filters.chapter_id);
  //   }

  //   if (filters?.topic_id?.length) {
  //     const placeholders = filters.topic_id
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`t.id IN (${placeholders})`);
  //     params.push(...filters.topic_id);
  //   }

  //   if (filters?.type?.length) {
  //     const placeholders = filters.type
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`q.type IN (${placeholders})`);
  //     params.push(...filters.type);
  //   }

  //   if (filters?.difficulty?.length) {
  //     const placeholders = filters.difficulty
  //       .map(() => `$${paramIndex++}`)
  //       .join(", ");
  //     whereConditions.push(`q.difficulty IN (${placeholders})`);
  //     params.push(...filters.difficulty);
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

    // 🧠 Helper: Build dynamic WHERE clause
    const { whereClause, params } = buildWhereClause(searchText, filters);

    // 🧠 Helper: Build ORDER BY clause
    const orderBy = buildOrderBy(sortModel);

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
      LIMIT $${params.length + 1} OFFSET $${params.length + 2};
    `;

    const result = await pool.query(query, [...params, limit, offset]);
    return result.rows;
  },

  getCount: async ({ searchText, filters }) => {
    const { whereClause, params } = buildWhereClause(searchText, filters);

    const query = `
      SELECT COUNT(*) 
      FROM questions q
      JOIN subjects s ON q.subject_id = s.id
      JOIN chapters c ON q.chapter_id = c.id
      JOIN chapter_topic t ON q.topic_id = t.id
      ${whereClause};
    `;

    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count, 10);
  },
};

/* -------------------------------------------------------------------------- */
/* 🧩 Helper functions to reduce duplication & complexity                      */
/* -------------------------------------------------------------------------- */

// ✅ ORDER BY generator
function buildOrderBy(sortModel = []) {
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

  if (!sortModel?.length) return "ORDER BY q.created_at DESC";

  const clauses = sortModel.map((s) => {
    const dbCol = colMap[s.colId] || "q.created_at";
    return `${dbCol} ${s.sort?.toUpperCase() || "ASC"}`;
  });

  return `ORDER BY ${clauses.join(", ")}`;
}

// ✅ WHERE clause generator
function buildWhereClause(searchText, filters = {}) {
  const whereConditions = [];
  const params = [];
  let i = 1;

  // 🔍 Search text
  if (searchText?.trim()) {
    whereConditions.push(
      `(
        q.question ILIKE $${i}
        OR q.subtopic ILIKE $${i}
        OR q.difficulty ILIKE $${i}
        OR s.name ILIKE $${i}
        OR c.name ILIKE $${i}
        OR t.name ILIKE $${i}
      )`
    );
    params.push(`%${searchText}%`);
    i++;
  }

  // 🧮 Add dynamic filters
  const addFilter = (field) => {
    const values = filters[field];
    if (Array.isArray(values) && values.length) {
      const placeholders = values.map(() => `$${i++}`).join(", ");
      const alias =
        field === "subject_id"
          ? "s"
          : field === "chapter_id"
          ? "c"
          : field === "topic_id"
          ? "t"
          : "q";
      const col =
        ["type", "difficulty"].includes(field) && alias === "q"
          ? `q.${field}`
          : `${alias}.id`;
      whereConditions.push(`${col} IN (${placeholders})`);
      params.push(...values);
    }
  };

  // Apply all filters
  ["subject_id", "chapter_id", "topic_id", "type", "difficulty"].forEach(
    addFilter
  );

  const whereClause = whereConditions.length
    ? `WHERE ${whereConditions.join(" AND ")}`
    : "";

  return { whereClause, params };
}
