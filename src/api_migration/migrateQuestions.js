import axios from "axios";
import pool from "../db/db.js";
// import { QuestionRepository } from "../repositories/question.repository.js";

/**
 * Utility to get ID from a table by name
 */
async function getIdByName(table, name, extraCondition = "", values = []) {
  const query = `
    SELECT id 
    FROM ${table} 
    WHERE name ~* $1 ${extraCondition} 
    LIMIT 1
  `;
  // Use regex-safe pattern: match anywhere in the string
  const pattern = `.*${name}.*`;
  const result = await pool.query(query, [pattern, ...values]);
  return result.rows[0]?.id;
}

// async function getIdByName(table, name, extraCondition = "", values = []) {
//   const query = `
//     SELECT id
//     FROM ${table}
//     WHERE name ILIKE $1 ${extraCondition}
//     LIMIT 1
//   `;
//   const result = await pool.query(query, [name, ...values]);
//   return result.rows[0]?.id;
// }

/**
 * Extract query params from a URL
 */
function getQueryParams(url) {
  const urlObj = new URL(url);
  const params = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

async function migrateQuestions(apiUrl) {
  try {
    const params = getQueryParams(apiUrl);
    const subjectName = params.subject;
    const chapterName = params.chapter;
    const topicName = params.topic;

    if (!subjectName || !chapterName || !topicName) {
      throw new Error("Subject, chapter, or topic missing in URL.");
    }

    // Fetch questions
    const response = await axios.get(apiUrl);
    const oldQuestions = response.data.questions;
    if (!oldQuestions?.length) return console.log("No questions found.");

    // Get IDs safely
    const subjectId = await getIdByName("subjects", subjectName);
    if (!subjectId) throw new Error(`Subject "${subjectName}" not found`);

    const chapterId = await getIdByName(
      "chapters",
      chapterName,
      "AND subject_id = $2",
      [subjectId]
    );
    if (!chapterId) throw new Error(`Chapter "${chapterName}" not found`);

    const topicId = await getIdByName(
      "chapter_topic",
      topicName,
      "AND chapter_id = $2",
      [chapterId]
    );
    if (!topicId) throw new Error(`Topic "${topicName}" not found`);

    console.log({
      subject_id: subjectId,
      chapter_id: chapterId,
      topic_id: topicId,
    });

    // Insert questions
    // for (const q of oldQuestions) {
    //   await QuestionRepository.create({
    //     subject_id: subjectId,
    //     chapter_id: chapterId,
    //     topic_id: topicId,
    //     subtopic: q.subtopic || null,
    //     question: q.question,
    //     explanation: q.explanation || null,
    //     type: q.type,
    //     difficulty: q.difficulty || null,
    //     options: q.options,
    //     supporting_picture: q.supporting_picture || null,
    //   });
    //   console.log(`Inserted question: ${q.id}`);
    // }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Error migrating questions:", err);
  } finally {
    pool.end();
  }
}

const apiUrl =
  "https://us-central1-preptrack-eddec.cloudfunctions.net/api/api/practice/questions?subject=Biology&chapter=Anatomy+Of+Flowering+Plants&topic=The+Tissue+System&page=1&limit=64&sortBy=latest";
migrateQuestions(apiUrl);
