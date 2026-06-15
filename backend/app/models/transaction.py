from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy import ForeignKey

from app.database import Base


class BorrowTransaction(Base):

    __tablename__ = "borrow_transactions"

    id = Column(
        Integer,
        primary_key=True
    )

    book_id = Column(
        Integer,
        ForeignKey("books.id"),
        nullable=False
    )

    member_id = Column(
        Integer,
        ForeignKey("members.id"),
        nullable=False
    )

    borrowed_at = Column(DateTime)

    returned_at = Column(DateTime)

    status = Column(
        String(20)
    )