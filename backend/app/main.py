from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base
from app.database import engine

# Import ALL models
from app.models.book import Book
from app.models.member import Member
from app.models.transaction import BorrowTransaction

# Import ALL routes
from app.routes.books import router as books_router
from app.routes.members import router as members_router
from app.routes.transactions import router as transactions_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Library Management System"
)

app.include_router(books_router)
app.include_router(members_router)
app.include_router(transactions_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {
        "status": "healthy",
        "service": "Library Management API"
    }