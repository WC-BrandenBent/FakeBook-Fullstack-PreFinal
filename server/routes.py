from werkzeug.wrappers import response
from app import app, db, bcrypt
from flask import jsonify, request, session
from models import User
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
    unset_jwt_cookies,
    jwt_required,
)


@app.route("/token", methods=["POST"])
def create_token():
    data = request.get_json()
    print(data)

    username = request.json.get("username")

    user = User.query.filter_by(username=username).first()

    print(user)

    if user is None:
        return jsonify({"error": "Invalid username"}), 401

    if not bcrypt.check_password_hash(user.password, data.get("password")):
        return jsonify({"error": "Invalid password"}), 401

    access_token = create_access_token(identity=user.user_id)
    print(access_token)

    return jsonify({"access_token": access_token}), 200


@app.route("/profile", methods=["GET"])
@jwt_required()
def my_profile():
    response_body = {"name": "Logged in user", "email": "loggedInUser@gmail.com"}

    return jsonify(response_body), 200


@app.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"message": "Successfully logged out"})
    print(response)
    unset_jwt_cookies(response)
    return response, 200


@app.route("/login", methods=["POST"])
def login_user():

    username = request.json.get("username")
    password = request.json.get("password")

    user = User.query.filter_by(username=username).first()

    if user is None:
        return jsonify({"error": "Invalid username"}), 401
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid password"}), 401

    return jsonify(user.to_json()), 200


@app.route("/register", methods=["POST"])
def register_user():

    data = request.get_json()

    user_exists = User.query.filter_by(username=data.get("email")).first() is not None

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


# @app.route("/")


@app.route("/users", methods=["PUT"])
def update_user():

    data = request.get_json()
    user_id = data.get("user_id")
    user = User.query.get(user_id)

    user.username = data.get("username")
    user.password = data.get("password")
    user.email = data.get("email")
    user.bio = data.get("bio")

    db.session.commit()
    return jsonify(user.to_json())


@app.route("/users", methods=["DELETE"])
def delete_user():

    data = request.get_json()
    user_id = data.get("user_id")
    user = User.query.get(user_id)

    db.session.delete(user)
    db.session.commit()
    return jsonify(user.to_json())


@app.route("/users", methods=["GET"])
def get_users():

    users = User.query.all()
    return jsonify([user.to_json() for user in users])
