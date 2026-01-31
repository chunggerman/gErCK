export default {
  testEnvironment: "node",
  transform: {},
  moduleFileExtensions: ["js", "json"],
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "gErCK Automated Test Report",
        outputPath: "tests/report.html",
        includeFailureMsg: true,
        includeConsoleLog: true,
        sort: "status"
      }
    ]
  ]
};
