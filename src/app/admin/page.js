"use client";
import React, { useEffect, useState } from "react";
import { auth, firestore, storage } from "@/app/authenticate/firebase";
import { useRouter } from "next/navigation";

const Admin = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  // Saving Project WOrk Data
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Saving Sponsored Data
  const [sponsoredImage, setSponsoredImage] = useState(null);
  const [sponsoredCompanyName, setsponsoredCompanyName] = useState("");
  const [sponsoredDescription, setsponsoredDescription] = useState("");
  const [sponsoredWebsiteLink, setsponsoredWebsiteLink] = useState("");
  const [sponsoredPayment, setSponsoredPayment] = useState("");
  const [sponsoredPaymentMode, setSponsoredPaymentMode] = useState("");
  const [uploadingsponsored, setuploadingsponsored] = useState(false);
  const [spsuccess, setSpSuccess] = useState(false);
  const [sperror, setspError] = useState(false);
  const [sponsoredData, setsponsoredData] = useState([]);
  const [selectedSponsored, setselectedSponsored] = useState(null);

  // Saving ADS Data
  const [advertisements, setAdvertisements] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [adClientName, setAdClientName] = useState("");
  const [adClientEmail, setAdClientEmail] = useState("");
  const [adClientMobileNo, setAdClientMobileNo] = useState("");
  const [adClientAddress, setAdClientAddress] = useState("");
  const [adsSize, setAdsSize] = useState("");
  const [adType, setAdType] = useState("");
  const [adsImage, setAdsImage] = useState(null);
  const [adsDate, setAdsDate] = useState("");
  const [adsExpiryDate, setAdsExpiryDate] = useState("");
  const [uploadingAds, setUploadingAds] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser.uid === "bwGF0c9v7rR8BHU7BFKEtpxx2aB2") {
        fetchUserData();
        fetchProjects();
        fetchSponsoredData();
        fetchAdvertisements();
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser.uid);
        const docRef = firestore
          .collection("adminProfile")
          .doc(currentUser.uid);
        const doc = await docRef.get();

        if (doc.exists) {
          setUserData(doc.data());
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      setLoading(false);
    }
  };

  //FETCH PROJECTS DATA
  const fetchProjects = async () => {
    try {
      const projectsRef = firestore.collection("projectWork");
      const snapshot = await projectsRef.get();
      const projectsData = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

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
      setsponsoredData(sponsoredData);
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const snapshot = await firestore.collection("ads").get();
      const ads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdvertisements(ads);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setUploading(true);

      // Generate a timestamp
      const timestamp = new Date().getTime();

      // Append timestamp to the file name
      const fileName = `${timestamp}_${image.name}`;

      // Upload image to storage
      const storageRef = storage.ref();
      const imageRef = storageRef.child(`projectWork/${fileName}`);
      await imageRef.put(image);

      // Save data to Firestore
      const projectData = {
        image: await imageRef.getDownloadURL(),
        projectTitle,
        description,
        demoLink,
      };
      await firestore.collection("projectWork").add(projectData);

      fetchProjects();
      setSuccess(true);
    } catch (error) {
      console.error("Error uploading image and saving data:", error);
      setError(true);
    } finally {
      setUploading(false);
      // Clear form fields
      setImage(null);
      setProjectTitle("");
      setDescription("");
      setDemoLink("");
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setProjectTitle(project.projectTitle);
    setDescription(project.description);
    setDemoLink(project.demoLink);
  };
  const handleUpdate = async () => {
    try {
      if (!selectedProject) return;

      const projectRef = firestore
        .collection("projectWork")
        .doc(selectedProject.id);
      const updatedData = {
        projectTitle,
        description,
        demoLink,
      };

      if (image) {
        // Generate a timestamp
        const timestamp = new Date().getTime();

        // Append timestamp to the file name
        const fileName = `${timestamp}_${image.name}`;

        // Upload updated image to storage
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`projectWork/${fileName}`);
        await imageRef.put(image);

        // Update project data including the updated image URL
        const updatedProjectData = {
          ...updatedData,
          image: await imageRef.getDownloadURL(),
        };
        await projectRef.set(updatedProjectData);
      } else {
        // If no image was selected, update only the project data fields
        await projectRef.update(updatedData);
      }
      fetchProjects();

      setSuccess(true);
    } catch (error) {
      console.error("Error updating project:", error);
      setError(true);
    } finally {
      setSelectedProject(null);
      setProjectTitle("");
      setDescription("");
      setDemoLink("");
      setImage(null);
    }
  };

  //Uploading Sponsored Data to Database
  const handleSpnsoredImageUpload = (event) => {
    const file = event.target.files[0];
    setSponsoredImage(file);
  };

  const handleSponsoredSubmit = async (event) => {
    event.preventDefault();

    try {
      setuploadingsponsored(true);

      // Generate a timestamp
      const timestamp = new Date().getTime();

      // Append timestamp to the file name
      const fileName = `${timestamp}_${sponsoredImage.name}`;

      // Upload image to storage
      const storageRef = storage.ref();
      const imageRef = storageRef.child(`sponsored/${fileName}`);
      await imageRef.put(sponsoredImage);

      // Save data to Firestore
      const sponsoredData = {
        sponsoredImage: await imageRef.getDownloadURL(),
        sponsoredCompanyName,
        sponsoredDescription,
        sponsoredWebsiteLink,
        sponsoredPayment,
        sponsoredPaymentMode,
      };
      await firestore.collection("sponsored").add(sponsoredData);

      fetchSponsoredData();
      setSpSuccess(true);
    } catch (error) {
      console.error("Error uploading image and saving data:", error);
      setspError(true);
    } finally {
      setuploadingsponsored(false);
      // Clear form fields
      setsponsoredCompanyName("");
      setsponsoredDescription("");
      setsponsoredWebsiteLink("");
      setSponsoredPayment("");
      setSponsoredPaymentMode("");
      setSponsoredImage(null);
    }
  };

  // Update Sponsored Data
  const handleSponsoredClick = (sponsored) => {
    setselectedSponsored(sponsored);
    setsponsoredCompanyName(sponsored.sponsoredCompanyName);
    setsponsoredDescription(sponsored.sponsoredDescription);
    setsponsoredWebsiteLink(sponsored.sponsoredWebsiteLink);
  };

  const handleSponsoredUpdate = async () => {
    try {
      if (!selectedSponsored) return;

      const sponsoredRef = firestore
        .collection("sponsored")
        .doc(selectedSponsored.id);
      const updatedData = {
        sponsoredCompanyName,
        sponsoredDescription,
        sponsoredWebsiteLink,
      };

      if (sponsoredImage) {
        // Generate a timestamp
        const timestamp = new Date().getTime();

        // Append timestamp to the file name
        const fileName = `${timestamp}_${sponsoredImage.name}`;

        // Upload updated image to storage
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`sponsored/${fileName}`);
        await imageRef.put(sponsoredImage);

        // Update project data including the updated image URL
        const updateSponsored = {
          ...updatedData,
          image: await imageRef.getDownloadURL(),
        };
        await sponsoredRef.set(updateSponsored);
      } else {
        // If no image was selected, update only the project data fields
        await sponsoredRef.update(updatedData);
      }
      fetchSponsoredData();
      setSpSuccess(true);
    } catch (error) {
      console.error("Error updating project:", error);
      setspError(true);
    } finally {
      setsponsoredCompanyName("");
      setsponsoredDescription("");
      setsponsoredWebsiteLink("");
      setSponsoredPayment("");
      setSponsoredPaymentMode("");
      setSponsoredImage(null);
    }
  };

  const handleSubmitAds = async (e) => {
    e.preventDefault();
    setUploadingAds(true);

    try {
      // Generate a timestamp
      const timestamp = new Date().getTime();

      // Append timestamp to the file name
      const fileName = `${timestamp}_${adsImage.name}`;

      // Upload image to storage
      const storageRef = storage.ref();
      const fileRef = storageRef.child(`ads/${fileName}`);
      await fileRef.put(adsImage);

      const imageUrl = await fileRef.getDownloadURL();

      const adCount = advertisements.length + 1;
      const currentDate = new Date().toISOString().slice(0, 10);
      const advertisementId = `AD${currentDate}-${adCount}`;

      await firestore.collection("ads").doc(advertisementId).set({
        adClientName,
        adClientEmail,
        adClientMobileNo,
        adClientAddress,
        adsSize,
        adType,
        imageUrl,
        adsDate,
        adsExpiryDate,
      });

      setAdClientName("");
      setAdClientEmail("");
      setAdClientMobileNo("");
      setAdClientAddress("");
      setAdsSize("");
      setAdType("");
      setAdsImage(null);
      setAdsDate("");
      setAdsExpiryDate("");

      fetchAdvertisements();
      setUploadingAds(false);
    } catch (error) {
      console.log(error);
      setUploadingAds(false);
    }
  };

  const handleDeleteAd = async (id) => {
    try {
      const storageRef = storage.ref();
      const imageUrl = advertisements[id].imageUrl;
      const filePath = extractFilePathFromUrl(imageUrl);
      const fileRef = storageRef.child(filePath);
      await fileRef.delete();

      await firestore.collection("ads").doc(advertisements[id].id).delete();

      setAdvertisements((prevAds) =>
        prevAds.filter((ad, index) => index !== id)
      );
      fetchAdvertisements();
    } catch (error) {
      console.log(error);
    }
  };

  const extractFilePathFromUrl = (imageUrl) => {
    const regex = /\/o\/(ads%2F.*?)\?/;
    const matches = imageUrl.match(regex);
    if (matches && matches.length > 1) {
      const filePath = decodeURIComponent(matches[1]);
      return filePath;
    } else {
      throw new Error("Invalid image URL");
    }
  };

  const handleSelectAd = (ad) => {
    setSelectedAd(ad);
    setAdClientName(ad.adClientName);
    setAdClientEmail(ad.adClientEmail);
    setAdClientMobileNo(ad.adClientMobileNo);
    setAdClientAddress(ad.adClientAddress);
    setAdsSize(ad.adsSize);
    setAdType(ad.adType);
    setAdsDate(ad.adsDate);
    setAdsExpiryDate(ad.adsExpiryDate);
  };

  const handleUpdateAd = async () => {
    try {
      await firestore.collection("ads").doc(selectedAd.id).update({
        adClientName,
        adClientEmail,
        adClientMobileNo,
        adClientAddress,
        adsSize,
        adType,
        adsDate,
        adsExpiryDate,
      });

      setSelectedAd(null);
      setAdClientName("");
      setAdClientEmail("");
      setAdClientMobileNo("");
      setAdClientAddress("");
      setAdsSize("");
      setAdType("");
      setAdsDate("");
      setAdsExpiryDate("");

      fetchAdvertisements();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : (
          userData && (
            <div className="flex flex-col lg:flex-row border rounded-lg shadow-md">
              <div className="w-full lg:w-1/2 bg-white p-4 flex items-center">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={userData.profileUrl} alt="Profile" />
                  </div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold mb-2">
                    Name: {userData.name}
                  </h2>
                  <p className="text-gray-600">Email: {userData.email}</p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 bg-white p-4">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          )
        )}

        {userData && (
          <div className="flex flex-col lg:flex-row mt-8">
            {" "}
            <div className="w-full lg:w-1/2 h-2/4">
              <h2 className="text-xl font-semibold mb-4">Upload Project</h2>
              <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-md mb-3">
                <form onSubmit={handleSubmit}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Project Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter project title"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      placeholder="Enter project description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="textarea textarea-bordered"
                      required
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Demo Link</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter demo link"
                      value={demoLink}
                      onChange={(e) => setDemoLink(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Image</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-4"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
              {success && (
                <div className="alert alert-success mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mx-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Project uploaded successfully!</span>
                </div>
              )}
              {error && (
                <div className="alert alert-error mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mx-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Error uploading project!</span>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2  h-2/4">
              <h2 className="text-xl font-semibold mb-4">Project List</h2>
              <div
                className="bg-white p-4 overflow-y-auto"
                style={{ height: "460px" }}
              >
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`card lg:card-side bg-base-100 shadow-xl border border-gray-400 mb-2 ${
                      selectedProject && selectedProject.id === project.id
                        ? "border border-blue-900"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedProject(project);
                      setProjectTitle(project.projectTitle);
                      setDescription(project.description);
                      setDemoLink(project.demoLink);
                    }}
                  >
                    <figure>
                      <img src={project.image} alt="Project" />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">{project.projectTitle}</h2>
                      <p>{project.description.substring(0, 10)}...</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">
                          {" "}
                          <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Watch
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedProject && (
                <div className="mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleUpdate}
                    disabled={!selectedProject}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <div class="divider mt-2 mb-2"></div>
        {/* For Sponsored code   */}
        {userData && (
          <div className="flex flex-col lg:flex-row mt-8">
            <div className="w-full lg:w-1/2 h-2/4">
              <h2 className="text-xl font-semibold mb-4 ">
                Add Sponsored Data
              </h2>
              <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-md mb-3">
                <form onSubmit={handleSponsoredSubmit}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Sponsored Company Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter project title"
                      value={sponsoredCompanyName}
                      onChange={(e) => setsponsoredCompanyName(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Description</span>
                    </label>
                    <textarea
                      placeholder="Enter project description"
                      value={sponsoredDescription}
                      onChange={(e) => setsponsoredDescription(e.target.value)}
                      className="textarea textarea-bordered"
                      required
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Sponsored Company Link</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter demo link"
                      value={sponsoredWebsiteLink}
                      onChange={(e) => setsponsoredWebsiteLink(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Sponsored Paid Amount</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter demo link"
                      value={sponsoredPayment}
                      onChange={(e) => setSponsoredPayment(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Sponsored Payment Mode</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter demo link"
                      value={sponsoredPaymentMode}
                      onChange={(e) => setSponsoredPaymentMode(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company Logo</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSpnsoredImageUpload}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-4"
                    disabled={uploadingsponsored}
                  >
                    {uploadingsponsored ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
              {spsuccess && (
                <div className="alert alert-success mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mx-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Sponsored uploaded successfully!</span>
                </div>
              )}
              {sperror && (
                <div className="alert alert-error mt-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 mx-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span>Error uploading Sponsored!</span>
                </div>
              )}
            </div>
            <div className="w-full lg:w-1/2  h-2/4">
              <h2 className="text-xl font-semibold mb-4">Sponsored List</h2>
              <div
                className=" bg-white p-4 overflow-y-auto"
                style={{ height: "460px", overflowX: "auto" }}
              >
                {sponsoredData.map((sponsored) => (
                  <div
                    key={sponsored.id}
                    className={`card lg:card-side bg-base-100 shadow-xl border border-gray-400 mb-2 ${
                      selectedSponsored && selectedSponsored.id === sponsored.id
                        ? "border border-blue-900"
                        : ""
                    }`}
                    onClick={() => {
                      setselectedSponsored(sponsored);
                      setsponsoredCompanyName(sponsored.sponsoredCompanyName);
                      setsponsoredDescription(sponsored.sponsoredDescription);
                      setsponsoredWebsiteLink(sponsored.sponsoredWebsiteLink);
                    }}
                  >
                    <figure>
                      <img src={sponsored.sponsoredImage} alt="Project" />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title">
                        {sponsored.sponsoredCompanyName}
                      </h2>
                      <p>{sponsored.sponsoredDescription}</p>
                      <div className="card-actions justify-end">
                        <button className="btn btn-primary">
                          {" "}
                          <a
                            href={sponsored.sponsoredWebsiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View
                          </a>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedSponsored && (
                <div className="mt-4">
                  <button
                    className="btn btn-primary"
                    onClick={handleSponsoredUpdate}
                    disabled={!selectedSponsored}
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div class="divider mt-2 mb-2"></div>
        {/* For AdsFormCode code   */}

        {/* Add New Advertisement Form */}
        {userData && (
          <div className="flex flex-col lg:flex-row mt-8">
            <div className="w-full lg:w-1/2 h-2/4">
              <h2 className="text-xl font-semibold mb-4">
                Advertisement New Data
              </h2>
              <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-md mb-3">
                <form onSubmit={handleSubmitAds}>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ad Client Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter client name"
                      value={adClientName}
                      onChange={(e) => setAdClientName(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ad Client Email</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter client email"
                      value={adClientEmail}
                      onChange={(e) => setAdClientEmail(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ad Client Mobile No</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter client mobile no"
                      value={adClientMobileNo}
                      onChange={(e) => setAdClientMobileNo(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ad Client Address</span>
                    </label>
                    <textarea
                      placeholder="Enter client address"
                      value={adClientAddress}
                      onChange={(e) => setAdClientAddress(e.target.value)}
                      className="textarea textarea-bordered"
                      required
                    ></textarea>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ads Size</span>
                    </label>
                    <select
                      value={adsSize}
                      onChange={(e) => setAdsSize(e.target.value)}
                      className="select select-bordered"
                      required
                    >
                      <option value="">Select ads size</option>
                      <option value="300x250">300x250</option>
                      <option value="728x90">728x90</option>
                      <option value="160x600">160x600</option>
                      <option value="336x280">336x280</option>
                      <option value="970x250">970x250</option>
                      <option value="300x600">300x600</option>
                      <option value="468x60">468x60</option>
                      <option value="320x50">320x50</option>
                      <option value="1080x1920">1080x1920</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ad Type</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter ad type"
                      value={adType}
                      onChange={(e) => setAdType(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ads Image</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAdsImage(e.target.files[0])}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ads Date</span>
                    </label>
                    <input
                      type="date"
                      placeholder="Enter ads date"
                      value={adsDate}
                      onChange={(e) => setAdsDate(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Ads Expiry Date</span>
                    </label>
                    <input
                      type="date"
                      placeholder="Enter ads expiry date"
                      value={adsExpiryDate}
                      onChange={(e) => setAdsExpiryDate(e.target.value)}
                      className="input input-bordered"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mt-4"
                    disabled={uploadingAds}
                  >
                    {uploadingAds ? "Uploading..." : "Upload"}
                  </button>
                </form>
              </div>
            </div>
            <div className="w-full lg:w-1/2 h-2/4">
              <h2 className="text-xl font-semibold mb-4">Advertisement List</h2>
              <div
                className="bg-white p-4"
                style={{ height: "880px", overflowX: "auto" }}
              >
                {advertisements.map((ad, index) => (
                  <div
                    key={ad.id}
                    className="bg-white p-4 border border-gray-300 rounded-lg shadow-md mb-4"
                    onClick={() => handleSelectAd(ad)}
                    style={{ cursor: "pointer" }}
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      {ad.adClientName}
                    </h2>
                    <p>Email: {ad.adClientEmail}</p>
                    <p>Mobile No: {ad.adClientMobileNo}</p>
                    <p>Address: {ad.adClientAddress}</p>
                    <p>Size: {ad.adsSize}</p>
                    <p>Type: {ad.adType}</p>
                    <p>Date: {ad.adsDate}</p>
                    <p>Expiry Date: {ad.adsExpiryDate}</p>
                    <p>Ads Id: {ad.id}</p>
                    <img
                      src={ad.imageUrl}
                      alt="Advertisement"
                      className="max-w-xs mt-4"
                    />
                    <button
                      onClick={() => handleDeleteAd(index)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={handleUpdateAd}
                      className="btn btn-primary mt-4"
                      disabled={uploadingAds}
                    >
                      {uploadingAds ? "Updating..." : "Update"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
