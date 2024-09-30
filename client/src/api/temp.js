// // src/api/api.js

// const API_BASE_URL = "http://localhost:5000"; // Adjust based on your backend URL

// /**
//  * Retrieves the authentication token from localStorage.
//  * @returns {string|null} The JWT token if present, else null.
//  */
// const getAuthToken = () => {
//   const token = localStorage.getItem('tokens');
//   return token ? JSON.parse(token) : null;
// };

// /**
//  * Generic function to handle API requests.
//  * @param {string} endpoint - The API endpoint (e.g., '/login').
//  * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
//  * @param {object|null} data - The request payload for methods like POST and PUT.
//  * @returns {Promise<object>} The JSON response from the API.
//  * @throws Will throw an error if the response is not ok.
//  */
// const apiRequest = async (endpoint, method = 'GET', data = null) => {
//   const url = `${API_BASE_URL}${endpoint}`;
//   const headers = {
//     'Content-Type': 'application/json',
//   };

//   // Include the Authorization header if a token is available
//   const token = getAuthToken();
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const config = {
//     method,
//     headers,
//   };

//   if (data) {
//     config.body = JSON.stringify(data);
//   }

//   try {
//     const response = await fetch(url, config);
//     const responseData = await response.json();

//     if (!response.ok) {
//       // Throw an error with the message from the response or a default message
//       throw new Error(responseData.error || 'API request failed');
//     }

//     return responseData;
//   } catch (error) {
//     console.error(`Error during API request to ${endpoint}:`, error);
//     throw error;
//   }
// };

// /**
//  * Logs in a user by sending their credentials to the backend.
//  * @param {string} username - The user's username.
//  * @param {string} password - The user's password.
//  * @returns {Promise<object>} The response containing the access token and user data.
//  */
// export const loginUser = async (username, password) => {
//   return await apiRequest('/login', 'POST', { username, password });
// };

// /**
//  * Fetches all posts made by the authenticated user.
//  * @returns {Promise<object>} The response containing the user's posts.
//  */
// export const fetchUserPosts = async () => {
//   return await apiRequest('/user/posts', 'GET');
// };

// /**
//  * Fetches all posts from all users.
//  * @returns {Promise<object>} The response containing all posts.
//  */
// export const fetchAllPosts = async () => {
//   return await apiRequest('/posts', 'GET');
// };

// /**
//  * Creates a new post for the authenticated user.
//  * @param {string} content - The content of the post.
//  * @returns {Promise<object>} The response containing the newly created post.
//  */
// export const createPost = async (content) => {
//   return await apiRequest('/posts', 'POST', { content });
// };

// /**
//  * Fetches comments for a specific post.
//  * @param {number} postId - The ID of the post.
//  * @returns {Promise<object>} The response containing comments for the post.
//  */
// export const fetchComments = async (postId) => {
//   return await apiRequest(`/posts/${postId}/comments`, 'GET');
// };

// /**
//  * Adds a new comment to a specific post.
//  * @param {number} postId - The ID of the post.
//  * @param {string} content - The content of the comment.
//  * @returns {Promise<object>} The response containing the newly added comment.
//  */
// export const addComment = async (postId, content) => {
//   return await apiRequest(`/posts/${postId}/comments`, 'POST', { content });
// };

// /**
//  * Edits an existing comment.
//  * @param {number} commentId - The ID of the comment.
//  * @param {string} content - The updated content of the comment.
//  * @returns {Promise<object>} The response containing the updated comment.
//  */
// export const editComment = async (commentId, content) => {
//   return await apiRequest(`/comments/${commentId}`, 'PUT', { content });
// };

// /**
//  * Deletes a comment.
//  * @param {number} commentId - The ID of the comment.
//  * @returns {Promise<object>} The response confirming deletion.
//  */
// export const deleteComment = async (commentId) => {
//   return await apiRequest(`/comments/${commentId}`, 'DELETE');
// };
