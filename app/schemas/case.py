from pydantic import BaseModel, Field
from typing import Optional

class CaseBase(BaseModel):
    title: str = Field(..., min_length=1)
    reference: Optional[str] = None
    notes: Optional[str] = None

class CaseCreate(CaseBase):
    pass

class CaseRead(CaseBase):
    id: int