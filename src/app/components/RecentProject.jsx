"use client";
import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { firestore } from "@/app/authenticate/firebase";

const RecentProject = () => {
  const [projects, setProjects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const scrollToNext = () => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex(currentIndex + 1);
      scrollContainerRef.current.scrollLeft +=
        scrollContainerRef.current.offsetWidth;
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      scrollContainerRef.current.scrollLeft -=
        scrollContainerRef.current.offsetWidth;
    }
  };

  return (
    <div className="container mx-auto px-4 mb-5 mt-3">
      <h3 className="font-bold text-3xl mt-3 josefin" id="projects">
        Projects
      </h3>
      <div className="flex justify-center items-center mt-2">
        <button
          className="btn btn-circle  p-2 mr-2"
          onClick={scrollToPrev}
          disabled={currentIndex === 0}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="flex overflow-x-auto px-4" ref={scrollContainerRef}>
          {projects.map((project, index) => (
            <a
              href={`/projectinfo?projectId=${project.demoLink}`}
              target="_blank"
            >
              <img
                key={index}
                src={project.image}
                alt={`Image ${index + 1}`}
                className={`max-w-xs rounded-lg shadow-lg bg-white p-2 mr-4 ${
                  currentIndex === index ? "border-4 border-blue-500" : ""
                }`}
              />
            </a>
          ))}
        </div>
        <button
          className="btn btn-circle  p-2 ml-2"
          onClick={scrollToNext}
          disabled={currentIndex === projects.length - 1}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default RecentProject;
