"use client";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../authenticate/firebase";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const [userLogged, setUserLogged] = useState(false);
  const [profiledata, setProfileData] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        checkDataExist(user.uid);
        setUserLogged(true);
      } else {
        setUserLogged(false);
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
          const userData = userSnapshot.data();
          setProfileData(userData.profileImage);
        }
      }
    } catch (error) {
      console.error("profile data not found you can add new :", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Additional code or redirection after successful logout
      setProfileData(null);
    } catch (error) {
      console.error("Failed to log out:", error);
      // Handle error accordingly
    }
  };

  return (
    <div>
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Home</a>
              </li>
              <li>
                <a href="#services">Services</a>
              </li>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#vision">Vission Mission</a>
              </li>
            </ul>
          </div>
          <label tabindex="0" className="btn btn-ghost btn-circle avatar">
            <div className="w-20 rounded-full">
              <img src="images/vrnlogonew.png" alt="VRNITSOLUTION LOGO" />
            </div>
          </label>
          <a className="btn btn-ghost normal-case text-xl">VRNITSOLUTION</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Home</a>
            </li>
            <li>
              <a href="#services">Services</a>
            </li>
            <li>
              <a href="#projects">Projects</a>
            </li>
            <li>
              <a href="#vision">Vission Mission</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {/* If Profile Not Complete then show Profile Not Complete Profile */}

          {profiledata === null && userLogged && (
            <a href="/profileform" className="btn  btn-neutral">
              Complete Profile
            </a>
          )}

          {userLogged === false && (
            <a href="/login" className="btn  btn-neutral">
              Login
            </a>
          )}

          {/* Check ProfileData is Exist / Complete */}

          {profiledata && userLogged && (
            <div className="flex-none">
              {/* SHow Profile Here */}
              <div className="dropdown dropdown-end">
                <label tabindex="0" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={profiledata} />
                  </div>
                </label>
                <ul
                  tabindex="0"
                  className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a
                      className="justify-between"
                      onClick={() => router.push("/profile")}
                    >
                      Profile
                    </a>
                  </li>
                  <li>
                    <a onClick={handleLogout}>Logout</a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
