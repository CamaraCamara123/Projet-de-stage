
from flask import Flask
from pymongo import MongoClient
from mongoengine import Document, StringField, IntField
from mongoengine import connect, Q
from datetime import datetime, date
from flask import Flask, request, jsonify, send_file
import json
from bson import ObjectId
from mongoengine.queryset import QuerySet
from mongoengine import DoesNotExist
from models import *
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from flask_login import login_user, logout_user, login_required, current_user
from functools import wraps
from flask_login import LoginManager
import secrets
import os
import datetime
from flask_cors import CORS
import jwt
from flask import send_from_directory

def convert_objet_to_dict(objet, depth=1, max_depth=3):
    if depth > max_depth or not isinstance(objet, Document):
        return str(objet)

    objet_dict = {}
    for field_name in objet._fields.keys():
        field_value = getattr(objet, field_name)

        if isinstance(field_value, Document):
            field_value = convert_objet_to_dict(
                field_value, depth=depth + 1, max_depth=max_depth
            )
        elif isinstance(field_value, list):
            field_value = [
                convert_objet_to_dict(item, depth=depth + 1, max_depth=max_depth)
                for item in field_value
            ]
        elif isinstance(field_value, ObjectId):
            field_value = str(field_value)

        objet_dict[field_name] = field_value

    return objet_dict


# fonction de decoration de roles personnalisés
def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if not current_user.is_authenticated or role not in current_user.role:
                return jsonify({"message": "Accès non autorisé"}), 403
            return f(*args, **kwargs)

        return decorated_function

    return decorator


def get_user_from_database(user_id):
    user = User.objects.get(pk=user_id)
    return user


# Fonction de vérification du token JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            token = (
                auth_header.split(" ")[1] if len(auth_header.split(" ")) > 1 else None
            )

        if not token:
            return jsonify({"message": "Token manquant"}), 401

        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = get_user_from_database(data["sub"])

            return f(current_user, *args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expiré"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token invalide"}), 401

    return decorated