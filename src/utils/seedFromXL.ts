import XLSX from "xlsx";
import fs from "fs";
import mongoose from "mongoose";

// Load workbook
const workbook = XLSX.readFile("./All Grades Curriculum.xlsx");

// Output arrays
const gradeSubjects: any[] = [];
const topics: any[] = [];
const subtopics: any[] = [];

// Helper to generate random ObjectId
const randomId = () => new mongoose.Types.ObjectId();

// Grade list
const gradesList = [
  "Pre-K",
  "KG",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Career Progression",
];

// Map to store grade name → ObjectId
const gradeIdMap: Record<string, mongoose.Types.ObjectId> = {};

// Regex to extract topic number if present
const topicNumberRegex = /^(\d+)\.\s*(.*)$/;

// Process each sheet
workbook.SheetNames.forEach((sheetName) => {
  // Find grade
  const grade =
    gradesList.find((g) => sheetName.startsWith(g)) || "Unknown Grade";
  const subject = sheetName.replace(grade, "").trim();

  // Add grade if not exists
  if (!gradeIdMap[grade]) {
    gradeIdMap[grade] = randomId();
    gradeSubjects.push({
      _id: gradeIdMap[grade],
      name: grade,
      subjects: [],
    });
  }

  const gradeObj = gradeSubjects.find((g) => g._id.equals(gradeIdMap[grade]));
  if (subject && !gradeObj.subjects.includes(subject)) {
    gradeObj.subjects.push(subject);
  }

  // Extract sheet data
  const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  sheet.forEach((row: any) => {
    let topicName = row.Topic || "";
    let sequence: number | null = null;

    // Extract number prefix if exists
    const match = topicNumberRegex.exec(topicName);
    if (match) {
      sequence = parseInt(match[1], 10);
      topicName = match[2].trim();
    }

    if (topicName) {
      const topicId = randomId();
      topics.push({
        _id: topicId,
        topicName,
        sequence,
        gradeId: gradeIdMap[grade],
        subject,
      });
      // Function to split by comma but ignore commas inside brackets
      function splitSubtopics(subtopicsField: string) {
        const result: string[] = [];
        let current = "";
        let depth = 0; // parentheses depth

        for (let i = 0; i < subtopicsField.length; i++) {
          const char = subtopicsField[i];
          const nextChar =
            i < subtopicsField.length - 1 ? subtopicsField[i + 1] : "";

          // Track parentheses
          if (char === "(") depth++;
          if (char === ")") depth--;

          // Split on semicolon always
          if (char === ";") {
            if (current.trim()) result.push(current.trim());
            current = "";
            continue;
          }

          // Split on comma only if:
          // - outside parentheses AND
          // - not part of a number (digit before and after comma)
          if (
            char === "," &&
            depth === 0 &&
            !(/\d/.test(subtopicsField[i - 1]) && /\d/.test(nextChar))
          ) {
            if (current.trim()) result.push(current.trim());
            current = "";
            continue;
          }

          current += char;
        }

        if (current.trim()) result.push(current.trim());
        return result;
      }

      const subtopicsField = row.Subtopics || "";
      const subtopicNames = splitSubtopics(subtopicsField).filter(Boolean);
      subtopicNames.forEach((subTopicName) => {
        subtopics.push({
          _id: randomId(),
          subTopicName,
          topicId,
        });
      });
    }
  });
});

// Save JSON files
fs.writeFileSync("gradeSubjects.json", JSON.stringify(gradeSubjects, null, 2));
fs.writeFileSync("topics.json", JSON.stringify(topics, null, 2));
fs.writeFileSync("subtopics.json", JSON.stringify(subtopics, null, 2));

console.log(
  "gradeSubjects.json, topics.json, and subtopics.json generated successfully!"
);
