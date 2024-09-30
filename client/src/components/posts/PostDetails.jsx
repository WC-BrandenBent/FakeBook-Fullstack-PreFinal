import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Post from "./Post"; // instead of rewriting everything here, just reuse the already finished Post component
import { fetchPostById } from "../../api/api";

function PostDetails() {
  const { postId } = useParams(); // useParams will extract the postId from the URL parameters
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      try {
        const postData = await fetchPostById();
        setPost(postData);
      } catch (err) {
        setError(err.message || "Failed to fetch post.");
      } finally {
        setLoadingPost(false);
      }
    };

    getPost();
  }, [postId]);

  /**
   * Fetches comments for the specific post.
   */
  useEffect(() => {
    const getCommentsById = async () => {
      try {
        const commentsData = await fetchCommentsByPostId(postId);
        setComments(commentsData);
      } catch (err) {
        setError(err.message || "Failed to fetch comments.");
      } finally {
        setLoadingComments(false);
      }
    };

    getCommentsById();
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
    <div className="post-detail-container">
      <Post
        postId={postId}
        post={post}
        comments={comments}
        onCommentAdded={handleCommentAdded}
        onCommentUpdated={handleCommentUpdated}
        onCommentDeleted={handleCommentDeleted}
      />
    </div>
  );
}

export default PostDetails;
