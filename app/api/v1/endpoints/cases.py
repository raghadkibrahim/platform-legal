from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.schemas.case import CaseCreate, CaseRead
from app.db.session import get_db
from app.models.models import Case
from app.core.deps import get_current_user
from app.models.models import User

router = APIRouter()

@router.post("/", response_model=CaseRead, summary="Create case")
def create_case(payload: CaseCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    case = Case(title=payload.title, reference=payload.reference, notes=payload.notes, owner_id=user.id)
    db.add(case)
    db.commit()
    db.refresh(case)
    return CaseRead(id=case.id, title=case.title, reference=case.reference, notes=case.notes)

@router.get("/", response_model=List[CaseRead], summary="List my cases")
def list_cases(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(Case).filter(Case.owner_id == user.id).order_by(Case.id.desc()).all()
    return [CaseRead(id=r.id, title=r.title, reference=r.reference, notes=r.notes) for r in rows]

@router.get("/{case_id}", response_model=CaseRead, summary="Get my case")
def get_case(case_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    r = db.query(Case).filter(Case.id == case_id, Case.owner_id == user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Case not found")
    return CaseRead(id=r.id, title=r.title, reference=r.reference, notes=r.notes)
