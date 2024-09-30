import React, { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import CreatePost from "./CreatePost";

function PostFeed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const response = await apiRequest("/posts", "GET");
    setPosts(response);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostCreated = () => {
    fetchPosts(); // Refresh the posts when a new post is created
  };

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />

      <div className="post-list">
        {posts.map((post) => (
          <div key={post.post_id} className="post-item">
            <p>{post.content}</p>
            <small>
              Posted by user {post.user_id} at {post.timestamp}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostFeed;
