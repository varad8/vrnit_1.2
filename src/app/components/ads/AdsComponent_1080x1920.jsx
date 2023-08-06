"use client";
import React, { useEffect, useState } from "react";
import { firestore } from "@/app/authenticate/firebase";

const AdsComponent = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Retrieve documents with adsSize = "1080x1920" and adsExpiryDate not expired from Firestore
    const fetchAds = async () => {
      try {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        const querySnapshot = await firestore
          .collection("ads")
          .where("adsSize", "==", "1080x1920")
          .where("adsExpiryDate", ">", formattedDate)
          .get();

        const documents = querySnapshot.docs;
        const shuffledDocuments =
          documents.length > 1 ? shuffleArray(documents) : documents;
        const urls = shuffledDocuments.map((doc) => doc.data().imageUrl);
        console.log(urls);
        setImageUrls(urls);
        window.my_modal_3.showModal();
      } catch (error) {
        console.log("Error getting documents:", error);
      }
    };

    fetchAds();
  }, []);

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <form method="dialog" className="modal-box">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
          {imageUrls.length > 0 && (
            <img src={imageUrls[0]} alt="Advertisement" />
          )}
        </form>
      </dialog>
    </div>
  );
};

// Helper function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default AdsComponent;
