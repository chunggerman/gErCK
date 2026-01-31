// backend/tests/assertDeepMatch.js

export function assertDeepMatch(expected, actual) {
  const errors = [];

  function compare(path, exp, act) {
    if (typeof exp !== "object" || exp === null) {
      if (exp !== act) {
        errors.push({
          field: path,
          expected: exp,
          actual: act
        });
      }
      return;
    }

    for (const key of Object.keys(exp)) {
      compare(`${path}.${key}`, exp[key], act[key]);
    }
  }

  compare("root", expected, actual);

  if (errors.length > 0) {
    console.error("\n❌ Validation mismatch:");
    for (const err of errors) {
      console.error(
        `  • ${err.field}\n    expected: ${err.expected}\n    actual:   ${err.actual}\n`
      );
    }
    throw new Error("Validation failed — see mismatch details above.");
  }
}
