import pool from "./db.js";

export async function initDB() {
  try {
    // 1️⃣ Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2️⃣ Posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3️⃣ Comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS subjects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE, 
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chapters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id UUID NOT NULL,
        name VARCHAR(150) NOT NULL,
        code VARCHAR(50) NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
        
        CONSTRAINT fk_subject
          FOREIGN KEY (subject_id) 
          REFERENCES subjects(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,

        CONSTRAINT unique_subject_chapter UNIQUE (subject_id, code) -- avoid duplicate chapter code per subject
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS chapter_topic (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id UUID NOT NULL,
        chapter_id UUID NOT NULL,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,

        CONSTRAINT fk_topic_subject
          FOREIGN KEY (subject_id)
          REFERENCES subjects(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,

        CONSTRAINT fk_topic_chapter
          FOREIGN KEY (chapter_id)
          REFERENCES chapters(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,

        CONSTRAINT unique_chapter_topic UNIQUE (chapter_id, name) -- avoid duplicate topic name per chapter
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id UUID NOT NULL,
        chapter_id UUID NOT NULL,
        topic_id UUID NOT NULL,
        subtopic VARCHAR(200),
        question TEXT NOT NULL,
        explanation TEXT,
        type VARCHAR(100) NOT NULL, -- e.g., 'Match the following'
        difficulty VARCHAR(50), -- e.g., 'Medium'
        options JSONB NOT NULL, -- store options as JSON array
        supporting_picture TEXT, -- URL or path to image if any
        created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,
        updated_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT,

        -- Foreign keys
        CONSTRAINT fk_question_subject
            FOREIGN KEY (subject_id)
            REFERENCES subjects(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

        CONSTRAINT fk_question_chapter
            FOREIGN KEY (chapter_id)
            REFERENCES chapters(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE,

        CONSTRAINT fk_question_topic
            FOREIGN KEY (topic_id)
            REFERENCES chapter_topic(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE
    );
    `);

    await pool.query(`
          CREATE TABLE IF NOT EXISTS saved_filters (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(150) NOT NULL,
                description TEXT,
                filters JSONB NOT NULL, 
                filter_type VARCHAR(20) NOT NULL DEFAULT 'Custom',
                created_by INT,
                created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM now()) * 1000)::BIGINT
            );
      `);

    console.log("✅ All tables ensured (users, posts, comments)");
  } catch (err) {
    console.error("❌ Error initializing database", err);
    process.exit(1);
  }
}
