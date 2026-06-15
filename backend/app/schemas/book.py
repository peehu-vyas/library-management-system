from pydantic import BaseModel
from pydantic import Field
from pydantic import field_validator


class BookCreate(BaseModel):

    title: str = Field(
        min_length=1,
        max_length=255
    )

    author: str = Field(
        min_length=2,
        max_length=255
    )

    isbn: str

    total_copies: int = Field(
        gt=0
    )

    @field_validator("isbn")
    @classmethod
    def validate_isbn(cls, value):

        if len(value) not in [10, 13]:
            raise ValueError(
                "ISBN must be 10 or 13 characters"
            )

        return value