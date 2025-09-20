import axios from "axios";
import pool from "../db/db.js";
import { QuestionRepository } from "../repositories/question.repository.js";

function getQueryParams(url) {
  const urlObj = new URL(url);
  const params = {};
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

async function getIdByName(table, name, extraCondition = "", values = []) {
  const query = `
    SELECT id 
    FROM ${table} 
    WHERE name ~* $1 ${extraCondition} 
    LIMIT 1
  `;
  const pattern = `.*${name}.*`; // regex match like ILIKE '%name%'
  const result = await pool.query(query, [pattern, ...values]);
  return result.rows[0]?.id;
}

async function migrateQuestions(apiUrl) {
  try {
    const params = getQueryParams(apiUrl);
    const subjectName = params.subject;
    const chapterName = params.chapter;
    const topicName = params.topic;

    if (!subjectName || !chapterName || !topicName) {
      throw new Error("Missing subject, chapter, or topic in URL.");
    }

    // Fetch data
    const response = await axios.get(apiUrl);
    const oldQuestions = response.data.questions;
    if (!oldQuestions?.length) {
      console.log(`No questions found for: ${topicName}`);
      return;
    }

    // Get IDs from new DB
    const subjectId = await getIdByName("subjects", subjectName);
    if (!subjectId) throw new Error(`Subject "${subjectName}" not found`);

    const chapterId = await getIdByName(
      "chapters",
      chapterName,
      "AND subject_id = $2",
      [subjectId]
    );
    if (!chapterId) throw new Error(`Chapter "${chapterName}" not found`);

    console.log("chapterId", chapterId);

    const topicId = await getIdByName(
      "chapter_topic",
      topicName,
      "AND chapter_id = $2",
      [chapterId]
    );
    if (!topicId) throw new Error(`Topic "${topicName}" not found`);

    // Insert questions
    for (const q of oldQuestions) {
      await QuestionRepository.create({
        subject_id: subjectId,
        chapter_id: chapterId,
        topic_id: topicId,
        subtopic: q.subtopic || null,
        question: q.question,
        explanation: q.explanation || null,
        type: q.type,
        difficulty: q.difficulty || null,
        options: q.options,
        supporting_picture: q.supporting_picture || null,
      });
    }

    console.log(
      `✅ Migrated ${oldQuestions.length} Qs for topic: ${topicName}`
    );
  } catch (err) {
    console.error("❌ Error migrating:", err.message);
  }
}

async function runBatchMigration() {
  const baseUrl =
    "https://us-central1-preptrack-eddec.cloudfunctions.net/api/api/practice/questions";

  const subject = "Biology";
  const chapter = "transport in plants";

  const topics = [
    {
      name: "How do Plants Absorb Water and Water Movement up a Plant",
      limit: 54,
    },
    { name: "Imbibition", limit: 14 },
    { name: "Introduction", limit: 17 },
    { name: "Long Distance Transport of Water", limit: 13 },
    { name: "Means of Transport", limit: 48 },
    { name: "Osmosis", limit: 41 },
    { name: "Plant-Water Relations", limit: 10 },
    { name: "Plasmolysis", limit: 29 },
    { name: "Transpiration", limit: 78 },
    { name: "Uptake and Transport of Mineral Nutrients", limit: 39 },
    { name: "Water Potential", limit: 31 },
  ];
  for (const topic of topics) {
    let apiUrl = `${baseUrl}?subject=${encodeURIComponent(
      subject
    )}&chapter=${encodeURIComponent(chapter)}&topic=${encodeURIComponent(
      topic.name
    )}&page=1&limit=${topic.limit}&sortBy=latest`;

    console.log(`🚀 Fetching ${topic.name} ...`);

    // console.log("apiUrl", apiUrl);
    await migrateQuestions(apiUrl);
  }

  pool.end();
}

// Run
runBatchMigration();
