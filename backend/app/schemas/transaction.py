from pydantic import BaseModel


class BorrowRequest(BaseModel):
    book_id: int
    member_id: int