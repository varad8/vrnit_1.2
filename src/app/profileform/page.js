"use client";
import React, { useState, useEffect } from "react";
import { auth, firestore, storage } from "@/app/authenticate/firebase";
import { useRouter } from "next/navigation";

const ProfileForm = () => {
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkDataExist(user.uid);
      } else {
        router.push("/login");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const checkDataExist = async (user) => {
    try {
      if (user) {
        const userRef = firestore.collection("profileUsers").doc(user);
        const userSnapshot = await userRef.get();
        if (userSnapshot.exists) {
          router.push("/updateprofileform");
        }
      }
    } catch (error) {
      console.error("profile data not found you can add new :", error);
    }
  };

  const handleProfileImageUpload = async (file) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(false);

      // Generate a unique filename for the profile image
      const timestamp = Date.now();
      const filename = `${fullName.replace(" ", "_")}_${timestamp}`;

      // Upload the file to Firebase Storage
      const storageRef = storage.ref(`/profileUsers/${filename}`);
      const uploadTask = storageRef.put(file);

      // Get the download URL of the uploaded image
      const downloadURL = await uploadTask.then((snapshot) =>
        snapshot.ref.getDownloadURL()
      );

      // Update the profile image path in Firestore
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore.collection("profileUsers").doc(userId);
        await userRef.update({ profileImage: downloadURL });

        setIsUploading(false);
        setUploadSuccess(true);
      }
    } catch (error) {
      setIsUploading(false);
      setUploadError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Collect the profile data
    const profileData = {
      fullName,
      gender,
      dob,
      mobileNo,
      address,
      pinCode,
      state,
      country,
    };

    // Store the profile data in Firestore
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userId = currentUser.uid;
        const userRef = firestore.collection("profileUsers").doc(userId);
        await userRef.set(profileData);

        // Upload the profile image, if selected
        if (profileImage) {
          await handleProfileImageUpload(profileImage);
        }

        // Reset the form fields
        setFullName("");
        setGender("");
        setDOB("");
        setMobileNo("");
        setAddress("");
        setPinCode("");
        setState("");
        setCountry("");
        setProfileImage(null);

        checkDataExist(userId);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center lg:h-screen md:mt-3">
      <form className="bg-white p-10 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-8">Profile Form</h2>
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
            />
          </div>
        </div>
        <div className="mt-6">
          <label
            htmlFor="profileImage"
            className="block text-gray-700 font-semibold mb-2"
          >
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            className="w-full border border-gray-300 rounded-md p-2"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mt-6"
          disabled={isUploading}
          onClick={handleSubmit}
        >
          {isUploading ? "Uploading..." : "Save"}
        </button>
        {uploadSuccess && (
          <div className="text-green-600 mt-4">
            Profile updated successfully!
          </div>
        )}
        {uploadError && (
          <div className="text-red-600 mt-4">
            Error updating profile: {uploadError}
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
