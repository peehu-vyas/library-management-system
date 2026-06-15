from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.models.member import Member
from app.schemas.member import MemberCreate, MemberUpdate

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


@router.put("/{member_id}")
def update_member(
    member_id: int,
    member: MemberUpdate,
    db: Session = Depends(get_db)
):

    db_member = (
        db.query(Member)
        .filter(Member.id == member_id)
        .first()
    )

    if not db_member:
        raise HTTPException(
            status_code=404,
            detail="Member not found"
        )

    existing_member = (
        db.query(Member)
        .filter(
            Member.email == member.email,
            Member.id != member_id
        )
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="Member with this email already exists"
        )

    db_member.name = member.name
    db_member.email = member.email
    db_member.phone = member.phone

    db.commit()
    db.refresh(db_member)

    return db_member