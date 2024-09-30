import { useState, useContext } from "react";
import { editComment, deleteComment } from "../../api/api";
import "./Comment.css";

function Comment({ comment, onCommentUpdated, onCommentDeleted }) {
  const { user } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.content);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handles the submission of an edited comment.
   */

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!editedContent.trim()) {
      setError("Comment content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const updatedComment = await editComment(
        comment.comment_id,
        editedContent
      );
      onCommentUpdated(updatedComment); // this function is passed down from the parent component and calling it will update the state of the parent component
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update comment.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the deletion of a comment.
   */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    try {
      await deleteCommentAPI(comment.comment_id);
      onCommentDeleted(comment.comment_id); // this function is passed down from the parent component and calling it will update the state of the parent component
    } catch (error) {
      setError(error.message || "Failed to delete comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment">
      {isEditing ? (
        <form onSubmit={handleEditSubmit} className="edit-comment-form">
          {error && <div className="error-message">{error}</div>}
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows="3"
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p className="comment-content">{comment.content}</p>
          <div className="comment-info">
            <span className="comment-author">{comment.username}</span>
            <span className="comment-timestamp">
              {new Date(comment.timestamp).toLocaleString()}
            </span>
          </div>
          {user && user.user_id === comment.user_id && (
            <div className="comment-actions">
              <button onClick={() => setIsEditing(true)} disabled={loading}>
                Edit
              </button>
              <button onClick={handleDelete} disabled={loading}>
                Delete
              </button>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </>
      )}
    </div>
  );
}

export default Comment;
