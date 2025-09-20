import dotenv from "dotenv";
dotenv.config();
import pool from "../db/db.js";

async function testConnection() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected:", res.rows[0]);
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await pool.end(); // ensure pool closes properly
  }
}

testConnection();

/* 
HOW TO RUN

node src/api_migration/migrateQuestions.js

*/
