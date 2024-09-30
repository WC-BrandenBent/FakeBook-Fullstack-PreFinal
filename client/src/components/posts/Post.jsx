import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import Comment from "../comments/Comment";
import "./Posts.css";

function Post({ postId, onCommentAdded, onCommentUpdated, onCommentDeleted }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await apiRequest(`/posts/${postId}`); // we dont need to specify 'GET' method because it is the default we set in the api.js file
        setPost(data.post);
        setComments(data.comments);
      } catch (error) {
        console.log("Failed to fetch post", error);
      }
    };
    fetchPost();
  }, [postId]);

  // Fetch comments related to the post
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const commentsData = await apiRequest(
          `/posts/${postId}/comments`,
          "GET"
        );
        setComments(commentsData);
      } catch (err) {
        setError(err.message || "Failed to fetch comments.");
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [postId]);

  /**
   * Handles adding a new comment.
   * @param {object} newCommentData - The newly created comment data.
   */
  const handleCommentAdded = (newCommentData) => {
    setComments([...comments, newCommentData]);
  };

  /**
   * Handles updating an existing comment.
   * @param {object} updatedComment - The updated comment data.
   */
  const handleCommentUpdated = (updatedComment) => {
    setComments(
      comments.map((comment) =>
        comment.comment_id === updatedComment.comment_id
          ? updatedComment
          : comment
      )
    );
  };

  /**
   * Handles deleting a comment.
   * @param {number} commentId - The ID of the comment to delete.
   */
  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((comment) => comment.comment_id !== commentId));
  };

  /**
   * Handles the submission of a new comment.
   */
  const handleNewCommentSubmit = async () => {
    if (newComment.trim() === "") return;

    try {
      const response = await apiRequest(`/posts/${postId}/comments`, "POST", {
        content: newComment,
      });
      setComments([...comments, response]);
      setNewComment("");
    } catch (err) {
      setError(err.message || "Failed to add comment.");
    }
  };

  if (loadingPost) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!post) {
    return <div>Post not found.</div>;
  }
  return (
    <div className="post">
      <h2>{post.content}</h2>
      <p>Posted by: {post.username}</p>
      <p>Date: {new Date(post.timestamp).toLocaleString()}</p>

      <div className="comments-section">
        <h3>Comments:</h3>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.comment_id}
              comment={comment}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
            />
          ))
        )}
      </div>

      <div className="add-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows="3"
        ></textarea>
        <button onClick={handleNewCommentSubmit}>Post Comment</button>
      </div>
    </div>
  );
}

export default Post;
