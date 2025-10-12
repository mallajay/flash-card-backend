import pool from "../db/db.js";

export const FilterRepository = {
  create: async ({ name, description, filters, created_by, filter_type }) => {
    const result = await pool.query(
      `INSERT INTO saved_filters (name, description, filters, created_by, filter_type)
       VALUES ($1, $2, $3::jsonb, $4, $5) RETURNING *`,
      [
        name,
        description,
        JSON.stringify(filters),
        created_by ?? null,
        filter_type || "Custom",
      ]
    );
    return result.rows[0];
  },

  findAll: async () => {
    const result = await pool.query(
      `SELECT * FROM saved_filters ORDER BY created_at DESC`
    );
    return result.rows;
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT filters FROM saved_filters WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  update: async (id, { name, description, filters, filter_type }) => {
    const result = await pool.query(
      `UPDATE saved_filters
       SET 
         name = COALESCE($2, name),
         description = COALESCE($3, description),
         filters = COALESCE($4::jsonb, filters),
         filter_type = COALESCE($5, filter_type)
       WHERE id = $1
       RETURNING *`,
      [id, name, description, JSON.stringify(filters), filter_type]
    );
    return result.rows[0];
  },

  delete: async (id) => {
    const result = await pool.query(
      `DELETE FROM saved_filters WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },
};
