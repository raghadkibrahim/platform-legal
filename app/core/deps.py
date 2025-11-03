from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import User
from app.core.config import settings
# If you have real JWT imports, keep them too.

def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    auth = request.headers.get("Authorization")
    if not auth or not auth.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    token = auth.split(" ", 1)[1].strip()

    # DEV shortcut: accept "demo" outside prod
    if getattr(settings, "ENV", "dev") != "prod" and token == "demo":
        user = db.query(User).filter(User.email == "demo@local").first()
        if not user:
            user = User(email="demo@local", hashed_password="!", full_name="Demo User")
            db.add(user); db.commit(); db.refresh(user)
        return user

    # Otherwise fall back to your real JWT logic here (if any)
    raise HTTPException(status_code=401, detail="Invalid token")
