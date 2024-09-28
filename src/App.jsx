import React, { useState, useEffect, useCallback, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import JoblyApi from "../api";
import { jwtDecode } from "jwt-decode";
import useLocalStorage from "./useLocalStorage";
import Nav from "./Nav";
import Homepage from "./Homepage";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";
import JobsList from "./JobsList";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import UserProfile from "./UserProfile";
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage("jobly_token");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      if (token) {
        try {
          JoblyApi.token = token;
          const { username } = jwtDecode(token);
          const user = await JoblyApi.getCurrentUser(username);
          setCurrentUser(user);
          setAppliedJobs(user.applications);
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };
    getCurrentUser();
  }, [token]);

  const login = async (loginData) => {
    try {
      const token = await JoblyApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Login failed", err);
      return { success: false, error: err };
    }
  };

  const signup = async (signupData) => {
    try {
      const token = await JoblyApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (err) {
      console.error("Signup failed", err);
      return { success: false, error: err };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  const applyToJob = useCallback(async (jobId) => {
    if (currentUser) {
      try {
        await JoblyApi.applyToJob(currentUser.username, jobId);
        setAppliedJobs(prev => [...prev, jobId]);
        return { success: true };
      } catch (err) {
        console.error("Error applying to job", err);
        return { success: false, error: err };
      }
    }
  }, [currentUser]);

  const unapplyFromJob = useCallback(async (jobId) => {
    if (currentUser) {
      try {
        await JoblyApi.unapplyFromJob(currentUser.username, jobId);
        setAppliedJobs(prev => prev.filter(id => id !== jobId));
        return { success: true };
      } catch (err) {
        console.error("Error unapplying from job", err);
        return { success: false, error: err };
      }
    }
  }, [currentUser]);

  const memoizedRoutes = useMemo(() => (
    <Routes>
      <Route path="/" element={<Homepage currentUser={currentUser} />} />
      <Route path="/companies" element={
        currentUser ? (
          <CompanyList />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/companies/:handle" element={
        currentUser ? (
          <CompanyDetails applyToJob={applyToJob} appliedJobs={appliedJobs} />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/jobs" element={
        currentUser ? (
          <div className="Jobs">
            <h2>Job Listings</h2>
            <JobsList
              applyToJob={applyToJob}
              unapplyFromJob={unapplyFromJob}
              appliedJobs={appliedJobs}
            />
          </div>
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route path="/login" element={<LoginForm login={login} />} />
      <Route path="/signup" element={<SignupForm signup={signup} />} />
      <Route
        path="/profile"
        element={
          currentUser ? (
            <UserProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  ), [currentUser, appliedJobs, applyToJob, unapplyFromJob, login, signup]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Nav currentUser={currentUser} logout={logout} />
        {memoizedRoutes}
      </BrowserRouter>
    </div>
  );
}

export default App;