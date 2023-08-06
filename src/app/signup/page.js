"use client";
import { useState, useEffect } from "react";
import { auth } from "@/app/authenticate/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
const RegistrationForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        router.push("/");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password strength validation
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit, and one special symbol."
      );
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password and Confirm Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Register user using Firebase authentication
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Handle successful registration, e.g., redirect to a success page
      if (result) {
        setError("");
        setSuccess("Registered Successfully");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <form className="w-full sm:w-96 p-8 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-6">Register</h2>
          {error && (
            <div className="text-red-500 bg-red-100 p-2 mb-4 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 bg-red-100 p-2 mb-4 rounded">
              {success}
              {router.push("/")}
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password:</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Confirm Password:</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-2 rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded px-4 py-2 w-full"
            onClick={handleRegister}
          >
            Register
          </button>
        </form>
        <div className="mt-3">
          <p>
            Already Register ?{" "}
            <a href="/login" target="_blank">
              Login
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
