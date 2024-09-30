import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { createPost } from "../../api/api";

function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const { token } = useContext(AuthContext); // Fetch the JWT token from the AuthContext
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty");
      return;
    }

    // setError(null);

    try {
      const response = await createPost(
        "/posts",
        "POST",
        { content },
        { token }
      );

      if (response.error) {
        setError(response.error);
      } else {
        onPostCreated(); // Call the parent component to refresh posts
        setContent(""); // Reset the post content after successful creation
      }
    } catch (err) {
      setError("An error occurred while creating the post");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
        />
        <button type="submit">Submit Post</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default CreatePost;
