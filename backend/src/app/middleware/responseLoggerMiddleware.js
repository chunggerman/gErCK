// backend/src/app/middleware/responseLoggerMiddleware.js

import fs from "fs";
import path from "path";

const logFile = path.join(
  process.cwd(),
  "tests",
  "backend-responses.json"
);

function ensureLogFile() {
  const dir = path.dirname(logFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, "[]");
  }
}

export function responseLogger(req, res, next) {
  ensureLogFile();

  const originalJson = res.json;
  const originalSend = res.send;
  const originalEnd = res.end;

  function writeLog(body) {
    try {
      const entry = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        body,
        timestamp: new Date().toISOString()
      };

      const existing = JSON.parse(fs.readFileSync(logFile, "utf8"));
      existing.push(entry);
      fs.writeFileSync(logFile, JSON.stringify(existing, null, 2));
    } catch (err) {
      console.error("Failed to log response:", err);
    }
  }

  res.json = function (body) {
    writeLog(body);
    return originalJson.call(this, body);
  };

  res.send = function (body) {
    writeLog(body);
    return originalSend.call(this, body);
  };

  res.end = function (body) {
    writeLog(body);
    return originalEnd.call(this, body);
  };

  next();
}
