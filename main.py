from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from pydantic import BaseModel
from typing import List, Dict, Optional
import hashlib
import json

# --- Database Setup ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./budget_travel.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class DBDestination(Base):
    __tablename__ = "destinations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String)
    state = Column(String)
    base_cost = Column(Float)
    tags = Column(String)
    image_url = Column(String)

class DBUser(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class DBSavedTrip(Base):
    __tablename__ = "saved_trips"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    destination = Column(String)
    total_budget = Column(Float)
    trip_data_json = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Smart Yatra API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_pw(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# --- Mock Databases ---
hotels_db = {
    1: [
        {"name": "Beach Shack Inn", "price": 1200, "rating": 4.0, "type": "Budget"},
        {"name": "Palolem Beach Resort", "price": 3800, "rating": 4.5, "type": "Mid-Range"},
        {"name": "Taj Exotica Goa", "price": 12500, "rating": 4.9, "type": "Luxury"}
    ],
    2: [
        {"name": "Snow View Hostel", "price": 1500, "rating": 4.2, "type": "Budget"},
        {"name": "Apple Country Resort", "price": 4500, "rating": 4.6, "type": "Mid-Range"},
        {"name": "The Himalayan", "price": 14000, "rating": 4.9, "type": "Luxury"}
    ],
    3: [
        {"name": "Ganges View Ashram", "price": 900, "rating": 4.5, "type": "Budget"},
        {"name": "Aloha On The Ganges", "price": 4800, "rating": 4.7, "type": "Mid-Range"},
        {"name": "Ananda in the Himalayas", "price": 18000, "rating": 5.0, "type": "Luxury"}
    ]
}

activities_pool = [
    "Explore local markets and sample authentic street food.",
    "Morning heritage walk and scenic photo session.",
    "Adventure activities, hidden viewpoints, and nature trails.",
    "Relaxing afternoon, cafe hopping, and sunset point visit.",
    "Cultural site exploration, local craft shopping, and live music."
]

spots_db = {
    1: [
        {"name": "Butterfly Beach", "crowded": False, "vibe": "Hidden & Quiet", "cost": 0, "category": "Nature"},
        {"name": "Fontainhas Heritage Quarter", "crowded": False, "vibe": "Portuguese Culture & Art", "cost": 200, "category": "Culture"},
        {"name": "Dudhsagar Waterfalls Trek", "crowded": True, "vibe": "Adventure & Jungle", "cost": 1500, "category": "Adventure"},
        {"name": "Anjuna Flea Market", "crowded": True, "vibe": "Shopping & Nightlife", "cost": 500, "category": "Shopping"},
        {"name": "Chapora Fort Sunset", "crowded": False, "vibe": "Relaxation & Views", "cost": 0, "category": "Relaxation"}
    ],
    2: [
        {"name": "Sethan Village", "crowded": False, "vibe": "Offbeat Igloos & Snow", "cost": 800, "category": "Adventure"},
        {"name": "Jogini Waterfalls", "crowded": False, "vibe": "Peaceful Nature Trek", "cost": 0, "category": "Nature"},
        {"name": "Old Manali Cafe Hopping", "crowded": True, "vibe": "Food & Culture", "cost": 1000, "category": "Food"},
        {"name": "Solang Valley Paragliding", "crowded": True, "vibe": "Extreme Adventure", "cost": 3000, "category": "Adventure"}
    ],
    3: [
        {"name": "Vashishta Gufa", "crowded": False, "vibe": "Ancient Meditation", "cost": 0, "category": "Culture"},
        {"name": "Ganga Aarti at Parmarth Niketan", "crowded": True, "vibe": "Spiritual Peace", "cost": 0, "category": "Culture"},
        {"name": "Shivpuri White Water Rafting", "crowded": True, "vibe": "High Adrenaline", "cost": 1200, "category": "Adventure"},
        {"name": "Neelkanth Mahadev Trek", "crowded": False, "vibe": "Nature & Devotion", "cost": 300, "category": "Nature"}
    ]
}

# --- Pydantic Schemas ---
class Hotel(BaseModel):
    name: str
    price: float
    rating: float
    type: str

class Spot(BaseModel):
    name: str
    crowded: bool
    vibe: str
    cost: float
    category: Optional[str] = "General"

class BudgetBreakdown(BaseModel):
    intercityTravel: float
    stay: float
    food: float
    localTransport: float
    activities: float

class TourismImpact(BaseModel):
    score: int
    budgetEfficiency: str
    localExposure: str
    experienceDiversity: str
    recommendationFit: str

class LocalBusiness(BaseModel):
    name: str
    category: str
    specialty: str
    estimated_cost: str
    contact: str
    badge: Optional[str] = "🌱 Local Partner"

class SmartTripPlan(BaseModel):
    destination: str
    total_budget: float
    base_cost: float
    estimatedTotal: float
    recommended_hotel: Hotel
    available_hotels: List[Hotel]
    budgetBreakdown: BudgetBreakdown
    tourismImpact: TourismImpact
    itinerary: Dict[str, str]
    hidden_gems: List[Spot]
    local_businesses: Optional[List[LocalBusiness]] = []

class UserSignupRequest(BaseModel):
    name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class SaveTripRequest(BaseModel):
    user_id: int
    destination: str
    total_budget: float
    trip_data: dict

# --- API Endpoints ---
@app.get("/destinations")
def get_all_destinations(db: Session = Depends(get_db)):
    return db.query(DBDestination).all()

@app.post("/api/signup")
def signup_user(req: UserSignupRequest, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()
    existing = db.query(DBUser).filter(DBUser.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="Yeh email pehle se registered hai.")
    
    new_user = DBUser(
        name=req.name.strip(),
        email=email_clean,
        password_hash=hash_pw(req.password)
    )
    db.add(new_user)
    db.commit()
    return {"status": "success", "message": "Account ban gaya! Ab login karein."}

@app.post("/api/login")
def login_user(req: UserLoginRequest, db: Session = Depends(get_db)):
    email_clean = req.email.strip().lower()
    pw_hash = hash_pw(req.password)
    user = db.query(DBUser).filter(DBUser.email == email_clean, DBUser.password_hash == pw_hash).first()
    if not user:
        raise HTTPException(status_code=401, detail="Galat email ya password!")
    return {
        "status": "success",
        "user": {"id": user.id, "name": user.name, "email": user.email}
    }

@app.post("/api/trips/save")
def save_trip(req: SaveTripRequest, db: Session = Depends(get_db)):
    new_trip = DBSavedTrip(
        user_id=req.user_id,
        destination=req.destination,
        total_budget=req.total_budget,
        trip_data_json=json.dumps(req.trip_data)
    )
    db.add(new_trip)
    db.commit()
    return {"status": "success", "message": "Trip successfully account mein save ho gayi!"}

@app.get("/plan-smart-trip/{dest_id}/{user_budget}", response_model=SmartTripPlan)
def plan_smart_trip(dest_id: int, user_budget: float, days: int = 3, db: Session = Depends(get_db)):
    dest = db.query(DBDestination).filter(DBDestination.id == dest_id).first()
    if not dest:
        raise HTTPException(status_code=404, detail="Destination not found.")
    
    valid_hotels = hotels_db.get(dest_id, [{"name": "Standard Stay", "price": 1200, "rating": 4.0, "type": "Budget"}])
    available = hotels_db.get(dest_id, valid_hotels)
    best_hotel = available[0]
    hotel_price = best_hotel["price"]
    
    remaining_after_travel = user_budget - dest.base_cost
    if remaining_after_travel < 0:
        raise HTTPException(status_code=400, detail=f"Budget too low. At least ₹{dest.base_cost} required for travel.")

    food_cost = round(remaining_after_travel * 0.3)
    local_transport = round(remaining_after_travel * 0.15)
    activities_cost = round(remaining_after_travel * 0.2)
    
    estimated_total = dest.base_cost + hotel_price + food_cost + local_transport + activities_cost
    all_spots = spots_db.get(dest_id, [{"name": "City Center Walk", "crowded": False, "vibe": "General Exploration", "cost": 0, "category": "Culture"}])
    impact_score = 85 if any(not s["crowded"] for s in all_spots) else 50

    generated_itinerary = {}
    for day in range(1, days + 1):
        if day == 1:
            generated_itinerary[f"Day {day}"] = f"Arrive in {dest.name}. Check into {best_hotel['name']}. Settle in and explore nearby surroundings."
        elif day == days:
            generated_itinerary[f"Day {day}"] = f"Final day in {dest.name}. Souvenir shopping, check-out, and departure."
        else:
            activity_text = activities_pool[(day - 2) % len(activities_pool)]
            gem_name = all_spots[(day - 2) % len(all_spots)]['name'] if all_spots else "local landmark"
            generated_itinerary[f"Day {day}"] = f"Visit {gem_name}. {activity_text}"

    return {
        "local_businesses": [
            {
                "name": "Verma Bike & Scooter Rental",
                "category": "🛵 Local Commute",
                "specialty": "Affordable self-drive bikes with zero commission",
                "estimated_cost": "₹350/day",
                "contact": "+91 9876543210",
                "badge": "🌱 Local Partner"
            },
            {
                "name": "Sahu Shuddh Desi Dhaba",
                "category": "🍲 Regional Food",
                "specialty": "Authentic regional thali made by local family",
                "estimated_cost": "₹140/thali",
                "contact": "+91 9812345678",
                "badge": "⭐ Family-Run"
            }
        ],
        "destination": dest.name,
        "total_budget": user_budget,
        "base_cost": dest.base_cost,
        "estimatedTotal": estimated_total,
        "recommended_hotel": best_hotel,
        "available_hotels": available,
        "budgetBreakdown": {
            "intercityTravel": dest.base_cost,
            "stay": hotel_price,
            "food": food_cost,
            "localTransport": local_transport,
            "activities": activities_cost
        },
        "tourismImpact": {
            "score": impact_score,
            "budgetEfficiency": "Optimized",
            "localExposure": "Excellent",
            "experienceDiversity": "Varied",
            "recommendationFit": "92% Match"
        },
        "itinerary": generated_itinerary,
        "hidden_gems": all_spots
    }

@app.get("/seed")
def seed_database(db: Session = Depends(get_db)):
    if db.query(DBDestination).count() == 0:
        initial_destinations = [
            {"name": "Goa", "city": "Panaji", "state": "Goa", "base_cost": 2000, "tags": "Beaches, Nightlife", "image_url": ""},
            {"name": "Manali", "city": "Manali", "state": "Himachal Pradesh", "base_cost": 3000, "tags": "Mountains, Trekking", "image_url": ""},
            {"name": "Rishikesh", "city": "Rishikesh", "state": "Uttarakhand", "base_cost": 1500, "tags": "Rafting, Peace", "image_url": ""}
        ]
        for dest in initial_destinations:
            db.add(DBDestination(**dest))
        db.commit()
        return {"status": "Database seeded."}
    return {"status": "Already seeded."}