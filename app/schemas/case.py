from pydantic import BaseModel, Field
from typing import Optional

class CaseBase(BaseModel):
    title: str = Field(..., min_length=1)
    reference: Optional[str] = None
    notes: Optional[str] = None

class CaseCreate(CaseBase):
    title: str  # required on create
    pass

class CaseUpdate(CaseBase):
    pass  # all fields optional for partial update

class CaseRead(BaseModel):
    id: int
    title: str
    reference: Optional[str] = None
    notes: Optional[str] = None

class Config:
    from_attributes = True