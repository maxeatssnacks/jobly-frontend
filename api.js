import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

class JoblyApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response?.data?.error?.message;
      throw Array.isArray(message) ? message : [message || "An error occurred. Please try again."];
    }
  }

  // Get all companies
  static async getCompanies(name) {
    let res = await this.request("companies", name ? { name } : null);
    return res.companies;
  }

  // Get details on a company by handle, including its jobs
  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  // Get all jobs
  static async getJobs(title) {
    let res = await this.request("jobs", title ? { title } : {});
    return res.jobs;
  }

  // Apply to a job
  static async applyToJob(username, jobId) {
    await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
  }

  // Get the current user
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    // Ensure the backend is sending the most up-to-date applications list
    return res.user;
  }

  // Login user
  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  // Signup user
  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  // Save user profile
  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }

  // Decode token
  static decodeToken(token) {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  }

  // Set token
  static setToken(token) {
    JoblyApi.token = token;
    localStorage.setItem("jobly-token", token);
  }

  // Get token
  static getToken() {
    return JoblyApi.token || localStorage.getItem("jobly-token");
  }

  // Clear token
  static clearToken() {
    JoblyApi.token = null;
    localStorage.removeItem("jobly-token");
  }

  // Get job by ID
  static async getJob(id) {
    let res = await this.request(`jobs/${id}`);
    return res.job;
  }

  // Unapply from a job
  static async unapplyFromJob(username, jobId) {
    await this.request(`users/${username}/jobs/${jobId}`, {}, "delete");
  }
}

export default JoblyApi;