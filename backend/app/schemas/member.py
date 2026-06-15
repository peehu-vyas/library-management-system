from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import Field
from pydantic import field_validator


class MemberCreate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):

        if not value.isdigit():
            raise ValueError(
                "Phone number must contain only digits"
            )

        if len(value) != 10:
            raise ValueError(
                "Phone number must be exactly 10 digits"
            )

        return value


class MemberUpdate(BaseModel):

    name: str = Field(
        min_length=2,
        max_length=100
    )

    email: EmailStr

    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value):

        if not value.isdigit():
            raise ValueError(
                "Phone number must contain only digits"
            )

        if len(value) != 10:
            raise ValueError(
                "Phone number must be exactly 10 digits"
            )

        return value