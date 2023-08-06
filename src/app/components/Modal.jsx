"use client";
import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import { firestore } from "@/app/authenticate/firebase";

const Modal = ({ id }) => {
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const projectRef = firestore.collection("projectWork").doc(id);
      const doc = await projectRef.get();

      if (doc.exists) {
        const projectData = { id: doc.id, ...doc.data() };
        setProject(projectData);
      } else {
        setProject(null);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  if (!project) {
    return null; // Return null if project is not available or still loading
  }

  return (
    <dialog id="my_modal_4" className="modal">
      <form method="dialog" className="modal-box w-full sm:w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg">{project.projectTitle}</h3>
        <p>Video ID: {project.id}</p>
        <p>{project.description}</p>
        <VideoPlayer videoId={project.demoLink} />
        <div className="modal-action">
          <button className="btn">Close</button>
        </div>
      </form>
    </dialog>
  );
};

export default Modal;
