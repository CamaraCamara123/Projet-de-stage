from datetime import datetime
from flask import Flask, request, jsonify
from bson import ObjectId
from mongoengine import (
    DateField,
    ImageField,
    ReferenceField,
    ListField,
    BooleanField,
    ObjectIdField,
    DateTimeField,
    FloatField
)
from mongoengine import Document, StringField, IntField
from flask_login import UserMixin
from werkzeug.security import check_password_hash

##############################################les classes ################################################################
class User(Document, UserMixin):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    username = StringField(required=True)
    password = StringField(required=True)
    confirmPassword = StringField(required=True)
    nom = StringField(required=True)
    prenom = StringField(required=True)
    photoName = StringField(required=False, max_length=100)
    photo = StringField(required=False)
    role = ListField(StringField(required=True))
    tel = StringField(required=True)
    genre = StringField(required=True)
    meta = {"allow_inheritance": True}

    @staticmethod
    def check_password(user, password):
        return check_password_hash(user.password, password)

    @staticmethod
    def get_user_by_username(username):
        return User.objects(username=username).first()

    @staticmethod
    def get_user_by_id(user_id):
        return User.objects(pk=user_id).first()

class Patient(User):
    birthdate = DateField()
    adresse = StringField(required=True)
    rdv = ListField(ReferenceField("Rendez_vous"))


class Secretaire(User):
    codeEmp = StringField(required=True)


class Dermatologue(User):
    codeEmp = StringField(required=True)
    rdv = ListField(ReferenceField("Rendez_vous"))


class Rendez_vous(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    dateDebutRdv = DateTimeField()
    dateFinRdv = DateTimeField()
    statut = BooleanField(default=False)
    medecin = ReferenceField("Dermatologue")
    patient = ReferenceField("Patient")
    consultation = ReferenceField("Consultation")


class Consultation(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    dateConsult = DateTimeField(default=lambda:datetime.now())
    diagnostics = ListField(ReferenceField("Diagnostic"))
    rdv = ReferenceField("Rendez_vous")

class Diagnostic(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    dateDiagnostic = DateTimeField(default=lambda:datetime.now())
    descripSymptome = ListField(StringField(required=False))
    imageName = StringField(required=False)
    imagePath = StringField(required=False)
    description = StringField(required=False)
    prescription = ListField(StringField(required=False))
    consultation = ReferenceField("Consultation")
    maladie = ReferenceField("Maladie")
    probability = FloatField(required=False)
    maladies = ListField(ReferenceField("Maladie"))
    probabilities= ListField(FloatField())

class Maladie(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    fullName = StringField(required=True)
    nom = StringField(required=True)
    stade = ListField(ReferenceField("Stade"))


class Stade(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    stade = StringField(required=True)
    description = StringField(required=True)
    maladie = ReferenceField("Maladie")
    images = ListField(ReferenceField("ImageStade"))


class ImageStade(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    imagePath = StringField(required=True)
    title = StringField(required=True)
    stade = ReferenceField("Stade")

class Symptoms(Document):
    _id = ObjectIdField(primary_key=True, default=lambda: ObjectId())
    nom = StringField(required=True)