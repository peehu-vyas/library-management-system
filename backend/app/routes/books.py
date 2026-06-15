from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.book import Book
from app.schemas.book import BookCreate

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)


@router.get("/")
def get_books(
    db: Session = Depends(get_db)
):
    return db.query(Book).all()


@router.post("/")
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db)
):

    existing_book = (
        db.query(Book)
        .filter(Book.isbn == book.isbn)
        .first()
    )

    if existing_book:
        raise HTTPException(
            status_code=400,
            detail="Book with this ISBN already exists"
        )

    db_book = Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        total_copies=book.total_copies,
        available_copies=book.total_copies
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)

    return db_book