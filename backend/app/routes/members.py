from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.member import Member
from app.schemas.member import MemberCreate

router = APIRouter(
    prefix="/members",
    tags=["Members"]
)


@router.get("/")
def get_members(
    db: Session = Depends(get_db)
):
    return db.query(Member).all()


@router.post("/")
def create_member(
    member: MemberCreate,
    db: Session = Depends(get_db)
):

    existing_member = (
        db.query(Member)
        .filter(Member.email == member.email)
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="Member with this email already exists"
        )

    db_member = Member(
        name=member.name,
        email=member.email,
        phone=member.phone
    )

    db.add(db_member)
    db.commit()
    db.refresh(db_member)

    return db_member