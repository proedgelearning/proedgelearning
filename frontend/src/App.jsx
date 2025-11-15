import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { Analytics } from "@vercel/analytics/next"
import About from "./pages/About";
import CoursesPage from "./pages/Courses";
import ApplicationForm from "./pages/ApplicationForm";
import Contactus from "./pages/Contactus";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import AboutUs from "./sections/AboutUs";
import EducationSystem from "./sections/EducationSystem";
import Expertise from "./sections/Expertise";
import Courses from "./sections/Courses";
import Enroll from "./sections/Enroll";
import Login from "./pages/Login";
import DashboardLayout from "./dashboard/components/DashboardLayout";
import BasicComputer from "./pages/courses/BasicComputer";
import ExcelBasic from "./pages/courses/ExcelBasic";
import ExcelAdvanced from "./pages/courses/ExcelAdvanced";
import ExcelVBA from "./pages/courses/ExcelVBA";
import SQLBasic from "./pages/courses/SQLBasic";
import SQLAdvanced from "./pages/courses/SQLAdvanced";
import PowerBI from "./pages/courses/PowerBI";
import PowerAutomate from "./pages/courses/PowerAutomate";
import PowerPlatform from "./pages/courses/PowerPlatform";
import PromptEngineering from "./pages/courses/PromptEngineering";
import FinancialPlanning from "./pages/courses/FinancialPlanning";
import HumanResource from "./pages/courses/HumanResource";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      {/* Scroll to top on every route change */}
      <ScrollToTop behavior="smooth" />

      <Routes>
        {/* Public Website */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <Hero />
              <Features />
              <AboutUs />
              <EducationSystem />
              <Expertise />
              <Courses />
              <Enroll />
              <Footer />
            </>
          }
        />

        {/* Pages */}
        <Route
          path="/about"
          element={
            <>
              <Header />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="/courses"
          element={
            <>
              <Header />
              <CoursesPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/application"
          element={
            <>
              <Header />
              <ApplicationForm />
              {/* <Footer /> */}
            </>
          }
        />

        <Route
          path="/contactus"
          element={
            <>
              <Header />
              <Contactus />
              <Footer />
            </>
          }
        />

        {/* Course Details */}
        <Route path="/course/basic-computer" element={<BasicComputer />} />
        <Route path="/course/excel-basic" element={<ExcelBasic />} />
        <Route path="/course/excel-advanced" element={<ExcelAdvanced />} />
        <Route path="/course/excel-vba" element={<ExcelVBA />} />
        <Route path="/course/sql-basic" element={<SQLBasic />} />
        <Route path="/course/sql-advanced" element={<SQLAdvanced />} />
        <Route path="/course/powerbi" element={<PowerBI />} />
        <Route path="/course/power-automate" element={<PowerAutomate />} />
        <Route path="/course/power-platform" element={<PowerPlatform />} />
        <Route path="/course/prompt-engineering" element={<PromptEngineering />} />
        <Route path="/course/financial-planning" element={<FinancialPlanning />} />
        <Route path="/course/human-resource" element={<HumanResource />} />

        {/* Login */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Dashboard (Protected Route) */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
