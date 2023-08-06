"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth, firestore } from "@/app/authenticate/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/bottomnav/BottomNav";
import AdsComponent_300_250 from "../components/ads/AdsComponent_300_250";
import AdsComponent_728_90 from "../components/ads/AdsComponent_728_90";
import VideoYt from "./VideoYt";
import { marked } from "marked";
import "./resetcss.css";
import { gfmHeadingId } from "marked-gfm-heading-id";
import AdsComponent_300_400 from "../components/ads/AdsComponent_300_400";
import AdsComponent_300_600 from "../components/ads/AdsComponent_300_600";

const ProjectInfo = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [projectID, setprojectID] = useState("");
  const [project, setProject] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [heartColor, setHeartColor] = useState("text-gray-500 text-xl");
  const [projects, setProjects] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    fetchProjects();

    if (projectId) {
      setprojectID(projectId);
      fetchProject(projectId);
      fetchLikeCount(projectId);
    } else {
      setprojectID("OuPmQpdrDgcWEz4RIoKL");
      fetchProject("OuPmQpdrDgcWEz4RIoKL");
      fetchLikeCount("OuPmQpdrDgcWEz4RIoKL");
    }

    return () => {
      unsubscribe();
    };
  }, [projectId]);

  // Fetch Project
  const fetchProject = async (id) => {
    try {
      const projectRef = firestore.collection("projectWork").doc(id);
      const doc = await projectRef.get();

      if (doc.exists) {
        const projectData = { id: doc.id, ...doc.data() };
        setProject(projectData);
        fetchComments(projectData.id);
      } else {
        setProject(null);
      }
    } catch (error) {
      setError("You have not selected any Projects");
    }
  };

  // Fetch Full Name
  const fetchFullName = async (userId) => {
    try {
      const profileSnapshot = await firestore
        .collection("profileUsers")
        .doc(userId)
        .get();
      const profileData = profileSnapshot.data();
      if (profileData && profileData.fullName) {
        return profileData.fullName;
      } else {
        return ""; // Return a default full name or handle the case when no full name is available
      }
    } catch (error) {
      console.error("Error fetching full name:", error);
      return ""; // Return a default full name or handle the error case
    }
  };

  // Fetch Comments
  const fetchComments = async (pid) => {
    try {
      const commentsRef = firestore
        .collection("comments")
        .where("projectId", "==", pid);
      const snapshot = await commentsRef.get();
      const commentsData = snapshot.docs.map(async (doc) => {
        const commentData = doc.data();
        const fullName = await fetchFullName(commentData.userId); // Fetch full name
        const profileImage = await fetchProfileImage(commentData.userId); // Fetch profile image URL
        return {
          id: doc.id,
          ...commentData,
          fullName,
          profileImage,
        };
      });
      const resolvedComments = await Promise.all(commentsData);
      setComments(resolvedComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Render Profile Image
  const fetchProfileImage = async (userId) => {
    try {
      const profileSnapshot = await firestore
        .collection("profileUsers")
        .doc(userId)
        .get();
      const profileData = profileSnapshot.data();
      if (profileData && profileData.profileImage) {
        return profileData.profileImage;
      } else {
        return ""; // Return a default image URL or handle the case when no profile image is available
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
      return ""; // Return a default image URL or handle the error case
    }
  };

  // Handle Comment
  const handleComment = async () => {
    if (user && commentText.trim() !== "") {
      try {
        await firestore.collection("comments").add({
          projectId: project.id,
          userId: user.uid,
          text: commentText,
          createdAt: new Date(),
        });
        setCommentText("");
        fetchComments(project.id);
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    } else if (!user) {
      router.push("/login");
    }
  };

  // Handle Like
  const handleLike = async () => {
    if (user) {
      try {
        const projectStatsRef = firestore.collection("projectStats");
        const query = projectStatsRef
          .where("userId", "==", user.uid)
          .where("projectId", "==", project.id);

        const querySnapshot = await query.get();
        const likeExists = !querySnapshot.empty;

        if (likeExists) {
          // User has already liked the project, so delete the like
          const likeDoc = querySnapshot.docs[0];
          await likeDoc.ref.delete();
          setLikeCount((prevCount) => prevCount - 1);
          setHeartColor("text-grey-500 text-xl"); // Set the heart color to gray
        } else {
          // User has not liked the project, so add a new like
          await projectStatsRef.add({
            userId: user.uid,
            projectId: project.id,
          });
          setLikeCount((prevCount) => prevCount + 1);
          setHeartColor("text-red-500 text-xl"); // Set the heart color to red
        }
      } catch (error) {
        console.error("Error handling like:", error);
      }
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    // Fetch the user's like status when the project and user are available
    const fetchLikeStatus = async () => {
      if (user && project) {
        try {
          const projectStatsRef = firestore.collection("projectStats");
          const query = projectStatsRef
            .where("userId", "==", user.uid)
            .where("projectId", "==", project.id);

          const querySnapshot = await query.get();
          const likeExists = !querySnapshot.empty;

          if (likeExists) {
            setHeartColor("text-red-500 text-xl"); // Set the heart color to red
          } else {
            setHeartColor("text-gray-500 text-xl"); // Set the heart color to gray
          }
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      }
    };

    fetchLikeStatus(); // Call the fetchLikeStatus function
  }, [user, project]);

  // Fetch Like Count
  const fetchLikeCount = async (projectId) => {
    try {
      const projectStatsRef = firestore.collection("projectStats");
      const querySnapshot = await projectStatsRef
        .where("projectId", "==", projectId)
        .get();
      const likeCount = querySnapshot.size;
      console.log("Like Count:", likeCount);
      setLikeCount(likeCount);
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  // Fetching all projects and set to contianer
  // FETCH PROJECTS DATA
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

  // For description editing
  const options = {
    mangle: false,
    headerIds: false,
  };
  marked.use({
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false,
  });
  function convertTextToHtml(text) {
    const html = marked(text, options);
    return { __html: html };
  }

  // Selecting Project and getting Id

  const selectedProjectID = (id) => {
    router.push(`/projectinfo?projectId=${id}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <AdsComponent_728_90 />
      {!error && project && (
        <>
          <div className="flex flex-col lg:flex-row mb-2 mt-2">
            {/* Video Player */}
            <div className="lg:w-2/3">
              {/* Embed the YouTube video player with the provided videoId */}
              {/* Show Video Ad with Skip Button */}
              <VideoYt videoId={project.demoLink} />

              {/* Video Details */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4 mt-3">
                <h1 className="text-xl font-bold mb-2">
                  {project.projectTitle}
                </h1>
                {/* Render video description */}
                <img
                  src={project.image}
                  alt="Project Image"
                  width={"100%"}
                  height={"150px"}
                />

                <div className="flex mt-2 mb-2">
                  <button
                    onClick={handleLike}
                    className="btn rounded-full mr-2"
                  >
                    <FontAwesomeIcon icon={faHeart} className={heartColor} />
                  </button>{" "}
                  <button className="btn rounded-full mr-2">
                    {likeCount} &nbsp;
                    <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                  </button>
                </div>

                <p className="text-gray-500"></p>
                <div id="content" class="marked-output">
                  {" "}
                  <div
                    dangerouslySetInnerHTML={convertTextToHtml(
                      project.description
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Video Details, Comments, Recommended Videos */}
            <div className="lg:w-1/3 lg:pl-8 mt-8 lg:mt-0">
              <div className="flex flex-col h-full">
                {/* Advertisment 300x250 */}
                <div className="bg-gray-300 rounded-lg shadow-lg p-2 mb-4">
                  {/* Render advertisement content */}
                  <AdsComponent_300_250 />
                </div>

                {/* Comments */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                  <h2 className="text-xl font-bold mb-2">Comments</h2>
                  {/* Render comments */}
                  <div className="overflow-y-auto" style={{ height: "300px" }}>
                    {comments.map((comment) => (
                      <div key={comment.id} className="mb-4 flex">
                        <div className="flex-shrink-0">
                          <img
                            src={comment.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full mr-2"
                          />
                        </div>
                        <div>
                          <p className="font-semibold">{comment.fullName}</p>
                          <p>{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Comment Input */}
                  <div className="flex items-center mt-4">
                    <textarea
                      placeholder="Add a comment"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-grow mr-2 border border-gray-300 rounded px-2 py-1 focus:outline-none"
                    ></textarea>
                    <button onClick={handleComment} className="btn btn-primary">
                      Comment
                    </button>
                  </div>
                </div>

                {/* Recommended Videos */}
                <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
                  <h2 className="text-xl font-bold mb-2">Recommended Videos</h2>
                  <div className="overflow-y-auto" style={{ height: "400px" }}>
                    {projects.map((project) => (
                      <div>
                        <button
                          type="button"
                          className="btn btn-accent  border border-indigo-600 rounded-md p-2"
                          key={project.id}
                          data-id={project.id}
                          onClick={() => selectedProjectID(project.id)}
                        >
                          <h3 className="text-xl">{project.projectTitle}</h3>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advertisement 300x400*/}
                <div className="bg-gray-300 rounded-lg shadow-lg p-2 mb-4">
                  <AdsComponent_300_400 />
                </div>

                {/* Advertisement 300x400*/}
                <div className="bg-gray-300 rounded-lg shadow-lg p-2 mb-4">
                  <AdsComponent_300_600 />
                </div>
              </div>
            </div>
          </div>

          {/* Advertisment 728x90 */}
          <div class="flex flex-col">
            <div>
              <div className="bg-gray-300 shadow-lg mt-2 mb-3 rounded-lg">
                <AdsComponent_728_90 />
              </div>
            </div>
          </div>
        </>
      )}

      {error && <p>{error}</p>}
      <div className="mb-5 mt-5"></div>
      <br />

      <BottomNav />
    </div>
  );
};

export default ProjectInfo;
