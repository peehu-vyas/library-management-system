from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate

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


@router.put("/{book_id}")
def update_book(
    book_id: int,
    book: BookUpdate,
    db: Session = Depends(get_db)
):

    db_book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    if not db_book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    existing_book = (
        db.query(Book)
        .filter(
            Book.isbn == book.isbn,
            Book.id != book_id
        )
        .first()
    )

    if existing_book:
        raise HTTPException(
            status_code=400,
            detail="Book with this ISBN already exists"
        )

    borrowed_count = (
        db_book.total_copies -
        db_book.available_copies
    )

    if book.total_copies < borrowed_count:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Cannot reduce total copies below "
                f"{borrowed_count} because copies "
                f"are currently borrowed"
            )
        )

    db_book.title = book.title
    db_book.author = book.author
    db_book.isbn = book.isbn

    db_book.available_copies = (
        book.total_copies -
        borrowed_count
    )

    db_book.total_copies = book.total_copies

    db.commit()
    db.refresh(db_book)

    return db_book