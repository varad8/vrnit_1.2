"use client";
import React, { useState, useEffect } from "react";
import { auth, firestore } from "@/app/authenticate/firebase";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDOB] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [profileImage, setProfileImage] = useState(null);

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
          setProfileImage(userData.profileImage);
        } else {
          router.push("/profileform");
        }
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  return (
    <div className="flex justify-center items-center lg:h-screen md:mt-3">
      <form className="bg-white p-10 rounded shadow-md">
        <div className="flex justify-center">
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile Avatar"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-8">Profile</h2>
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
              readOnly
            />
          </div>
          <div>
            <label
              htmlFor="gender"
              className="block text-gray-700 font-semibold mb-2"
            >
              Gender
            </label>
            <input
              type="text"
              id="gender"
              className="w-full border border-gray-300 rounded-md p-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              readOnly
            />
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
              readOnly
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
              readOnly
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
            readOnly
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
              readOnly
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
              readOnly
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
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <button
            type="button"
            className="btn btn-outline btn-primary"
            onClick={() => router.push("/updateprofileform")}
          >
            Update Profile
          </button>
          <button type="button" className="btn btn-outline btn-secondary">
            Delete Account
          </button>
          <button type="button" className="btn btn-outline btn-accent">
            Rate this
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
