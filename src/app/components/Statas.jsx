"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "@/app/authenticate/firebase";

const Statas = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [sponsoredCount, setSponsoredCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const projectWorkRef = firestore.collection("projectWork");
        const sponsoredRef = firestore.collection("sponsored");
        const profileUsersRef = firestore.collection("profileUsers");

        const projectWorkSnapshot = await projectWorkRef.get();
        const sponsoredSnapshot = await sponsoredRef.get();
        const profileUsersSnapshot = await profileUsersRef.get();

        setProjectCount(projectWorkSnapshot.size);
        setSponsoredCount(sponsoredSnapshot.size);
        setUserCount(profileUsersSnapshot.size);
      } catch (error) {
        console.error("Error fetching collection counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="container mx-auto px-4 flex justify-center mt-5 mb-5">
      <div className="stats stats-horizontal lg:stats-horizontal shadow">
        <div className="stat" style={{ background: "#B7B6C2" }}>
          <div className="stat-title">Projects</div>
          <div className="stat-value">{projectCount}</div>
        </div>

        <div className="stat" style={{ background: "#B7B6C2" }}>
          <div className="stat-title">Users</div>
          <div className="stat-value">{userCount}</div>
        </div>

        <div className="stat" style={{ background: "#B7B6C2" }}>
          <div className="stat-title">Company's</div>
          <div className="stat-value">1</div>
        </div>
        <div className="stat" style={{ background: "#B7B6C2" }}>
          <div className="stat-title">Sponser's</div>
          <div className="stat-value">{sponsoredCount}</div>
        </div>
        <div className="stat" style={{ background: "#B7B6C2" }}>
          <div className="stat-title">Sold Projects</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat" style={{ background: "#B7B6C2" }}>
          <div className="stat-title">Contribution</div>
          <div className="stat-value">5+</div>
        </div>
      </div>
    </div>
  );
};

export default Statas;
