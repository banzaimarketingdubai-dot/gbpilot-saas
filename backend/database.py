import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Read the database URL from environment variables
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

# Supabase connection string might need 'postgresql://' instead of 'postgres://'
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create SQLAlchemy engine
if SQLALCHEMY_DATABASE_URL:
    engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True, connect_args={"connect_timeout": 5})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
else:
    # Fallback or warning if no DB is provided
    print("WARNING: No DATABASE_URL provided. Database features will not work.")
    engine = None
    SessionLocal = None

def get_db():
    if not SessionLocal:
        yield None
        return
    db = None
    try:
        db = SessionLocal()
        yield db
    except Exception as e:
        print(f"[Database] Connection error: {e}")
        yield None
    finally:
        if db:
            try:
                db.close()
            except Exception:
                pass
