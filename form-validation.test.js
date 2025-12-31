/**
 * Unit tests for contact form validation logic
 * Run with: npm test or node form-validation.test.js (if using a test runner)
 */

// Mock DOM elements
const createMockForm = () => {
  const form = {
    name: { value: "" },
    email: { value: "" },
    date: { value: "" },
    budget: { value: "" },
    message: { value: "" },
    querySelector: jest.fn(),
  };
  return form;
};

// Validation functions extracted from script.js
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const validateName = (name) => {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: "Please share your name." };
  }
  return { valid: true, error: "" };
};

const validateEmail = (email) => {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: "An email address helps us write back." };
  }
  if (!validEmail(trimmed)) {
    return { valid: false, error: "Please enter a valid email." };
  }
  return { valid: true, error: "" };
};

const validateWeddingDate = (date) => {
  if (!date) {
    return { valid: false, error: "Please provide your wedding date." };
  }
  const weddingDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (weddingDate <= today) {
    return { valid: false, error: "Wedding date must be in the future." };
  }
  return { valid: true, error: "" };
};

const validateInvitationDropDate = (date) => {
  if (!date) {
    return {
      valid: false,
      error: "Please provide the invitation drop date.",
    };
  }
  const dropDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dropDate <= today) {
    return {
      valid: false,
      error: "Invitation drop date must be in the future.",
    };
  }
  return { valid: true, error: "" };
};

const validateBudget = (budget) => {
  const budgetNum = budget ? parseFloat(budget) : null;
  if (budgetNum === null || isNaN(budgetNum)) {
    return { valid: false, error: "Please enter a valid budget amount." };
  }
  if (budgetNum < 3000) {
    return {
      valid: false,
      error: "The minimum investment for working with us is $3,000.",
    };
  }
  return { valid: true, error: "" };
};

const validateInvitationCount = (count) => {
  const countNum = count ? parseInt(count) : null;
  if (countNum === null || isNaN(countNum) || countNum < 1) {
    return {
      valid: false,
      error: "Please enter a valid number of invitations (at least 1).",
    };
  }
  return { valid: true, error: "" };
};

const validateMessage = (message) => {
  const trimmed = message.trim();
  if (!trimmed) {
    return {
      valid: false,
      error: "Please share additional details about your event.",
    };
  }
  return { valid: true, error: "" };
};

// Test Suite
describe("Contact Form Validation", () => {
  describe("Name Validation", () => {
    test("should reject empty name", () => {
      const result = validateName("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Please share your name.");
    });

    test("should reject whitespace-only name", () => {
      const result = validateName("   ");
      expect(result.valid).toBe(false);
    });

    test("should accept valid name", () => {
      const result = validateName("John Doe");
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });
  });

  describe("Email Validation", () => {
    test("should reject empty email", () => {
      const result = validateEmail("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("An email address helps us write back.");
    });

    test("should reject invalid email format", () => {
      const result = validateEmail("invalid-email");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Please enter a valid email.");
    });

    test("should reject email without domain", () => {
      const result = validateEmail("test@");
      expect(result.valid).toBe(false);
    });

    test("should reject email without @ symbol", () => {
      const result = validateEmail("testexample.com");
      expect(result.valid).toBe(false);
    });

    test("should accept valid email", () => {
      const result = validateEmail("test@example.com");
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });

    test("should accept email with subdomain", () => {
      const result = validateEmail("test@mail.example.com");
      expect(result.valid).toBe(true);
    });
  });

  describe("Wedding Date Validation", () => {
    test("should reject empty date", () => {
      const result = validateWeddingDate("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Please provide your wedding date.");
    });

    test("should reject past date", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const result = validateWeddingDate(pastDate.toISOString().split("T")[0]);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Wedding date must be in the future.");
    });

    test("should reject today's date", () => {
      const today = new Date().toISOString().split("T")[0];
      const result = validateWeddingDate(today);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Wedding date must be in the future.");
    });

    test("should accept future date", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = validateWeddingDate(
        futureDate.toISOString().split("T")[0]
      );
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });
  });

  describe("Invitation Drop Date Validation", () => {
    test("should reject empty date", () => {
      const result = validateInvitationDropDate("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Please provide the invitation drop date.");
    });

    test("should reject past date", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      const result = validateInvitationDropDate(
        pastDate.toISOString().split("T")[0]
      );
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invitation drop date must be in the future.");
    });

    test("should reject today's date", () => {
      const today = new Date().toISOString().split("T")[0];
      const result = validateInvitationDropDate(today);
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Invitation drop date must be in the future.");
    });

    test("should accept future date", () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const result = validateInvitationDropDate(
        futureDate.toISOString().split("T")[0]
      );
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });
  });

  describe("Budget Validation", () => {
    test("should reject empty budget", () => {
      const result = validateBudget("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe("Please enter a valid budget amount.");
    });

    test("should reject non-numeric budget", () => {
      const result = validateBudget("abc");
      expect(result.valid).toBe(false);
    });

    test("should reject budget below minimum", () => {
      const result = validateBudget("2000");
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "The minimum investment for working with us is $3,000."
      );
    });

    test("should reject budget at exactly below minimum", () => {
      const result = validateBudget("2999");
      expect(result.valid).toBe(false);
    });

    test("should accept budget at minimum", () => {
      const result = validateBudget("3000");
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });

    test("should accept budget above minimum", () => {
      const result = validateBudget("5000");
      expect(result.valid).toBe(true);
    });

    test("should accept budget with decimals", () => {
      const result = validateBudget("3500.50");
      expect(result.valid).toBe(true);
    });
  });

  describe("Invitation Count Validation", () => {
    test("should reject empty count", () => {
      const result = validateInvitationCount("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "Please enter a valid number of invitations (at least 1)."
      );
    });

    test("should reject non-numeric count", () => {
      const result = validateInvitationCount("abc");
      expect(result.valid).toBe(false);
    });

    test("should reject zero count", () => {
      const result = validateInvitationCount("0");
      expect(result.valid).toBe(false);
    });

    test("should reject negative count", () => {
      const result = validateInvitationCount("-1");
      expect(result.valid).toBe(false);
    });

    test("should accept count of 1", () => {
      const result = validateInvitationCount("1");
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });

    test("should accept valid count", () => {
      const result = validateInvitationCount("150");
      expect(result.valid).toBe(true);
    });
  });

  describe("Message Validation", () => {
    test("should reject empty message", () => {
      const result = validateMessage("");
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "Please share additional details about your event."
      );
    });

    test("should reject whitespace-only message", () => {
      const result = validateMessage("   ");
      expect(result.valid).toBe(false);
    });

    test("should accept valid message", () => {
      const result = validateMessage("We're having a garden wedding.");
      expect(result.valid).toBe(true);
      expect(result.error).toBe("");
    });
  });
});

// Simple test runner for Node.js (if Jest is not available)
if (typeof describe === "undefined") {
  console.log("Running simple test runner...");
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      passed++;
      console.log(`✓ ${message}`);
    } else {
      failed++;
      console.error(`✗ ${message}`);
    }
  };

  // Run basic tests
  assert(validateName("").valid === false, "Empty name should be invalid");
  assert(validateName("John").valid === true, "Valid name should pass");
  assert(validateEmail("test@example.com").valid === true, "Valid email should pass");
  assert(validateEmail("invalid").valid === false, "Invalid email should fail");

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  assert(
    validateWeddingDate(futureDate.toISOString().split("T")[0]).valid === true,
    "Future wedding date should pass"
  );

  assert(validateBudget("3000").valid === true, "Minimum budget should pass");
  assert(validateBudget("2000").valid === false, "Below minimum budget should fail");

  assert(validateInvitationCount("1").valid === true, "Valid invitation count should pass");
  assert(validateInvitationCount("0").valid === false, "Zero invitation count should fail");

  console.log(`\nTests: ${passed} passed, ${failed} failed`);
}

