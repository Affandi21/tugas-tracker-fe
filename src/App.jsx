import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoursesPage from "./pages/CoursesPage";
import TasksPage from "./pages/TasksPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/courses/:courseId" element={<TasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}
