"use client"

import "@/app/style/course-homepage.css";
import backendAPI from "@/environment/backend_api";
import Cookies from "js-cookie";
import Markdown from "../../../components/markdown-renderer"
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudyPlan() {
  const [token, setToken] = useState<string>("");
  const [studyPlan, setStudyPlan] = useState<string>("");
  const params = useParams<{ course_id: string }>();
  const course_id = params.course_id;

  useEffect(() => {
      setToken(Cookies.get("authToken") || "");
  }, []);

  useEffect(() => {
      if (token) {
        fetchStudyPlanData(course_id);
      }
  }, [token, course_id]);

  const fetchStudyPlanData = async (course_id: string) => {
    try {
      const response = await backendAPI.get(`/course/${course_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const studyPlanUrl = response.data.study_plan_url;
      
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
        baseURL: 'http://localhost:8000/',
      })
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
    }
  };   

  return (
    <div>
      <Markdown content={studyPlan} />  
    </div>
  );
}