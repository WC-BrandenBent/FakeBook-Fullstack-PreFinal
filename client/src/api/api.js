const API_BASE_URL = process.env.REACT_APP_FLASK_API_ENDPOINT;

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string|null} The JWT token if present, else null.
 */
// const getAuthToken = () => {
//     const token = localStorage.getItem("tokens");
//     try {
//         return token ? JSON.parse(token) : null;
//     } catch (error) {
//         console.error("Error parsing token from localStorage:", error);
//         return null;
//     }
// }

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? JSON.parse(token) : null;
  };


/**
 * Generic function to handle API requests.
 * @param {string} endpoint - The API endpoint to call ("/login", "/posts", etc.).
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {object|null} data - The request payload for methods like POST and PUT, "what the user is sending to the server"
 * @returns {Promise<object>} The JSON response from the API, "what the server sends back to the user"""
 * @throws Will throw an error if the response is not ok.
 */

export const apiRequest = async (endpoint, method = 'GET', data = null) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
    };
    
    const token = getAuthToken();

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    } else {
        console.warn("No token found, user is not authenticated");
    }

    const config = {
        method,
        headers,
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const responseData = await response.json();


        if (!response.ok) {
            throw new Error(responseData.error || "API request failure");
        }
        
        console.log(`API request to ${endpoint} succeeded:`, responseData);
        return responseData;
      } catch (error) {
        console.error(`Error during API request to ${endpoint}:`, error);
        throw error;
      }

};


/**
 * Logs in a user by sending their credentials to the backend.
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response containing the access token and user data.
 */

export const loginUser = async (username, password) => {
    return await apiRequest('/login', 'POST', { username, password });
  };

/**
 * Fetches all posts made by the authenticated user.
 * @returns {Promise<object>} The response containing the user's posts.
 */

export const fetchUserPosts = async () => {
    return apiRequest("/user/posts", "GET");
};

/**
 * Fetches all posts from all users.
 * @returns {Promise<object>} The response containing all posts.
 */
export const fetchAllPosts = async () => {
    return await apiRequest('/posts', 'GET');
  };

/**
 * Fetches a specific post by ID.
 * @param {number} postId - The ID of the post to fetch.
 * @returns {Promise<object>} The response containing the post data.
 */
export const fetchPostById = async (postId) => {
    return await apiRequest(`/posts/${postId}`, 'GET');
  };
  

/**
 * Creates a new post.
 * @param {string} content - The content of the post.
 * @returns {Promise<object>} The response containing the new post data.
 */
export const createPost = async (content) => {
    return await apiRequest('/posts', 'POST', { content }, { token });
  };
  
  /**
   * (Optional) Edits an existing post.
   * @param {number} postId - The ID of the post to edit.
   * @param {string} newContent - The updated content of the post.
   * @returns {Promise<object>} The response containing the updated post data.
   */
  export const editPost = async (postId, newContent) => {
    return await apiRequest(`/posts/${postId}`, 'PUT', { content: newContent });
  };
  
  /**
   * (Optional) Deletes a post.
   * @param {number} postId - The ID of the post to delete.
   * @returns {Promise<object>} The response confirming deletion.
   */
  export const deletePost = async (postId) => {
    return await apiRequest(`/posts/${postId}`, 'DELETE');
  };
  
  /**
   * Fetches comments for a specific post.
   * @param {number} postId - The ID of the post.
   * @returns {Promise<Array>} The response containing comments.
   */
  export const fetchCommentsByPostId = async (postId) => {
    return await apiRequest(`/posts/${postId}/comments`, 'GET');
  };
  
  /**
   * Adds a new comment to a post.
   * @param {number} postId - The ID of the post to comment on.
   * @param {string} content - The content of the comment.
   * @returns {Promise<object>} The response containing the new comment data.
   */
  export const addComment = async (postId, content) => {
    return await apiRequest(`/posts/${postId}/comments`, 'POST', { content });
  };
  
  /**
   * Edits an existing comment.
   * @param {number} commentId - The ID of the comment to edit.
   * @param {string} newContent - The updated content of the comment.
   * @returns {Promise<object>} The response containing the updated comment data.
   */
  export const editComment = async (commentId, newContent) => {
    return await apiRequest(`/comments/${commentId}`, 'PUT', { content: newContent });
  };
  
  /**
   * Deletes a comment.
   * @param {number} commentId - The ID of the comment to delete.
   * @returns {Promise<object>} The response confirming deletion.
   */
  export const deleteComment = async (commentId) => {
    return await apiRequest(`/comments/${commentId}`, 'DELETE');
  };
  
  /**
   * (Optional) Fetches comments authored by the authenticated user.
   * @returns {Promise<object>} The response containing the user's comments.
   */
  export const fetchUserComments = async () => {
    return await apiRequest('/user/comments', 'GET');
  };