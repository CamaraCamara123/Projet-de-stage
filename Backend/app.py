from flask import Flask
# from pymongo import MongoClient
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
from modelML import get_model
import jwt
import shutil
import cv2
from matplotlib import pyplot as plt
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.models import load_model
from PIL import Image
import tensorflow as tf
import efficientnet.keras as efn
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


#######################################################################################################################################
#######################################################################################################################################
app = Flask(__name__)

CORS(app)  # Active les en-têtes CORS pour toutes les routes
app.config["SECRET_KEY"] = secrets.token_hex(16)
app.config["UPLOAD_FOLDER"] = os.path.dirname(__file__)
app.config["MONGODB_SETTINGS"] = {
    "db": "Medical",
    "host": " mongodb+srv://aboudramanecamara9:tt4rjV3SnGu5vEVi@cluster0.7xbx9c8.mongodb.net/",
    "retryWrites": False,
}
# connect(host="mongodb://localhost:27017/donnees")
connect(host="mongodb+srv://aboudramanecamara9:tt4rjV3SnGu5vEVi@cluster0.7xbx9c8.mongodb.net/Medical")


login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

admin_required = role_required("admin")
doctor_required = role_required("medecin")
patient_required = role_required("patient")
secretaire_required = role_required("secretaire")


def authenticate(username, password):
    user = User.objects(username=username).first()
    if user and check_password_hash(user.password, password):
        return user
    return None


@login_manager.user_loader
def load_user(user_id):
    return User.get_user_by_id(user_id)


@app.route("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


############################################# Admin ###############################################################
@app.route("/api/user/admin/create", methods=["POST"])
@token_required
# @login_required
# @admin_required
def create_admin(current_user):
    data = request.get_json()
    username = data.get("username")
    existing_user = User.objects(username=username).first()
    if existing_user:
        return jsonify({"message": "A user with this username already exists"}), 409

    password = data.get("password")
    confirmPassword = data.get("confirmPassword")

    # Check if password and confirmPassword match
    if password != confirmPassword:
        return (
            jsonify(
                {
                    "message": "Le mot de passe et la confirmation du mot de passe ne correspondent pas"
                }
            ),
            400,
        )

    hashed_password = generate_password_hash(password)

    nom = data.get("nom")
    prenom = data.get("prenom")
    tel = data.get('tel')
    genre = data.get('genre')

    admin = User(
        username=username,
        password=hashed_password,
        confirmPassword=hashed_password,
        nom=nom,
        prenom=prenom,
        tel=tel,
        genre = genre,
        role=["admin", "medecin", "patient"],
    )

    admin.save()
    admin_data = convert_objet_to_dict(admin)
    return jsonify(admin_data), 201


###################################### login ########################################################################
@app.route("/login", methods=["POST", "GET"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = authenticate(username, password)

    if user:
        login_user(user)
        user_data = current_user
        # Générer un token JWT
        payload = {
            "sub": str(user_data._id),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        }
        token = jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

        return jsonify({"token": token}), 200
    else:
        return jsonify({"message": "Authentication failed"}), 401


######################################### logout ############################################
@app.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Déconnexion réussie"})


############################################ changer mot de passe ###############################
@app.route("/api/users/change_password", methods=["POST"])
@token_required
@login_required
def change_password():
    data = request.get_json()
    old_password = data.get("oldPassword")
    new_password = data.get("newPassword")

    if not old_password or not new_password:
        return (
            jsonify(
                {"message": "Veuillez fournir l'ancien et le nouveau mot de passe"}
            ),
            400,
        )

    if not check_password_hash(current_user.password, old_password):
        return jsonify({"message": "Mot de passe incorrect"}), 401

    current_user.password = generate_password_hash(new_password)
    current_user.save()

    return jsonify({"message": "Mot de passe modifié avec succès"}), 200


##################################### mot de passe oublié ##########################################
@app.route("/api/users/forgot_password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"message": "Veuillez fournir le nom d'utilisateur"}), 400

    user = User.get_user_by_username(username)
    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    # You can implement the logic for sending a password reset email here
    # This could include generating a reset token, sending an email with a reset link, etc.

    return (
        jsonify(
            {"message": "Instructions de réinitialisation du mot de passe envoyées"}
        ),
        200,
    )


########################## route pour récupérer les informations de l'utilisateur actuellement connecté#######
@app.route("/api/users/current", methods=["GET"])
@token_required
def get_current_user(current_user):
    if current_user.is_authenticated:
        # convertion de l'objet utilisateur en dictionnaire
        user_data = convert_objet_to_dict(current_user)

        # Exclure des attributs spécifiques du dictionnaire
        excluded_attributes = [
            "password",
            "confirmPassword",
        ]
        filtered_user_data = {
            key: value
            for key, value in user_data.items()
            if key not in excluded_attributes
        }

        return jsonify(filtered_user_data), 200
    else:
        return jsonify({"message": "Aucun utilisateur connecté"}), 401


############################### la creation de patient #####################################
@app.route("/api/users/patient/create", methods=["POST"])
@token_required
# @login_required
# @secretaire_required
def create_patient(current_user):
    data = request.get_json()
    tel = data.get("tel")
    existing_patient = Patient.objects(tel=tel).first()
    if existing_patient:
        return jsonify({"message": "Un patient avec ce numero existe deja"}), 409

    username = data.get("username")
    password = data.get("password")
    confirmPassword = data.get("confirmPassword")

    # Check if password and confirmPassword match
    if password != confirmPassword:
        return (
            jsonify(
                {
                    "message": "Le mot de passe et la confirmation du mot de passe ne correspondent pas"
                }
            ),
            400,
        )

    # Hash the password
    hashed_password = generate_password_hash(password)

    nom = data.get("nom")
    prenom = data.get("prenom")
    birthdate = data.get("birthdate")
    adresse = data.get("adresse")
    genre = data.get("genre")
    rdv = []

    # Create the patient object
    patient = Patient(
        username=username,
        password=hashed_password,
        confirmPassword=hashed_password,
        nom=nom,
        prenom=prenom,
        birthdate=birthdate,
        adresse=adresse,
        role=["patient"],
        tel=tel,
        genre=genre,
        rdv=rdv,
    )

    patient.save()

    # conversion de l'objet en dictionnaire
    patient_data = convert_objet_to_dict(patient)
    return jsonify(patient_data), 201


###################################################################################################
######################################### photo profil ############################################
@app.route("/api/users/user/upload-image/<string:username>", methods=["PUT"])
@token_required
# @login_required
def upload_patient_image(current_user, username):
    user = User.objects.get(username=username)

    if "image" not in request.files:
        return jsonify({"message": "No image part in the request"}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        profile_folder = os.path.join(
            app.config["UPLOAD_FOLDER"], "uploads", "images", "profil", username
        )
        os.makedirs(profile_folder, exist_ok=True)
        image_path = os.path.join(profile_folder, filename)
        image.save(image_path)

        user.photoName = filename
        user.photo = os.path.join("uploads", "images", "profil", username, filename)
        user.save()

        return jsonify({"message": "Image uploaded successfully"}), 200

    return jsonify({"message": "Invalid file type"}), 400


# fonction de verification de l'extension du fichier
def allowed_file(filename):
    allowed_extensions = {"png", "jpg", "jpeg", "gif"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


############################### get all patient #####################################
@app.route("/api/users/patient/all", methods=["GET"])
@token_required
# @login_required
# @secretaire_required
def get_patients(current_user):
    patients = Patient.objects().all()
    patients_data = [convert_objet_to_dict(patient) for patient in patients]
    return jsonify(patients_data), 200


############################# get user by id ####################################
@app.route("/api/users/user/<string:user_id>", methods=["GET"])
@token_required
# @login_required
def get_user_by_id(current_user, user_id):
    try:
        user = User.objects.get(pk=user_id)
    except DoesNotExist:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    # Conversion de l'objet en dictionnaire
    patient_data = convert_objet_to_dict(user)
    return jsonify(patient_data), 200


############################### mise à jour d'un patient #####################################
@app.route("/api/users/patient/update/<string:patient_id>", methods=["PUT"])
@token_required
# @login_required
def update_patient(current_user, patient_id):
    data = request.get_json()

    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return jsonify({"message": "Patient non trouvé"}), 404

    patient.username = data.get("username", patient.username)
    patient.password = data.get("password", patient.password)
    patient.confirmPassword = data.get("confirmPassword", patient.confirmPassword)
    patient.nom = data.get("nom", patient.nom)
    patient.prenom = data.get("prenom", patient.prenom)
    patient.birthdate = data.get("birthdate", patient.birthdate)
    patient.adresse = data.get("adresse", patient.adresse)
    patient.tel = data.get("tel", patient.tel)
    patient.genre = data.get("genre", patient.genre)
    patient.photoName = data.get("photoName", patient.photoName)
    patient.photo = data.get("photo", patient.photo)

    patient.save()

    patient_data = convert_objet_to_dict(patient)
    return jsonify(patient_data), 200


# ############################### suppression d'un patient  #####################################
@app.route("/api/users/patient/delete/<string:patient_id>", methods=["DELETE"])
@token_required
# @login_required
# @admin_required
def delete_patient(current_user, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return jsonify({"message": "Patient non trouvé"}), 404

    profil_folder = os.path.join(
        app.config["UPLOAD_FOLDER"], "uploads", "images", "profil", patient.username
    )
    try:
        shutil.rmtree(profil_folder)
    except OSError:
        pass
    # Supprimer le patient des rendez-vous associés
    # for rdv in patient.rdv:
    #     rdv.delete()
    if len(patient.rdv) > 0:
        return (
            jsonify(
                {
                    "message": "impossible to delete this patient, he is affected to appointment(s)"
                }
            ),
            403,
        )
    patient.delete()
    return jsonify({"message": "Patient supprimé avec succès"}), 200


# ###########################################################################################
# ############################### Gestion de medecin    #####################################


# ############################### la creation de dermatologue ###############################
@app.route("/api/users/dermatologue/create", methods=["POST"])
@token_required
# @login_required
# @admin_required
def create_dermatologue(current_user):
    data = request.get_json()
    codeEmp = data.get("codeEmp")
    username = data.get("username")
    tel = data.get("tel")

    existing_dermatologue = Dermatologue.objects(codeEmp=codeEmp).first()
    if existing_dermatologue:
        return (
            jsonify({"message": "A Dermatologue with this codeEmp already exists"}),
            409,
        )

    existing_dermatologue1 = User.objects(username=username).first()
    if existing_dermatologue1:
        return (
            jsonify({"message": "A Dermatologue with this username already exists"}),
            409,
        )
    existing_user = User.objects(tel=tel).first()
    if existing_user:
        return jsonify({"message": "Un user avec ce numero existe deja"}), 409

    password = data.get("password")
    confirmPassword = data.get("confirmPassword")

    # Check if password and confirmPassword match
    if password != confirmPassword:
        return (
            jsonify(
                {
                    "message": "Le mot de passe et la confirmation du mot de passe ne correspondent pas"
                }
            ),
            400,
        )

    # Hash the password
    hashed_password = generate_password_hash(password)

    nom = data.get("nom")
    prenom = data.get("prenom")
    genre = data.get("genre")

    dermatologue = Dermatologue(
        username=username,
        password=hashed_password,  # Store the hashed password
        confirmPassword=hashed_password,
        nom=nom,
        prenom=prenom,
        tel=tel,
        genre=genre,
        role=["medecin"],
        codeEmp=codeEmp,
    )

    dermatologue.save()

    dermatologue_data = convert_objet_to_dict(dermatologue)
    return jsonify(dermatologue_data), 201


# ############################### chercher tous les dermatologues #####################################
@app.route("/api/users/dermatologue/all", methods=["GET"])
@token_required
# @login_required
# @admin_required
def get_all_dermatologues(current_user):
    dermatologues = Dermatologue.objects.all()

    dermatologues_data = [convert_objet_to_dict(derm) for derm in dermatologues]
    return jsonify(dermatologues_data), 200


# ############################### suppression d'un dermatologue #####################################
@app.route(
    "/api/users/dermatologue/delete/<string:dermatologue_id>", methods=["DELETE"]
)
@token_required
# @login_required
# @admin_required
def delete_dermatologue(current_user, dermatologue_id):
    try:
        dermatologue = Dermatologue.objects.get(pk=dermatologue_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue non trouvé"}), 404

    profil_folder = os.path.join(
        app.config["UPLOAD_FOLDER"],
        "uploads",
        "images",
        "profil",
        dermatologue.username,
    )
    try:
        shutil.rmtree(profil_folder)
    except OSError:
        pass
    # Supprimer le dermatologue des rendez-vous associés
    # for rdv in dermatologue.rdv:
    #     Dermatologue.objects(_id=dermatologue._id).update(pull__rdv=rdv)
    if len(dermatologue.rdv) > 0:
        return (
            jsonify(
                {
                    "message": "impossible to delete this doctor, he is affected to appointment(s)"
                }
            ),
            403,
        )

    dermatologue.delete()
    return jsonify({"message": "Dermatologue supprimé avec succès"}), 200


# ############################### mise à jour d'un dermatologue ou secretaire #####################################
@app.route("/api/users/dermatologue/<string:dermatologue_id>", methods=["PUT"])
@token_required
# @login_required
# @admin_required
def update_dermatologue(current, dermatologue_id):
    data = request.get_json()

    try:
        dermatologue = Dermatologue.objects.get(pk=dermatologue_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue non trouvé"}), 404

    dermatologue.username = data.get("username", dermatologue.username)
    dermatologue.password = data.get("password", dermatologue.password)
    dermatologue.confirmPassword = data.get(
        "confirmPassword", dermatologue.confirmPassword
    )

    dermatologue.nom = data.get("nom", dermatologue.nom)
    dermatologue.tel = data.get("tel", dermatologue.tel)
    dermatologue.genre = data.get("genre", dermatologue.genre)
    dermatologue.prenom = data.get("prenom", dermatologue.prenom)
    dermatologue.codeEmp = data.get("codeEmp", dermatologue.codeEmp)

    dermatologue.save()

    dermatologue_data = convert_objet_to_dict(dermatologue)
    return jsonify(dermatologue_data), 200


########################################## les patients par medecin ####################################
@app.route("/api/medecin/patients/<string:medecin_id>", methods=["GET"])
@token_required
def get_patients_for_medecin(current_user, medecin_id):
    rdvs = Rendez_vous.objects(medecin=medecin_id).all()

    unique_patients = set()

    for rdv in rdvs:
        unique_patients.add(rdv.patient)

    patients_data = [convert_objet_to_dict(patient) for patient in unique_patients]
    return jsonify(patients_data), 200


# ###########################################################################################
# ############################### Gestion de secretaire #####################################


# ############################### la creation de secretaire ################################
@app.route("/api/users/secretaire/create", methods=["POST"])
@token_required
# @login_required
# @admin_required
def create_secretaire(current_user):
    data = request.get_json()
    codeEmp = data.get("codeEmp")
    username = data.get("username")
    tel = data.get("tel")

    existing_secretaire = Secretaire.objects(codeEmp=codeEmp).first()
    if existing_secretaire:
        return (
            jsonify({"message": "A secretaire with this codeEmp already exists"}),
            409,
        )

    existing_user = User.objects(username=username).first()
    if existing_user:
        return (
            jsonify({"message": "A secretaire with this username already exists"}),
            409,
        )
    existing_user = User.objects(tel=tel).first()
    if existing_user:
        return jsonify({"message": "Un user avec ce numero existe deja"}), 409

    password = data.get("password")
    confirmPassword = data.get("confirmPassword")

    # Check if password and confirmPassword match
    if password != confirmPassword:
        return (
            jsonify(
                {
                    "message": "Le mot de passe et la confirmation du mot de passe ne correspondent pas"
                }
            ),
            400,
        )

    # Hash the password
    hashed_password = generate_password_hash(password)

    nom = data.get("nom")
    prenom = data.get("prenom")
    tel = data.get("tel")
    genre = data.get("genre")

    secretaire = Secretaire(
        username=username,
        password=hashed_password,
        confirmPassword=hashed_password,
        nom=nom,
        role=["secretaire"],
        prenom=prenom,
        tel=tel,
        genre=genre,
        codeEmp=codeEmp,
    )

    secretaire.save()

    secretaire_data = convert_objet_to_dict(secretaire)
    return jsonify(secretaire_data), 201


# ############################### get all secretaire ########################################
@app.route("/api/users/secretaires", methods=["GET"])
@token_required
# @login_required
# @admin_required
def get_secretaires(current_user):
    secretaires = Secretaire.objects.all()
    secretaires_data = [convert_objet_to_dict(secretaire) for secretaire in secretaires]
    return jsonify(secretaires_data), 200


# ############################### update  secretaire ######################################
@app.route("/api/users/secretaire/update/<string:secretaire_id>", methods=["PUT"])
@token_required
# @login_required
# @admin_required
# @secretaire_required
def update_secretaire(current_user, secretaire_id):
    data = request.get_json()

    try:
        secretaire = Secretaire.objects.get(pk=secretaire_id)
    except Secretaire.DoesNotExist:
        return jsonify({"message": "Secrétaire non trouvé"}), 404

    secretaire.username = data.get("username", secretaire.username)
    # secretaire.password = data.get("password", secretaire.password)
    # secretaire.confirmPassword = data.get("confirmPassword", secretaire.confirmPassword)
    secretaire.nom = data.get("nom", secretaire.nom)
    secretaire.tel = data.get("tel", secretaire.tel)
    secretaire.prenom = data.get("prenom", secretaire.prenom)
    secretaire.codeEmp = data.get("codeEmp", secretaire.codeEmp)
    secretaire.genre = data.get("genre", secretaire.genre)

    secretaire.save()

    secretaire_data = convert_objet_to_dict(secretaire)
    return jsonify(secretaire_data), 200


# ############################### delete secretaire ########################################
@app.route("/api/users/secretaire/delete/<string:secretaire_id>", methods=["DELETE"])
@token_required
def delete_secretaire(current_user, secretaire_id):
    try:
        secretaire = Secretaire.objects.get(pk=secretaire_id)
    except Secretaire.DoesNotExist:
        return jsonify({"message": "Secrétaire non trouvé"}), 404
    profil_folder = os.path.join(
        app.config["UPLOAD_FOLDER"], "uploads", "images", "profil", secretaire.username
    )
    try:
        shutil.rmtree(profil_folder)
    except OSError:
        pass
    secretaire.delete()
    return jsonify({"message": "Secrétaire supprimé avec succès"}), 200


# ###########################################################################################
# ############################### Gestion rendez vous #######################################


# #################################### creation de rendez vous ##############################
@app.route("/api/rendez_vous/<string:patient_id>/<string:medecin_id>", methods=["POST"])
@token_required
def create_rdv(current_user, patient_id, medecin_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return jsonify({"message": "Patient not found"}), 404

    try:
        medecin = Dermatologue.objects.get(pk=medecin_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue not found"}), 404

    data = request.get_json()
    dateDebutRdv = data.get("dateDebutRdv")
    dateFinRdv = data.get("dateFinRdv")

    rdv = Rendez_vous(
        dateDebutRdv=dateDebutRdv,
        dateFinRdv=dateFinRdv,
        patient=patient,
        medecin=medecin,
    )

    rdv.save()
    patient.rdv.append(rdv)
    patient.save()

    medecin.rdv.append(rdv)
    medecin.save()

    rdv_data = convert_objet_to_dict(rdv)
    return jsonify(rdv_data)


######################################### supprimer un rendez vous #######################################
@app.route("/api/rendez_vous/<string:rdv_id>", methods=["DELETE"])
@token_required
# @login_required
# @admin_required
# @secretaire_required
def delete_rdv(current_user, rdv_id):
    try:
        rdv = Rendez_vous.objects.get(pk=rdv_id)
    except Rendez_vous.DoesNotExist:
        return jsonify({"message": "Rendez-vous non trouvé"}), 404

    # Update the references to remove the rendez-vous
    if rdv.medecin:
        Dermatologue.objects(_id=rdv.medecin._id).update(pull__rdv=rdv)
    if rdv.patient:
        Patient.objects(_id=rdv.patient._id).update(pull__rdv=rdv)

    if rdv.consultation:
        for diagnostic in rdv.consultation.diagnostics:
            formatted_datetime = diagnostic.dateDiagnostic.strftime("%Y-%m-%d_%H-%M-%S")
            consult_folder = os.path.join(
                app.config["UPLOAD_FOLDER"],
                "uploads",
                "images",
                "consultation",
                rdv.patient.username,
                formatted_datetime,
            )
            try:
                shutil.rmtree(consult_folder)
            except OSError:
                pass

            try:
                diagnostic.delete()
            except Diagnostic.DoesNotExist:
                pass

        consult_folder = os.path.join(
            app.config["UPLOAD_FOLDER"],
            "uploads",
            "images",
            "consultation",
            rdv.patient.username,
        )
        try:
            shutil.rmtree(consult_folder)
        except OSError:
            pass

        try:
            rdv.consultation.delete()
        except Consultation.DoesNotExist:
            pass

    rdv.delete()

    return jsonify({"message": "Rendez-vous supprimé avec succès"}), 200


#######################################  get all rendez vous #############################################
@app.route("/api/rendez_vous", methods=["GET"])
@token_required
def get_rdvs(current_user):
    rdvs = Rendez_vous.objects().order_by("-dateDebutRdv")

    rdv_data = [convert_objet_to_dict(rdv) for rdv in rdvs]
    return jsonify(rdv_data), 200


#################################### get rdv by id #####################################################
@app.route("/api/rendez_vous/<string:rdv_id>", methods=["GET"])
@token_required
def get_rdv(current_user, rdv_id):
    try:
        rdv = Rendez_vous.objects().get(pk=rdv_id)
    except Rendez_vous.DoesNotExist:
        return jsonify({"message": "Rendez-vous non trouvé"}), 404
    rdv_data = convert_objet_to_dict(rdv)
    return jsonify(rdv_data)


#################################### get rdv by patient #################################################
@app.route("/api/rendez_vous/patient/<string:patient_id>", methods=["GET"])
@token_required
def get_rdv_by_patient(current_user, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return jsonify({"message": "Patient introuvable"}), 404

    rdvs = Rendez_vous.objects.filter(patient=patient).order_by("-dateDebutRdv")

    rdv_data = [convert_objet_to_dict(rdv) for rdv in rdvs]
    return jsonify(rdv_data), 200


#################################### get day rdv #################################################
@app.route("/api/rendez_vous/today", methods=["GET"])
@token_required
def get_today_rdv(current_user):
    today = datetime.datetime.today()
    start_of_day = datetime.datetime.combine(today, datetime.datetime.min.time())
    end_of_day = datetime.datetime.combine(today, datetime.datetime.max.time())

    # Maintenant, vous pouvez filtrer les rendez-vous pour aujourd'hui
    rdvs = Rendez_vous.objects.filter(
        Q(dateDebutRdv__gte=start_of_day) & Q(dateDebutRdv__lte=end_of_day)
    ).order_by("-dateDebutRdv")

    rdv_data = [convert_objet_to_dict(rdv) for rdv in rdvs]
    return jsonify(rdv_data), 200


#################################### get rdv by medecin #################################################
@app.route("/api/rendez_vous/dermatologue/<string:derm_id>", methods=["GET"])
@token_required
def get_rdv_by_dermatologue(current_user, derm_id):
    try:
        derms = Dermatologue.objects.get(pk=derm_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue introuvable"}), 404

    today = date.today()

    # Filtrez les rendez-vous pour n'inclure que ceux d'aujourd'hui
    rdvs = Rendez_vous.objects.filter(medecin=derms).order_by("-dateDebutRdv")

    rdv_data = [convert_objet_to_dict(rdv) for rdv in rdvs]
    return jsonify(rdv_data), 200


#################################### get doctor futur rdv #################################################
@app.route("/api/rdv/dermatologue/futur/<string:derm_id>", methods=["GET"])
@token_required
def medecin_futur_rdv(current_user, derm_id):
    try:
        derms = Dermatologue.objects.get(pk=derm_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue introuvable"}), 404

    today = datetime.datetime.today()

    start_of_day = datetime.datetime.combine(today, datetime.datetime.min.time())
    end_of_day = datetime.datetime.combine(today, datetime.datetime.max.time())

    # Maintenant, vous pouvez filtrer les rendez-vous pour aujourd'hui
    rdvs = Rendez_vous.objects.filter(
        Q(medecin=derms) & Q(dateDebutRdv__gte=start_of_day)
    ).order_by("-dateDebutRdv")

    rdv_data = [convert_objet_to_dict(rdv) for rdv in rdvs]
    return jsonify(rdv_data), 200


#################################### get doctor day rendez-vous #################################################
@app.route("/api/rendez-vous/dermatologue/today/<string:derm_id>", methods=["GET"])
@token_required
def get_dermatologue_today_rdv(current_user, derm_id):
    try:
        derms = Dermatologue.objects.get(pk=derm_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue introuvable"}), 404

    today = datetime.datetime.today()
    # print(today)
    # # Filtrez les rendez-vous pour n'inclure que ceux d'aujourd'hui
    # rdvs = Rendez_vous.objects.filter(medecin=derms, dateDebutRdv__date=today).order_by("-dateDebutRdv")
    start_of_day = datetime.datetime.combine(today, datetime.datetime.min.time())
    end_of_day = datetime.datetime.combine(today, datetime.datetime.max.time())

    # Maintenant, vous pouvez filtrer les rendez-vous pour aujourd'hui
    rdvs = Rendez_vous.objects.filter(
        Q(medecin=derms)
        & Q(dateDebutRdv__gte=start_of_day)
        & Q(dateDebutRdv__lte=end_of_day)
    ).order_by("-dateDebutRdv")
    print("rdvs : ")
    rdv_data = [convert_objet_to_dict(rdv) for rdv in rdvs]
    return jsonify(rdv_data), 200


######################################## update rendez vous ##############################################
@app.route("/api/rendez_vous/update/<string:rdv_id>", methods=["PUT"])
@token_required
def update_rdv(current_user, rdv_id):
    try:
        rdv = Rendez_vous.objects.get(pk=rdv_id)
    except Rendez_vous.DoesNotExist:
        return jsonify({"message": "Rendez-vous non trouvé"}), 404

    data = request.get_json()
    dateDebutRdv = data.get("dateDebutRdv")
    dateFinRdv = data.get("dateFinRdv")

    rdv.dateDebutRdv = dateDebutRdv if dateDebutRdv else rdv.dateRdv
    rdv.dateFinRdv = dateFinRdv if dateFinRdv else rdv.heure
    # rdv.medecin = dermatologue if derm_id else rdv.medecin

    rdv.save()

    rdv_data = convert_objet_to_dict(rdv)
    return jsonify(rdv_data), 200


#################################################################################################################################
######################################################################## Gestion consultation #####################################
@app.route("/api/consultation/create/<string:rdv_id>", methods=["POST"])
@token_required
def remplir_consultation(current_user, rdv_id):
    data = request.get_json()

    try:
        rdv = Rendez_vous.objects.get(pk=rdv_id)
    except Rendez_vous.DoesNotExist:
        return json({"message": "rendez-vous inexistant"}), 404

    consultation = Consultation()
    consultation.rdv = rdv
    consultation.save()

    rdv.statut = True
    rdv.consultation = consultation
    rdv.save()

    consultation_data = convert_objet_to_dict(consultation)
    return jsonify(consultation_data), 200


################################################### all consultations ########################################################################
@app.route("/api/consultations", methods=["GET"])
@token_required
def get_consultations(current_user):
    consults = Consultation.objects.all()
    consult_data = [convert_objet_to_dict(consult) for consult in consults]
    return jsonify(consult_data), 200


################################################### consultation by id ########################################################################
@app.route("/api/consultation/<string:consult_id>", methods=["GET"])
@token_required
def get_consultation(current_user, consult_id):
    try:
        consult = Consultation.objects.get(pk=consult_id)
    except Consultation.DoesNotExist:
        return jsonify({"message", "consultation introuvable"}), 404
    consult_data = convert_objet_to_dict(consult)
    return jsonify(consult_data), 200


####################################################### les vistes d'un medecin avec un patient donné ##########################################
@app.route(
    "/api/visite/medecin/patient/<string:medecin_id>/<string:patient_id>",
    methods=["GET"],
)
@token_required
def consultation_medecin_patient(current_user, medecin_id, patient_id):
    try:
        medecin = Dermatologue.objects.get(pk=medecin_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "doctor not found"}), 400

    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return jsonify({"message": "patient not found"}), 400

    rdvs = Rendez_vous.objects.filter(
        medecin=medecin, patient=patient, statut=True
    ).order_by("-dateDebutRdv")

    consultations = []
    for rdv in rdvs:
        consultations.append(rdv.consultation)

    consultation_data = [convert_objet_to_dict(consult) for consult in consultations]
    return jsonify(consultation_data), 200


#################################### get doctor day visite #################################################
@app.route("/api/visite/dermatologue/today/<string:derm_id>", methods=["GET"])
@token_required
def get_dermatologue_today_visite(current_user, derm_id):
    try:
        derms = Dermatologue.objects.get(pk=derm_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "Dermatologue introuvable"}), 404

    today = datetime.datetime.today()
    # print(today)
    # # Filtrez les rendez-vous pour n'inclure que ceux d'aujourd'hui
    # rdvs = Rendez_vous.objects.filter(medecin=derms, dateDebutRdv__date=today).order_by("-dateDebutRdv")
    start_of_day = datetime.datetime.combine(today, datetime.datetime.min.time())
    end_of_day = datetime.datetime.combine(today, datetime.datetime.max.time())

    # Maintenant, vous pouvez filtrer les rendez-vous pour aujourd'hui
    rdvs = Rendez_vous.objects.filter(
        Q(medecin=derms)
        & Q(dateDebutRdv__gte=start_of_day)
        & Q(dateDebutRdv__lte=end_of_day)
        & Q(statut=True)
    ).order_by("-dateDebutRdv")
    consultations = []
    for rdv in rdvs:
        consultations.append(rdv.consultation)
    consultation_data = [convert_objet_to_dict(consult) for consult in consultations]
    return jsonify(consultation_data), 200


####################################################### les vistes d'un patient donné ##########################################
@app.route(
    "/api/visite/patient/<string:patient_id>",
    methods=["GET"],
)
@token_required
def consultation_patient(current_user, patient_id):
    try:
        patient = Patient.objects.get(pk=patient_id)
    except Patient.DoesNotExist:
        return jsonify({"message": "patient not found"}), 400

    rdvs = Rendez_vous.objects.filter(patient=patient, statut=True).order_by(
        "-dateDebutRdv"
    )

    consultations = []
    for rdv in rdvs:
        consultations.append(rdv.consultation)

    consultation_data = [convert_objet_to_dict(consult) for consult in consultations]
    return jsonify(consultation_data), 200


################################################### supprimer consultation ######################################################
@app.route("/api/consultation/delete/<string:consult_id>", methods=["DELETE", "PUT"])
@token_required
def delete_consultation(current_user, consult_id):
    try:
        consultation = Consultation.objects.get(pk=consult_id)
    except Consultation.DoesNotExist:
        return jsonify({"message": "consultation non trouvée"}), 404

    if consultation.diagnostics:
        for diagnostic in consultation.diagnostics:
            img_folder = os.path.join(app.config["UPLOAD_FOLDER"], diagnostic.imagePath)
            try:
                shutil.rmtree(img_folder)
                diagnostic.delete()
            except OSError:
                pass
        img_folder = os.path.join(
            app.config["UPLOAD_FOLDER"],
            "uploads",
            "images",
            "consultation",
            consultation.rdv.patient.username,
        )
        try:
            shutil.rmtree(img_folder)
            diagnostic.delete()
        except OSError:
            pass
    rdv = Rendez_vous.objects.get(pk=consultation.rdv._id)
    rdv.consultation = None
    rdv.statut = False
    rdv.save()
    consultation.delete()

    return jsonify({"message": "consultation supprimée avec succès"}), 200


################################################## update consultation(visite) ==> changer de medecin #####################################################################
@app.route(
    "/api/consultation/update/<string:consult_id>/<string:medecin_id>", methods=["PUT"]
)
@token_required
def update_consultation(current_user, consult_id, medecin_id):
    data = request.get_json()
    try:
        consultation = Consultation.objects.get(pk=consult_id)
    except Consultation.DoesNotExist:
        return jsonify({"message": "consultation introuvable"}), 404
    try:
        medecin = Dermatologue.objects.get(pk=medecin_id)
    except Dermatologue.DoesNotExist:
        return jsonify({"message": "doctor not found"}), 404

    rdv = Consultation.objects.get(consultation=consultation)
    rdv.medecin = medecin
    rdv.save()
    consultation_data = convert_objet_to_dict(consultation)
    return jsonify(consultation_data), 201


# ################################################## Consultations par rdv  #####################################################################
# @app.route("/api/rdv/consultation/<string:rdv_id>", methods=["GET"])
# def consultation_by_rdv(rdv_id):
#     try:
#         rdv = Rendez_vous.objects.get(pk=rdv_id)
#     except Rendez_vous.DoesNotExist:
#         return jsonify({"message": "rdv introuvable"}), 404

#     consultations = Consultation.objects.filter(rdv=rdv).order_by("-dateConsult")
#     consultation_data = [
#         convert_objet_to_dict(consultation) for consultation in consultations
#     ]
#     return jsonify(consultation_data), 201


# ################################################### supprimer consultation ######################################################
# @app.route("/api/consultation/delete/<string:consult_id>", methods=["DELETE", "PUT"])
# def delete_diagnostic(consult_id):
#     try:
#         consultation = Consultation.objects.get(pk=consult_id)
#     except Consultation.DoesNotExist:
#         return jsonify({"message": "consultation non trouvée"}), 404

#     formatted_datetime = consultation.dateConsult.strftime("%Y-%m-%d_%H-%M-%S")
#     consult_folder = os.path.join(
#         app.config["UPLOAD_FOLDER"],'uploads','images',"consultation",
#         consultation.rdv.patient.username,
#         formatted_datetime
#     )
#     rdv = Rendez_vous.objects.get(pk=consultation.rdv._id)
#     rdv.consultations.remove(consultation)
#     rdv.save()
#     try:
#         shutil.rmtree(consult_folder)
#     except OSError:
#         pass

#     consultation.delete()

#     return jsonify({"message": "consultation supprimée avec succès"}), 200

###############################################################################################################################################################
##################################################### gestion diagnostic ######################################################################################


###################################################### create diagnostic #####################################################################################
@app.route("/api/diagnostic/create/<string:consult_id>", methods=["POST"])
@token_required
def new_diagnostic(current_user, consult_id):
    data = request.get_json()
    try:
        consultation = Consultation.objects.get(pk=consult_id)
    except Diagnostic.DoesNotExist:
        return jsonify({"message": "consultation not found"}), 400

    descripSymptome = data.get("descripSymptome")
    diagnostic = Diagnostic(descripSymptome=descripSymptome)
    diagnostic.consultation = consultation
    diagnostic.save()

    consultation.diagnostics.append(diagnostic)
    consultation.save()

    diagnostic_data = convert_objet_to_dict(diagnostic)

    return jsonify(diagnostic_data), 200


######################################################### upload image diagnostic ######################################################
@app.route("/api/diagnostic/upload-image/<string:diagnostic_id>", methods=["PUT"])
@token_required
def upload_consutation_image(current_user, diagnostic_id):
    diagnostic = Diagnostic.objects.get(pk=diagnostic_id)

    if "image" not in request.files:
        return jsonify({"message": "No image part in the request"}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        formatted_datetime = diagnostic.dateDiagnostic.strftime("%Y-%m-%d_%H-%M-%S")
        diagnostic_folder = os.path.join(
            app.config["UPLOAD_FOLDER"],
            "uploads",
            "images",
            "consultation",
            diagnostic.consultation.rdv.patient.username,
            formatted_datetime,
        )
        os.makedirs(diagnostic_folder, exist_ok=True)
        image_path = os.path.join(diagnostic_folder, filename)
        image.save(image_path)
        diagnostic.imageName = filename
        diagnostic.imagePath = os.path.join(
            "uploads",
            "images",
            "consultation",
            diagnostic.consultation.rdv.patient.username,
            formatted_datetime,
            filename,
        )
        diagnostic.save()
        diagnostic_data = convert_objet_to_dict(diagnostic)
        return jsonify(diagnostic_data), 200

    return jsonify({"message": "Invalid file type"}), 400


############################################################# diagnostic by id ########################################################################################
@app.route("/api/diagnostic/<string:diagnostic_id>", methods=["GET"])
@token_required
def get_diagnostic(current_user, diagnostic_id):
    try:
        diagnostic = Diagnostic.objects.get(pk=diagnostic_id)
    except Diagnostic.DoesNotExist:
        return jsonify({"message": "Diagnostic not found"}), 400
    diagnostic_data = convert_objet_to_dict(diagnostic)
    return jsonify(diagnostic_data), 200


############################################################## update diagnostic==> faire des prescriptions ############################################################
@app.route("/api/diagnostic/update/<string:diagnostic_id>", methods=["PUT"])
@token_required
def diagnostic_update(current_user, diagnostic_id):
    data = request.get_json()
    try:
        diagnostic = Diagnostic.objects.get(pk=diagnostic_id)
    except Diagnostic.DoesNotExist:
        return jsonify({"message": "Diagnostic not found"}), 400

    diagnostic.prescription = data.get("prescription", diagnostic.prescription)
    diagnostic.description = data.get("description", diagnostic.description)

    diagnostic.save()
    diagnostic_data = convert_objet_to_dict(diagnostic)
    return jsonify(diagnostic_data), 200


####################################################### lancer le diagnostic de la consultation ################################################################
@app.route("/api/consult/diagnostic/<string:diagnostic_id>", methods=["PUT"])
@token_required
def diagnostic_maladie(current_user, diagnostic_id):
    try:
        diagnostic = Diagnostic.objects.get(pk=diagnostic_id)
    except Diagnostic.DoesNotExist:
        return jsonify({"message": "Diagnostic not found"}), 400

    # je vais inserer le model ici
    efficient = get_model()
    efficient.load_weights(
        "efficient.h5"
    )  # le même modèle que je t'ai envoyé ms cette fois-ci on va servir juste de ses poids
    classe = {0: "akiec", 1: "bcc", 2: "bkl", 3: "df", 4: "mel", 5: "nv", 6: "vasc"}

    for key, value in classe.items():
        try:
            maladie = Maladie.objects.get(nom=value)
            diagnostic.maladies.append(maladie)
            print(maladie.nom)
        except Maladie.DoesNotExist:
            return jsonify({"message": "Diseas not found"}), 404

    file_path = os.path.join(app.config["UPLOAD_FOLDER"], diagnostic.imagePath)
    test_image = load_img(file_path, target_size=(224, 224))
    test_image = img_to_array(test_image)
    test_image = preprocess_input(np.expand_dims(test_image, axis=0))
    # Print what the top predicted class is
    preds = efficient.predict(test_image)
    # A list of different probabilities outputed by the model
    preds = preds.tolist()
    # We choose the highest prediction
    max_value = max(preds[0])
    # Index of the highest prediction is the label of the predicted class
    max_index = preds[0].index(max_value)
    print(preds)
    # Get class name from label predicted
    print("Predicted:", classe[max_index])
    try:
        maladie = Maladie.objects.get(nom=classe[max_index])
    except Maladie.DoesNotExist:
        return jsonify({"message": "Maladie non repertoriée"}), 404

    diagnostic.maladie = maladie
    formatted_value = "{:.2f}".format(max_value * 100)
    diagnostic.probability = float(formatted_value)
    diagnostic.probabilities = [
        float("{:.2f}".format(value * 100)) for value in preds[0]
    ]
    diagnostic.save()

    diagnostic_data = convert_objet_to_dict(diagnostic)

    return jsonify(diagnostic_data), 200


######################################################### Valider un diagnostic #############################################################
@app.route(
    "/api/diagnostic/validation/<string:diagnostic_id>/<string:maladie_id>",
    methods=["PUT"],
)
@token_required
def valide_diagnostic(current_user, diagnostic_id, maladie_id):
    try:
        diagnostic = Diagnostic.objects.get(pk=diagnostic_id)
    except Diagnostic.DoesNotExist:
        return jsonify({"message": "diagnostic not found"}), 404

    try:
        maladie = Maladie.objects.get(pk=maladie_id)
    except Maladie.DoesNotExist:
        return jsonify({"message": "disease not found"}), 404

    try:
        stade = Stade.objects.get(maladie=maladie)
    except Stade.DoesNotExist:
        return jsonify({"message": "level not found"}), 404

    if diagnostic.maladie != maladie:
        diagnostic.maladie = maladie

    image_stade = ImageStade()
    file_name = diagnostic.imageName
    image_stade.title = file_name
    image_stade.imagePath = os.path.join(
        "uploads", "images", "maladies", stade.maladie.nom, stade.stade, file_name
    )
    image_stade.stade = stade
    print(diagnostic.imagePath)
    source_file_path = os.path.join(app.config["UPLOAD_FOLDER"], diagnostic.imagePath)
    destination_file_path = os.path.join(
        app.config["UPLOAD_FOLDER"],
        "uploads",
        "images",
        "maladies",
        stade.maladie.nom,
        stade.stade,
    )
    shutil.copy(source_file_path, destination_file_path)

    image_stade.save()

    diagnostic.save()

    return jsonify({"message": "validation done successfully"}), 200


################################################## diagnostics par consultation  #####################################################################
@app.route("/api/consultation/diagnostics/<string:consult_id>", methods=["GET"])
@token_required
def diagnostics_by_consultation(current_user, consult_id):
    try:
        consultation = Consultation.objects.get(pk=consult_id)
    except Consultation.DoesNotExist:
        return jsonify({"message": "Consultation not found"}), 404

    diagnostics = Diagnostic.objects.filter(consultation=consultation).order_by(
        "-dateDiagnostic"
    )
    diagnostic_data = [convert_objet_to_dict(diagnostic) for diagnostic in diagnostics]
    return jsonify(diagnostic_data), 201


################################################### supprimer diagnostic ######################################################
@app.route("/api/diagnostic/delete/<string:diagnostic_id>", methods=["DELETE", "PUT"])
@token_required
def delete_diagnostic(current_user, diagnostic_id):
    try:
        diagnostic = Diagnostic.objects.get(pk=diagnostic_id)
    except Diagnostic.DoesNotExist:
        return jsonify({"message": "Diagnostic not found"}), 404

    formatted_datetime = diagnostic.dateDiagnostic.strftime("%Y-%m-%d_%H-%M-%S")
    diagnostic_folder = os.path.join(
        app.config["UPLOAD_FOLDER"],
        "uploads",
        "images",
        "consultation",
        diagnostic.consultation.rdv.patient.username,
        formatted_datetime,
    )
    consultation = Consultation.objects.get(pk=diagnostic.consultation._id)
    consultation.diagnostics.remove(diagnostic)
    consultation.save()
    try:
        shutil.rmtree(diagnostic_folder)
    except OSError:
        pass

    diagnostic.delete()

    return jsonify({"message": "diagnostic deleted successfully"}), 200


##############################################################################################################################################
################################################################ Gestion maladie #############################################################
@app.route("/api/maladie/create", methods=["POST"])
@token_required
def create_maladie(current_user):
    data = request.get_json()
    nom = data.get("nom")
    fullName = data.get("fullName")
    nom_lower = nom.lower()
    try:
        existing_maladie = Maladie.objects.get(nom=nom_lower)
    except Maladie.DoesNotExist:
        maladie = Maladie(nom=nom_lower, fullName=fullName)
        maladie.save()

        maladie_data = convert_objet_to_dict(maladie)
        return jsonify(maladie_data), 201
    return jsonify({"message": "cette maladie existe deja"}), 404


################################################################## recherche de maladie ######################################################
@app.route("/api/maladies", methods=["GET"])
@token_required
def get_maladies(current_user):
    maladies = Maladie.objects.all()
    maladies_data = [convert_objet_to_dict(maladie) for maladie in maladies]
    return jsonify(maladies_data), 200


################################################################# rechercher maladie par id ###################################################
@app.route("/api/maladie/<string:maladie_id>", methods=["GET"])
@token_required
def maladie_by_id(current_user, maladie_id):
    try:
        maladie = Maladie.objects.get(pk=maladie_id)
    except Maladie.DoesNotExist:
        return jsonify({"message": "maladie introuvable"}), 400

    maladie_data = convert_objet_to_dict(maladie)
    return jsonify(maladie_data), 200


############################################################### Mise à jour maladie #############################################################
@app.route("/api/maladie/update/<string:maladie_id>", methods=["PUT"])
@token_required
def maladie_update(current_user, maladie_id):
    data = request.get_json()

    try:
        maladie = Maladie.objects.get(pk=maladie_id)
    except Maladie.DoesNotExist:
        return jsonify({"message": "maladie introuvable"}), 400

    maladie.nom = data.get("nom", maladie.nom)
    maladie.fullName = data.get("fullName", maladie.fullName)

    maladie.save()
    maladie_data = convert_objet_to_dict(maladie)
    return jsonify(maladie_data), 201


############################################################ supprimer maladie ##################################################################
@app.route("/api/maladie/delete/<string:maladie_id>", methods=["DELETE"])
@token_required
def delete_maladie(current_user, maladie_id):
    try:
        maladie = Maladie.objects.get(pk=maladie_id)
    except Maladie.DoesNotExist:
        return jsonify({"message": "maladie non trouvée"}), 404

    # Supprimer les étapes (stades) associées
    for stade in maladie.stade:
        images = ImageStade.objects.filter(stade=stade)
        for image in images:
            # Supprimer l'image du dossier du stade
            # image_path = os.path.join(app.config['UPLOAD_FOLDER3'], f"{stade.maladie.nom}{stade.stade}", image.title)
            # Stade.objects(pk=image.stade._id).update(pull_images=image)
            folder = os.path.join(app.config["UPLOAD_FOLDER"], image.imagePath)
            image.delete()
            try:
                print(image.title)
                os.remove(folder)
            except OSError:
                pass

        # Supprimer le dossier du stade
        stade_folder = os.path.join(
            app.config["UPLOAD_FOLDER"],
            "uploads",
            "images",
            "maladies",
            stade.maladie.nom,
        )
        try:
            shutil.rmtree(stade_folder)
        except OSError:
            pass

        stade.delete()

    # Supprimer la maladie
    maladie.delete()

    return jsonify({"message": "Maladie supprimée avec succès"}), 200


#############################################################################################################################################
####################################################################### gestion stades maladies ##############################################
@app.route("/api/stade/create/<string:maladie_id>", methods=["POST"])
@token_required
def create_stade(current_user, maladie_id):
    data = request.get_json()
    stade = data.get("stade")
    description = data.get("description")
    existind_maladie = Maladie.objects.get(pk=maladie_id)
    if not existind_maladie:
        return jsonify({"message": "maladie introuvable"}), 404

    stade = Stade(stade=stade, description=description)
    stade.maladie = existind_maladie

    stade.save()
    existind_maladie.stade.append(stade)
    existind_maladie.save()
    stade_data = convert_objet_to_dict(stade)

    return jsonify(stade_data), 201


########################################################## get stade by id ######################################################################
@app.route("/api/stade/<string:stade_id>", methods=["GET"])
@token_required
def get_stade(current_user, stade_id):
    try:
        stade = Stade.objects.get(pk=stade_id)
    except Stade.DoesNotExist:
        return jsonify({"message": "stade introuvable"}), 404

    stade_data = convert_objet_to_dict(stade)
    return jsonify(stade_data), 200


######################################################### stades par  Maladies ##################################################################
@app.route("/api/maladie/stades/<string:maladie_id>", methods=["GET"])
@token_required
def get_stades_by_Maladie(current_user, maladie_id):
    try:
        maladie = Maladie.objects.get(pk=maladie_id)
    except Maladie.DoesNotExist:
        return jsonify({"message": "maladie introuvable"}), 404

    stades = Stade.objects.filter(maladie=maladie)

    stade_data = [convert_objet_to_dict(stade) for stade in stades]
    return jsonify(stade_data), 200


######################################################### supprimer stade ##################################################################
@app.route("/api/maladie/stade/delete/<string:stade_id>", methods=["DELETE"])
@token_required
def delete_stade(current_user, stade_id):
    try:
        stade = Stade.objects.get(pk=stade_id)
    except Stade.DoesNotExist:
        return jsonify({"message": "stade introuvable"}), 404

    maladie = Maladie.objects.get(pk=stade.maladie._id)
    maladie.stade.remove(stade)
    maladie.save()

    images = ImageStade.objects.filter(stade=stade)
    for image in images:
        folder = os.path.join(app.config["UPLOAD_FOLDER"], image.imagePath)
        image.delete()
        try:
            os.remove(folder)
        except OSError:
            pass

    # Supprimer le dossier du stade
    stade_folder = os.path.join(
        app.config["UPLOAD_FOLDER"],
        "uploads",
        "images",
        "maladies",
        stade.maladie.nom,
        stade.stade,
    )
    try:
        shutil.rmtree(stade_folder)
    except OSError:
        pass

    stade.delete()

    return jsonify({"message": "stade supprimée avec succès"}), 200


################################################################################################################################################
######################################################### gestion images Stades ########################################################################
@app.route("/api/stade/image/create/<string:stade_id>", methods=["POST"])
@token_required
def create_image(current_user, stade_id):
    stade = Stade.objects.get(pk=stade_id)

    if "image" not in request.files:
        return jsonify({"message": "No image part in the request"}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)

        # Créez un sous-dossier pour la maladie si elle n'existe pas déjà
        maladie_folder = os.path.join(
            app.config["UPLOAD_FOLDER"],
            "uploads",
            "images",
            "maladies",
            stade.maladie.nom,
            stade.stade,
        )
        os.makedirs(maladie_folder, exist_ok=True)

        image_path = os.path.join(maladie_folder, filename)
        image.save(image_path)

        title = filename
        image_path = os.path.join(
            "uploads", "images", "maladies", stade.maladie.nom, stade.stade, filename
        )

        imageStade = ImageStade(title=title, imagePath=image_path, stade=stade)
        imageStade.save()
        # stade.images.append(imageStade)
        # stade.save()

        return jsonify({"message": "Image uploaded successfully"}), 200

    return jsonify({"message": "Invalid file type"}), 400


################################################## supprimer image stade #################################################
@app.route("/api/maladie/stade/image/delete/<string:img_id>", methods=["DELETE"])
@token_required
def delete_image_stade(current_user, img_id):
    try:
        image = ImageStade.objects.get(pk=img_id)
    except Image.DoesNotExist:
        return jsonify({"message": "Image introuvable"}), 404

    # Stade.objects(pk=image.stade._id).update(pull_images=image)
    folder = os.path.join(app.config["UPLOAD_FOLDER"], image.imagePath)
    try:
        os.remove(folder)
    except OSError:
        pass
    image.delete()

    return jsonify({"message": "image supprimée avec succès"}), 200


######################################### images par stade ########################################################
@app.route("/api/maladie/stade/images/<string:stade_id>", methods=["GET"])
@token_required
def images_stade(current_user, stade_id):
    try:
        stade = Stade.objects.get(pk=stade_id)
    except Stade.DoesNotExist:
        return jsonify({"message": "stade introuvable"}), 404

    images = ImageStade.objects.filter(stade=stade)

    images_data = [convert_objet_to_dict(img) for img in images]
    return jsonify(images_data)


if __name__ == "__main__":
    app.run(host="192.168.11.104", port=5000)
