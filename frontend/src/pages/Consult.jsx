import React, { useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import { useForm } from "react-hook-form";

const Consult = () => {
  const [dietPlan, setDietPlan] = useState(""); // store AI response
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const isTakingMeds = watch("takingMedication");
  const isFasting = watch("intermittentFasting");

  const onSubmit = async (data) => {
    setLoading(true);
    setDietPlan("");
    try {
      const response = await axios.post("https://habitpulse-cgk3.onrender.com/consult", data);
      setDietPlan(response.data.dietPlan);
    } catch (err) {
      console.error(err);
      setDietPlan("Failed to generate diet plan. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-200 flex justify-center py-10">
        <div className="w-2/3 bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Personalized Diet Plan Form
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <input {...register("fullName", { required: true })} placeholder="Full Name" className="input" />
              <input type="number" {...register("age", { required: true })} placeholder="Age" className="input" />
              <input type="number" {...register("height")} placeholder="Height (cm)" className="input" />
              <input type="number" {...register("weight")} placeholder="Weight (kg)" className="input" />
            </div>

            {/* Gender */}
            <div>
              <label className="font-semibold">Gender:</label>
              <div className="flex gap-4 mt-2">
                <label><input type="radio" value="Male" {...register("gender")} /> Male</label>
                <label><input type="radio" value="Female" {...register("gender")} /> Female</label>
                <label><input type="radio" value="Other" {...register("gender")} /> Other</label>
              </div>
            </div>

            {/* Goals */}
            <div>
              <label className="font-semibold">Goals:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Weight Loss","Weight Gain","Muscle Gain","Fat Loss","General Fitness"].map(goal => (
                  <label key={goal}>
                    <input type="checkbox" value={goal} {...register("goals")} /> {goal}
                  </label>
                ))}
              </div>
            </div>

            {/* Target Days */}
            <div>
              <label className="font-semibold">Target Number of Days:</label>
              <input
                type="number"
                {...register("targetDays", { required: true, min: 1 })}
                placeholder="e.g., 7"
                className="input mt-2"
              />
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="font-semibold">Medical Conditions:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Diabetes","Thyroid","PCOS","High Blood Pressure","None"].map(cond => (
                  <label key={cond}>
                    <input type="checkbox" value={cond} {...register("medicalConditions")} /> {cond}
                  </label>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="font-semibold">Food Allergies:</label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {["Milk","Eggs","Peanuts","Gluten","Soy","None"].map(item => (
                  <label key={item}>
                    <input type="checkbox" value={item} {...register("allergies")} /> {item}
                  </label>
                ))}
              </div>
            </div>

            {/* Diet Type */}
            <div>
              <label className="font-semibold">Diet Type:</label>
              <select {...register("dietType")} className="input mt-2">
                <option value="">Select</option>
                <option>Vegetarian</option>
                <option>Vegan</option>
                <option>Non-Vegetarian</option>
                <option>Keto</option>
                <option>Paleo</option>
              </select>
            </div>

            {/* Activity Level */}
            <div>
              <label className="font-semibold">Activity Level:</label>
              <select {...register("activityLevel")} className="input mt-2">
                <option>Sedentary</option>
                <option>Lightly Active</option>
                <option>Moderately Active</option>
                <option>Very Active</option>
              </select>
            </div>

            {/* Lifestyle */}
            <div className="grid grid-cols-2 gap-4">
              <input type="number" {...register("sleepHours")} placeholder="Sleep hours per night" className="input" />
              <input type="number" {...register("waterIntake")} placeholder="Water intake (liters/day)" className="input" />
            </div>

            {/* Stress Slider */}
            <div>
              <label className="font-semibold">Stress Level (1-10):</label>
              <input type="range" min="1" max="10" {...register("stressLevel")} className="w-full" />
            </div>

            {/* Medication */}
            <div>
              <label className="font-semibold">Taking Medication?</label>
              <select {...register("takingMedication")} className="input mt-2">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {isTakingMeds === "Yes" && (
              <input {...register("medicationDetails")} placeholder="List medications" className="input" />
            )}

            {/* Intermittent Fasting */}
            <div>
              <label className="font-semibold">Intermittent Fasting?</label>
              <select {...register("intermittentFasting")} className="input mt-2">
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
            {isFasting === "Yes" && (
              <select {...register("fastingWindow")} className="input">
                <option>16:8</option>
                <option>18:6</option>
                <option>20:4</option>
                <option>OMAD</option>
              </select>
            )}

            {/* Additional Info */}
            <div>
              <label className="font-semibold">Anything else?</label>
              <textarea {...register("additionalInfo")} rows="4" className="input mt-2" placeholder="Describe your eating habits..." />
            </div>

            {/* Submit */}
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
              {loading ? "Generating..." : "Generate Diet Plan"}
            </button>
          </form>

          {/* Diet Plan Output */}
          {dietPlan && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Your AI Diet Plan:</h3>
              <pre className="whitespace-pre-wrap">{dietPlan}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Consult;