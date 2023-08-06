"use client";
import { auth } from "@/app/authenticate/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [logged, setLogged] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        if (user.uid === "bwGF0c9v7rR8BHU7BFKEtpxx2aB2") {
          setLogged("Logged In");
        } else {
          router.push("/");
        }
      } else {
        router.push("/admin/login");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setLogged("Logged In");
        })
        .catch((error) => {
          setError("Error! Login Failed.");
        });
      setEmail("");
      setPassword("");
    } catch (error) {
      setError("Error! Login Failed.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border rounded shadow-sm p-6">
        <form onSubmit={handleSubmit} className="max-w-md">
          <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
          {error && (
            <div className="alert alert-error flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {logged && (
            <div className="alert alert-success flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{logged}</span>
              {router.push("/admin")}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                required
                autoComplete="off"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
