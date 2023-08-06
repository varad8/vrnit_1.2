import React, { useEffect, useState } from "react";
import { firestore } from "@/app/authenticate/firebase";

const AdsComponent_300_600 = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    // Retrieve documents with adsSize = "970x250" and adsExpiryDate not expired from Firestore
    const fetchAds = async () => {
      try {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, "0");
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        const querySnapshot = await firestore
          .collection("ads")
          .where("adsSize", "==", "300x600")
          .where("adsExpiryDate", ">", formattedDate)
          .get();

        const documents = querySnapshot.docs;
        const shuffledDocuments =
          documents.length > 1 ? shuffleArray(documents) : documents;
        const urls = shuffledDocuments.map((doc) => doc.data().imageUrl);
        setImageUrls(urls);
        setShowImage(true);
      } catch (error) {
        console.log("Error getting documents:", error);
      }
    };

    fetchAds();
  }, []);

  const handleCloseImage = () => {
    setShowImage(false);
  };

  return (
    <>
      {showImage && (
        <div className="flex justify-center mt-5 mb-5 px-4">
          <img src={imageUrls[0]} alt="Advertisement" />
        </div>
      )}
    </>
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

export default AdsComponent_300_600;
