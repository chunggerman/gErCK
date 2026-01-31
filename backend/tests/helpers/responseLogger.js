import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "backend/tests/test-responses.json");

export function logResponse(testName, response) {
  const entry = {
    test: testName,
    status: response.status,
    body: response.body,
    timestamp: new Date().toISOString()
  };

  let existing = [];
  if (fs.existsSync(logFile)) {
    existing = JSON.parse(fs.readFileSync(logFile, "utf8"));
  }

  existing.push(entry);
  fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));
}
