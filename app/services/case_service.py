from typing import Dict, List
from app.schemas.case import CaseCreate, CaseRead

class CaseService:
    def __init__(self):
        self._store: Dict[int, CaseRead] = {}
        self._seq = 0

    def create(self, data: CaseCreate) -> CaseRead:
        self._seq += 1
        case = CaseRead(id=self._seq, **data.model_dump())
        self._store[self._seq] = case
        return case

    def list(self) -> List[CaseRead]:
        return list(self._store.values())

    def get(self, case_id: int) -> CaseRead | None:
        return self._store.get(case_id)

case_service = CaseService()
