from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models.book import Book
from app.models.member import Member
from app.models.transaction import BorrowTransaction

from app.schemas.transaction import BorrowRequest


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.post("/borrow")
def borrow_book(
    request: BorrowRequest,
    db: Session = Depends(get_db)
):

    book = (
        db.query(Book)
        .filter(Book.id == request.book_id)
        .first()
    )

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    member = (
        db.query(Member)
        .filter(Member.id == request.member_id)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )
    
    existing_borrow = (
        db.query(BorrowTransaction)
        .filter(
            BorrowTransaction.book_id == request.book_id,
            BorrowTransaction.member_id == request.member_id,
            BorrowTransaction.status == "BORROWED"
        )
        .first()
    )

    if existing_borrow:
        raise HTTPException(
            status_code=400,
            detail="Member already has this book borrowed"
        )

    if book.available_copies <= 0:
        raise HTTPException(
            status_code=400,
            detail="Book is not available"
        )

    transaction = BorrowTransaction(
        book_id=request.book_id,
        member_id=request.member_id,
        borrowed_at=datetime.utcnow(),
        status="BORROWED"
    )

    book.available_copies -= 1

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "message": "Book borrowed successfully",
        "transaction_id": transaction.id
    }


@router.post("/return/{transaction_id}")
def return_book(
    transaction_id: int,
    db: Session = Depends(get_db)
):

    transaction = (
        db.query(BorrowTransaction)
        .filter(BorrowTransaction.id == transaction_id)
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    if transaction.status == "RETURNED":
        raise HTTPException(
            status_code=400,
            detail="Book already returned"
        )

    book = (
        db.query(Book)
        .filter(Book.id == transaction.book_id)
        .first()
    )

    transaction.status = "RETURNED"
    transaction.returned_at = datetime.utcnow()

    if book:
        book.available_copies += 1

    db.commit()

    return {
        "message": "Book returned successfully"
    }


@router.get("/member/{member_id}")
def get_member_transactions(
    member_id: int,
    db: Session = Depends(get_db)
):

    member = (
        db.query(Member)
        .filter(Member.id == member_id)
        .first()
    )

    if not member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    transactions = (
        db.query(BorrowTransaction)
        .filter(BorrowTransaction.member_id == member_id)
        .all()
    )

    return transactions