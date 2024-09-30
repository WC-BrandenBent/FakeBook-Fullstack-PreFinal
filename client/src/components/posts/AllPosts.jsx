import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest, fetchAllPosts } from "../../api/api";
import "./AllPosts.css";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches all posts from the backend.
   */
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const data = await await fetchAllPosts();
        setPosts(data.posts);
      } catch (error) {
        setError(error.message || "Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    getAllPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (posts.length === 0) {
    return <div>No posts available.</div>;
  }

  return (
    <div className="all-posts-container">
      <h2>All Posts</h2>
      <ul className="posts-list">
        {posts.map((post) => (
          <li key={post.post_id} className="post-item">
            <Link to={`/posts/${post.post_id}`} className="post-link">
              <h3>
                {post.content.slice(0, 50)}
                {post.content.length > 50 ? "..." : ""}
              </h3>
              {/* <p className="poster">By: {post.username}</p> */}
              <p>Date: {new Date(post.timestamp).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllPosts;
