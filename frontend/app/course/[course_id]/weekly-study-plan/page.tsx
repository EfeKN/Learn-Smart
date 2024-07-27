"use client";

import "@/app/style/course-homepage.css";
import backendAPI from "@/environment/backend_api";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Markdown from "../../../components/markdown-renderer";

export default function StudyPlan() {
  const [token, setToken] = useState<string>("");
  const [studyPlan, setStudyPlan] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;
  const router = useRouter();

  useEffect(() => {
    setToken(Cookies.get("authToken") || null);
  }, []);

  useEffect(() => {
    if (token) {
      fetchStudyPlanData(course_id);
    }
  }, [token, course_id]);

  if (token == null) {
    router.replace("/login");
  }

  const fetchStudyPlanData = async (course_id: string) => {
    try {
      setLoading(true);
      const response = await backendAPI.get(`/course/${course_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const studyPlanUrl = response.data.course_study_plan_url;

      // TODO:

      /*

        await backendAPI.get(`${studyPlanUrl}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        
              // => This gives the location: http://localhost:8000/api/files/course_2/study_plan.md
             // When api is removed from the path, the component works as expected
        
      */

      // ========================= TEMPORARY FIX =========================
      const temp_backendAPI = axios.create({
        baseURL: "http://localhost:8000/",
      });
      // ========================= TEMPORARY FIX =========================

      const studyPlanResponse = await temp_backendAPI.get(`${studyPlanUrl}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setStudyPlan(studyPlanResponse.data);
    } catch (error) {
      console.error("Error fetching course data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg max-w-3xl mx-auto">
      <div className="flex items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-auto"
          >
            Back
          </button>
        </div>
        <h1 className="text-2xl font-bold mx-auto">Study Plan</h1>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <Markdown content={studyPlan} />
      )}
    </div>
  );
}
