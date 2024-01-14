#!/usr/bin/python3
from models.base_model import BaseModel, Base
from models.state import State
from models.city import City
from models.place import Place
from models.review import Review
from models.user import User
from models.amenity import Amenity
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import storage


places = storage.all(Place)
for key, value in places.items():
	print(dir(value))
	print("***************************************************************")
	break