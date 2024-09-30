import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { fetchUserPosts } from "../api/api";
import CreatePost from "../components/posts/CreatePost";
import "./Profile.css";

function Profile() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const data = await fetchUserPosts();
        setPosts(data.posts);
      } catch (error) {
        console.log("Failed to fetch posts", error);
      }
    };
    getUserPosts();
  }, []);

  return (
    <>
      <div className="profile-page">
        <h2 className="profile-username">{user.username}'s Profile</h2>
        <p className="profile-bio">{user.bio}</p>
        <h3 className="profile-posts-title">Your Posts:</h3>
        {posts.length === 0 ? (
          <p className="no-posts-message">You have no posts yet.</p>
        ) : (
          <ul className="posts-list">
            {posts.map((post) => (
              <li key={post.post_id} className="post-item">
                <p className="post-content">{post.content}</p>
                <small className="post-timestamp">
                  {new Date(post.timestamp).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>
      <CreatePost></CreatePost>
    </>
  );
}

export default Profile;
