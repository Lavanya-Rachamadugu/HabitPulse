const express = require("express");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const router = express.Router();

// Initialize Gemini client
const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// POST /consult
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const goals = Array.isArray(data.goals) ? data.goals.join(", ") : data.goals;
    const conditions = Array.isArray(data.medicalConditions) ? data.medicalConditions.join(", ") : data.medicalConditions;
    const allergies = Array.isArray(data.allergies) ? data.allergies.join(", ") : data.allergies;

    const targetDays = data.targetDays || 7; // default to 7 days if not specified

    const prompt = `
You are a professional nutritionist. Create a personalized diet plan for the following person for ${targetDays} days:

Name: ${data.fullName}
Age: ${data.age}
Gender: ${data.gender}
Height: ${data.height} cm
Weight: ${data.weight} kg
Goals: ${goals}
Medical Conditions: ${conditions}
Allergies: ${allergies}
Diet Type: ${data.dietType}
Activity Level: ${data.activityLevel}
Sleep Hours: ${data.sleepHours}
Water Intake: ${data.waterIntake} liters/day
Stress Level: ${data.stressLevel}
Taking Medication: ${data.takingMedication}
Additional Info: ${data.additionalInfo}

Provide a detailed day-by-day meal plan with breakfast, lunch, dinner, and snacks.
`;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.status(200).json({ dietPlan: response.text });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to generate diet plan" });
  }
});

module.exports = router;