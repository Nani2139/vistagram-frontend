import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put("/auth/profile", data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.post("/auth/change-password", data);
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data.data; // Extract the data from the response
  },
  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data.data; // Extract the data from the response
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  createPost: (postData) => {
    if (postData instanceof FormData) {
      return api.post("/posts", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }
    return api.post("/posts", postData);
  },
  likePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
  unlikePost: async (id) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
  sharePost: async (id) => {
    const response = await api.post(`/posts/${id}/share`);
    return response.data;
  },
  addComment: async (id, text) => {
    const response = await api.post(`/posts/${id}/comment`, { text });
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getUsers: async (page = 1, limit = 20, search = "") => {
    const response = await api.get(
      `/users?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  },
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  getUserPosts: async (id, page = 1, limit = 12) => {
    const response = await api.get(
      `/users/${id}/posts?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  followUser: async (id) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },
  getFollowers: async (id, page = 1, limit = 20) => {
    const response = await api.get(
      `/users/${id}/followers?page=${page}&limit=${limit}`
    );
    return response.data;
  },
  getFollowing: async (id, page = 1, limit = 20) => {
    const response = await api.get(
      `/users/${id}/following?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};

// Main API object with all methods
const apiService = {
  // Auth
  register: authAPI.register,
  login: authAPI.login,
  getMe: authAPI.getMe,
  updateProfile: authAPI.updateProfile,
  changePassword: authAPI.changePassword,

  // Posts
  getPosts: postsAPI.getPosts,
  getFeed: postsAPI.getFeed,
  getPost: postsAPI.getPost,
  createPost: postsAPI.createPost,
  likePost: postsAPI.likePost,
  unlikePost: postsAPI.unlikePost,
  sharePost: postsAPI.sharePost,
  addComment: postsAPI.addComment,
  deletePost: postsAPI.deletePost,

  // Users
  getUsers: usersAPI.getUsers,
  getUser: usersAPI.getUser,
  getUserPosts: usersAPI.getUserPosts,
  followUser: usersAPI.followUser,
  getFollowers: usersAPI.getFollowers,
  getFollowing: usersAPI.getFollowing,
};

export default apiService;
