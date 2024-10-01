from app import app, db, bcrypt
from flask import jsonify, request
from models import User, Post, Comment
from datetime import datetime
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)


@app.route("/login", methods=["POST"])
def login_user():
    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if user is None:
        print(f"Login attempt failed for username: {username}")
        return jsonify({"error": f"Invalid username: {username}"}), 401

    if not bcrypt.check_password_hash(user.password, password):
        print(f"Invalid password attempt for username: {username}")
        return jsonify({"error": "Invalid password"}), 401

    # Create a new access token for the user
    access_token = create_access_token(identity=user.user_id)

    # Store the user data in the session. We should create a new user_data object rather than send the user object directly because the user object may contain information we don't want to expose to the client (in this case, the password)
    user_data = {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
    }

    print(f"User {username} successfully logged in.")

    return jsonify({"access_token": access_token, "user": user_data}), 200


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Successfully logged out"})
    print(response)
    unset_jwt_cookies(response)
    return response, 200


@app.route("/user/posts", methods=["GET"])
@jwt_required()
def get_user_posts():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Below will return all posts for the user, but instead I'll also oder the posts by descending timestampost so that they are returned in the order they were created on the next line
    # posts = Post.query.filter_by(user_id=user_id).all()

    posts = Post.query.filter_by(user_id=user_id).order_by(Post.timestamp.desc()).all()

    # For Loopost Method: This likely looks more familiar to you, create an empty array, and loopost through the list of posts, appending each post to the array in the desired format. This is a more verbose way to achieve the same result as the list comprehension method below, but is easier to understand for beginners AND can be more readable for operations much more complex than this one

    # posts_data = []

    # for post in posts:
    #     posts_data.append(
    #         {
    #             "post_id": post.post_id,
    #             "content": post.content,
    #             "timestamp": post.timestamp.isoformat(),
    #         }
    #     )

    # List Comphrehension Method: A more concise way to achieve the same result as the for loopost method above, iterating over the list of posts and creating a new dictionary for each post. The results are identical to the previous method, but this is more "pythonic" and concise.

    posts_data = [
        {
            "post_id": post.post_id,
            "content": post.content,
            "timestamp": post.timestamp.isoformat(),
        }
        for post in posts
    ]

    print(posts_data)

    return jsonify({"posts": posts_data}), 200


@app.route("/register", methods=["POST"])
def register_user():

    data = request.get_json()

    user_exists = (
        User.query.filter_by(username=data.get("username")).first() is not None
    )

    if user_exists:
        return (
            jsonify({"error": "User already exists"}),
            409,
        )  # 409 Conflict status code

    # user = User(**data) shortcut to create a new user object, but we want to hash the password first before saving it to the database

    username = data.get("username")
    password = data.get("password")
    email = data.get("email")
    bio = data.get("bio")

    hashed_password = bcrypt.generate_password_hash(password)

    user = User(username=username, password=hashed_password, email=email, bio=bio)

    db.session.add(user)
    db.session.commit()

    return jsonify(user.to_json())


@app.route("/users", methods=["GET"])
def get_users():

    users = User.query.all()
    return jsonify([user.to_json() for user in users])


# POST ROUTING


@app.route("/posts", methods=["GET"])
@jwt_required()
def get_all_posts():
    posts = Post.query.all()
    posts_data = []
    for post in posts:
        posts_data.append(
            {
                "post_id": post.post_id,
                "user_id": post.user_id,
                "content": post.content,
                "timestamp": post.timestamp.isoformat() + "Z",
            }
        )
    return jsonify({"posts": posts_data}), 200


@app.route("/posts", methods=["POST"])
@jwt_required()
def create_post():
    global post_id_counter
    current_user = get_jwt_identity()
    data = request.get_json()

    if not data or "content" not in data or not data["content"].strip():
        return jsonify({"error": "Post content is required."}), 400

    new_post = Post(
        post_id=post_id_counter,
        user_id=current_user["user_id"],
        content=data["content"],
    )
    db.session.add(new_post)
    db.session.commit()
    post_id_counter += 1

    post_data = {
        "post_id": new_post.post_id,
        "user_id": new_post.user_id,
        "content": new_post.content,
        "timestamp": new_post.timestamp.isoformat() + "Z",
    }

    return jsonify(post_data), 201


@app.route("/posts/<int:post_id>", methods=["GET"])
@jwt_required()
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found."}), 404
    post_data = {
        "post_id": post.post_id,
        "user_id": post.user_id,
        "content": post.content,
        "timestamp": post.timestamp.isoformat()
        + "Z",  # Add "Z" to the end of the timestamp to indicate that it is in UTC time, isoformat() returns the timestamp in UTC time, and will prevent date conversion issues when the timestamp is sent to the client
    }
    return jsonify(post_data), 200


@app.route("/posts/<int:post_id>/comments", methods=["GET"])
@jwt_required()
def get_comments(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found."}), 404
    comments = Comment.query.filter_by(post_id=post_id).all()
    comments_data = []
    for comment in comments:
        comments_data.append(
            {
                "comment_id": comment.comment_id,
                "post_id": comment.post_id,
                "user_id": comment.user_id,
                "content": comment.content,
                "timestamp": comment.timestamp.isoformat() + "Z",
            }
        )
    return jsonify(comments_data), 200


@app.route("/comments/<int:comment_id>", methods=["PUT"])
@jwt_required()
def edit_comment(comment_id):
    """
    Edits an existing comment.
    """
    # Get current user identity
    current_user = get_jwt_identity()
    user = User.query.get(current_user["user_id"])
    if not user:
        return jsonify({"error": "User not found."}), 404

    # Fetch the comment
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment not found."}), 404

    # Check if the current user is the author of the comment
    if comment.user_id != user.user_id:
        return jsonify({"error": "Unauthorized to edit this comment."}), 403

    # Get JSON data
    data = request.get_json()
    if not data or "content" not in data or not data["content"].strip():
        return jsonify({"error": "Comment content is required."}), 400

    # Update comment
    comment.content = data["content"].strip()
    db.session.commit()

    # Serialize updated comment
    updated_comment = {
        "comment_id": comment.comment_id,
        "post_id": comment.post_id,
        "user_id": comment.user_id,
        "content": comment.content,
        "timestamp": comment.timestamp.isoformat() + "Z",
    }

    return jsonify(updated_comment), 200


@app.route("/comments/<int:comment_id>", methods=["DELETE"])
@jwt_required()
def delete_comment(comment_id):
    """
    Deletes a specific comment.
    """
    # Get current user identity
    current_user = get_jwt_identity()
    user = User.query.get(current_user["user_id"])
    if not user:
        return jsonify({"error": "User not found."}), 404

    # Fetch the comment
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment not found."}), 404

    # Check if the current user is the author of the comment
    if comment.user_id != user.user_id:
        return jsonify({"error": "Unauthorized to delete this comment."}), 403

    # Delete comment
    db.session.delete(comment)
    db.session.commit()

    return jsonify({"message": "Comment deleted successfully."}), 200
