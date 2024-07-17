"use client"

import "@/app/style/course-homepage.css";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import Markdown from "../../../components/markdown-renderer"
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudyPlan() {
    const [token, setToken] = useState<string>("");
    const [studyPlanUrl, setStudyPlanUrl] = useState<string | null>(null);
    const params = useParams<{ course_id: string }>();
    const course_id = params.course_id;

    useEffect(() => {
        setToken(Cookies.get("authToken") || "");
    }, []);

    useEffect(() => {
        if (token) {
        fetchCourseData(course_id);
        }
    }, [token, course_id]);

    const fetchCourseData = async (course_id: string) => {
        await backendAPI
          .get(`/course/${course_id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setStudyPlanUrl(response.data.study_plan_url);
          })
          .catch((error) => {
            console.error("Error fetching course data:", error);
          });
      };

    return (
        <div>
        {studyPlanUrl ? (
          <Markdown url={studyPlanUrl} />
        ) : (
          <p>Loading study plan...</p>
        )}
      </div>
    );
}

// the <Markdown> component is rendered only when studyPlanUrl is not null. 

// While the studyPlanUrl is being fetched, a "Loading study plan..." message is displayed. 