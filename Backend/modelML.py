# import cv2
from matplotlib import pyplot as plt
import numpy as np
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.densenet import preprocess_input
from tensorflow.keras.models import load_model
from PIL import Image
import tensorflow as tf
import efficientnet.keras as efn
def get_model():
    
    ''' This function gets the layers inclunding efficientnet ones. '''
    
    model_input = tf.keras.Input(shape=(224,224, 3),
                                 name='img_input')

    dummy = tf.keras.layers.Lambda(lambda x: x)(model_input)



    x = efn.EfficientNetB3(include_top=False,
                           weights='noisy-student',
                           input_shape=(224,224, 3),
                           pooling='avg')(dummy)
    x = tf.keras.layers.Dense(7, activation='softmax')(x)
    model = tf.keras.Model(model_input, x, name='aNetwork')
    model.summary()
    return model

