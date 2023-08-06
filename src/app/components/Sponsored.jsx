"use client";
import React, { useState, useEffect } from "react";
import { firestore } from "@/app/authenticate/firebase";

const Sponsored = () => {
  const [sponsoredData, setSponsoredData] = useState([]);

  useEffect(() => {
    fetchSponsoredData();
  }, []);

  // FETCH SPONSORED DATA
  const fetchSponsoredData = async () => {
    try {
      const sponsoredRef = firestore.collection("sponsored");
      const snapshot = await sponsoredRef.get();
      const sponsoredData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setSponsoredData(sponsoredData);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-10">
      <h3 className="font-bold text-3xl text-center josefin">Sponsored By</h3>
      <div className="flex flex-wrap justify-center mt-3">
        {sponsoredData.map((sponsored) => (
          <a
            href={sponsored.sponsoredWebsiteLink}
            target="_blank"
            rel="nofollow"
            key={sponsored.id}
          >
            <div
              className="tooltip mx-2 my-2"
              data-tip={sponsored.sponsoredCompanyName}
            >
              <div className="p-4 border border-gray-500 rounded-lg shadow-lg bg-white">
                <div className="flex flex-col justify-center items-center">
                  <img
                    src={sponsored.sponsoredImage}
                    alt={sponsored.sponsoredCompanyName}
                    style={{ width: "100px", height: "100px" }}
                  />
                  <p className="text-gray-400">
                    {sponsored.sponsoredCompanyName}
                  </p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sponsored;
