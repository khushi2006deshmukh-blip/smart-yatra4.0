from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import DBDestination, Base, SQLALCHEMY_DATABASE_URL

# Connect to the database
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Your core hackathon data
initial_destinations = [
    {
        "name": "Goa", 
        "city": "Panaji", 
        "state": "Goa", 
        "base_cost": 2000, 
        "tags": "Beaches, Nightlife", 
        "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500"
    },
    {
        "name": "Manali", 
        "city": "Manali", 
        "state": "Himachal Pradesh", 
        "base_cost": 3000, 
        "tags": "Mountains, Trekking", 
        "image_url": "https://images.unsplash.com/photo-1605649487212-4d4b1a457a41?w=500"
    },
    {
        "name": "Rishikesh", 
        "city": "Rishikesh", 
        "state": "Uttarakhand", 
        "base_cost": 1500, 
        "tags": "Rafting, Peace", 
        "image_url": "https://images.unsplash.com/photo-1600011689032-8b638b320d32?w=500"
    },
]

# Inject data if the database is empty
if db.query(DBDestination).count() == 0:
    for dest_data in initial_destinations:
        new_dest = DBDestination(**dest_data)
        db.add(new_dest)
    db.commit()
    print("Database seeded successfully. The frontend will now load.")
else:
    print("Database already has data. You are good to go.")

db.close()