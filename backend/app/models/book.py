from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.database import Base


class Book(Base):

    __tablename__ = "books"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    title = Column(
        String(255),
        nullable=False
    )

    author = Column(
        String(255),
        nullable=False
    )

    isbn = Column(
        String(50),
        unique=True
    )

    total_copies = Column(
        Integer,
        default=1
    )

    available_copies = Column(
        Integer,
        default=1
    )