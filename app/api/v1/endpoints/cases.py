from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
from app.schemas.case import CaseCreate, CaseRead, CaseUpdate
from app.db.session import get_db
from app.models.models import Case, User
from app.core.deps import get_current_user

router = APIRouter()

def get_case_or_404_owned(db: Session, case_id: int, owner_id: int) -> Case:
    case = db.query(Case).filter(Case.id == case_id, Case.owner_id == owner_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("", response_model=CaseRead, status_code=201, summary="Create case")
def create_case(
    payload: CaseCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    case = Case(
        title=payload.title,
        reference=payload.reference,
        notes=payload.notes,
        owner_id=user.id,          # <- IMPORTANT
    )
    db.add(case); db.commit(); db.refresh(case)
    return CaseRead(id=case.id, title=case.title, reference=case.reference, notes=case.notes)

@router.get("", response_model=List[CaseRead], summary="List my cases")
def list_cases(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    rows = (
        db.query(Case)
        .filter(Case.owner_id == user.id)
        .order_by(Case.id.desc())
        .all()
    )
    return [CaseRead(id=r.id, title=r.title, reference=r.reference, notes=r.notes) for r in rows]

@router.get("/{case_id}", response_model=CaseRead, summary="Get my case")
def get_case(
    case_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    r = get_case_or_404_owned(db, case_id, user.id)
    return CaseRead(id=r.id, title=r.title, reference=r.reference, notes=r.notes)

@router.put("/{case_id}", response_model=CaseRead, summary="Update my case")
def update_case(
    case_id: int,
    payload: CaseUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    case = get_case_or_404_owned(db, case_id, user.id)
    if payload.title is not None: case.title = payload.title
    if payload.reference is not None: case.reference = payload.reference
    if payload.notes is not None: case.notes = payload.notes
    db.add(case); db.commit(); db.refresh(case)
    return CaseRead(id=case.id, title=case.title, reference=case.reference, notes=case.notes)

@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete my case")
def delete_case(
    case_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    case = get_case_or_404_owned(db, case_id, user.id)
    db.delete(case); db.commit()
    return None
