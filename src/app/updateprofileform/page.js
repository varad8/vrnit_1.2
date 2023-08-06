"use client";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "@/app/authenticate/firebase";
import { useRouter } from "next/navigation";

const UpdateProfileForm = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchProfileData();
      } else {
        router.push("/login");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Set Old Data to Form
  const fetchProfileData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore.collection("profileUsers").doc(userId);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
          const userData = userSnapshot.data();
          setFullName(userData.fullName);
          setGender(userData.gender);
          setDOB(userData.dob);
          setMobileNo(userData.mobileNo);
          setAddress(userData.address);
          setPinCode(userData.pinCode);
          setState(userData.state);
          setCountry(userData.country);
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update the profile data in Firestore
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore.collection("profileUsers").doc(userId);
        await userRef.update({
          fullName,
          gender,
          dob,
          mobileNo,
          address,
          pinCode,
          state,
          country,
        });

        setSuccess(true);

        // Reset the form fields
        setFullName("");
        setGender("");
        setDOB("");
        setMobileNo("");
        setAddress("");
        setPinCode("");
        setState("");
        setCountry("");
        fetchProfileData();
      }
    } catch (error) {
      setError(true);
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center lg:h-screen md:mt-3">
      <form className="bg-white p-10 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-8">Update Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-700 font-semibold mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full border border-gray-300 rounded-md p-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-gray-700 font-semibold mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              className="w-full border border-gray-300 rounded-md p-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label
              htmlFor="dob"
              className="block text-gray-700 font-semibold mb-2"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="w-full border border-gray-300 rounded-md p-2"
              value={dob}
              onChange={(e) => setDOB(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="mobileNo"
              className="block text-gray-700 font-semibold mb-2"
            >
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNo"
              className="w-full border border-gray-300 rounded-md p-2"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <label
            htmlFor="address"
            className="block text-gray-700 font-semibold mb-2"
          >
            Address
          </label>
          <textarea
            id="address"
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label
              htmlFor="pinCode"
              className="block text-gray-700 font-semibold mb-2"
            >
              Pin Code
            </label>
            <input
              type="text"
              id="pinCode"
              className="w-full border border-gray-300 rounded-md p-2"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-gray-700 font-semibold mb-2"
            >
              State
            </label>
            <input
              type="text"
              id="state"
              className="w-full border border-gray-300 rounded-md p-2"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="country"
              className="block text-gray-700 font-semibold mb-2"
            >
              Country
            </label>
            <input
              type="text"
              id="country"
              className="w-full border border-gray-300 rounded-md p-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-6"
          onClick={handleSubmit}
        >
          Save
        </button>
        {/* Success Alert */}
        {success && (
          <div className="alert alert-success">
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Profile Uploaded Successfully</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
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
            <span>Fail to uploding profile data</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateProfileForm;
