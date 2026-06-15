# Backend

## Technology Stack

* Python 3.11
* FastAPI
* PostgreSQL
* SQLAlchemy
* Pydantic
* Uvicorn

---

## Database Schema

### Books

| Column           | Type    | Constraints                |
| ---------------- | ------- | -------------------------- |
| id               | Integer | Primary Key                |
| title            | String  | Not Null                   |
| author           | String  | Not Null                   |
| isbn             | String  | Unique                     |
| total_copies     | Integer | Greater than 0             |
| available_copies | Integer | Greater than or Equal to 0 |

### Members

| Column | Type    | Constraints |
| ------ | ------- | ----------- |
| id     | Integer | Primary Key |
| name   | String  | Not Null    |
| email  | String  | Unique      |
| phone  | String  | 10 Digits   |

### Borrow Transactions

| Column      | Type      | Constraints         |
| ----------- | --------- | ------------------- |
| id          | Integer   | Primary Key         |
| book_id     | Integer   | Foreign Key         |
| member_id   | Integer   | Foreign Key         |
| borrowed_at | Timestamp | Not Null            |
| returned_at | Timestamp | Nullable            |
| status      | String    | BORROWED / RETURNED |

---

## Environment Variables

Create a `.env` file inside the backend directory:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/library

JWT_SECRET=mysecretkey

JWT_ALGORITHM=HS256
```

---

## Install Dependencies

```bash
cd backend

python3.11 -m venv venv

source venv/bin/activate

pip install -r requirements.txt
```

If using email validation:

```bash
pip install email-validator
```

---

## Run PostgreSQL

Example local database:

```sql
CREATE DATABASE library;
```

---

## Start Backend

```bash
cd backend

uvicorn app.main:app --reload
```

Application URL:

http://localhost:8000

Swagger Documentation:

http://localhost:8000/docs

---

## API Endpoints

### Health Check

```http
GET /
```

---

### Books

Get all books

```http
GET /books/
```

Create a book

```http
POST /books/
```

Example Request:

```json
{
  "title": "Clean Code",
  "author": "Robert Martin",
  "isbn": "1234567890",
  "total_copies": 5
}
```

---

### Members

Get all members

```http
GET /members/
```

Create a member

```http
POST /members/
```

Example Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

---

### Transactions

Borrow a book

```http
POST /transactions/borrow
```

Example Request:

```json
{
  "book_id": 1,
  "member_id": 1
}
```

Return a book

```http
POST /transactions/return/{transaction_id}
```

Get all transactions for a member

```http
GET /transactions/member/{member_id}
```

---

## Business Rules

### Books

* ISBN must be unique.
* Total copies must be greater than zero.
* Available copies are initialized with total copies.

### Members

* Email must be unique.
* Email must be valid.
* Phone number must contain exactly 10 digits.

### Borrowing

* Book must exist.
* Member must exist.
* Book must have available copies.
* A member cannot borrow the same book twice without returning it first.
* Available copies decrease when a book is borrowed.

### Returning

* Only active borrow transactions can be returned.
* Available copies increase when a book is returned.
* Transaction status changes from `BORROWED` to `RETURNED`.

---

## Sample Workflow

1. Create a Member
2. Create a Book
3. Borrow the Book
4. View Member Transactions
5. Return the Book

---

# Frontend

## Technology Stack

* Next.js
* React
* Axios

---

## Frontend Features

### Home Page

Provides navigation to:

* Books
* Members
* Transactions

### Books

Allows library staff to:

* Create new books
* View all books
* See available copies

### Members

Allows library staff to:

* Create new members
* View all members

### Transactions

Allows library staff to:

* Borrow a book
* Return a book
* View borrowing history for a member

---

## Install Dependencies

```bash
cd frontend

npm install
```

---

## Start Frontend

```bash
npm run dev
```

Application URL:

http://localhost:3000

---

# End-to-End Testing

1. Start PostgreSQL
2. Start Backend Server
3. Start Frontend Application
4. Create a Member
5. Create a Book
6. Borrow a Book
7. View Member Transaction History
8. Return the Book

---

# Docker (Optional)

## docker-compose.yml

```yaml
version: "3.9"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: library
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    depends_on:
      - backend
    ports:
      - "3000:3000"
```

---

## Backend Dockerfile

Create `backend/Dockerfile`

```dockerfile
FROM python:3.11

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## Frontend Dockerfile

Create `frontend/Dockerfile`

```dockerfile
FROM node:18

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

---

## Run Full Stack

```bash
docker compose up --build
```

This starts:

* PostgreSQL
* FastAPI Backend
* Next.js Frontend

---

## Access URLs

Frontend:

http://localhost:3000

Backend:

http://localhost:8000

Swagger Documentation:

http://localhost:8000/docs

---

# Architecture Overview

## System Flow

```text
┌───────────────┐
│   Next.js UI  │
│   (Frontend)  │
└───────┬───────┘
        │ REST API
        ▼
┌───────────────┐
│    FastAPI    │
│   (Backend)   │
└───────┬───────┘
        │ SQLAlchemy
        ▼
┌───────────────┐
│ PostgreSQL DB │
└───────────────┘
```

### Frontend (Next.js)

Responsible for:

* Managing books
* Managing members
* Borrowing books
* Returning books
* Viewing transaction history

### Backend (FastAPI)

Responsible for:

* Request validation
* Business rule enforcement
* Database operations
* Error handling

### Database (PostgreSQL)

Stores:

* Books
* Members
* Borrow transactions

---

# Design Decisions

## Book Availability Tracking

Instead of calculating available copies dynamically, the system maintains an `available_copies` column.

Benefits:

* Faster lookups
* Simplified borrow validation
* Reduced database queries

---

## Transaction-Based Borrowing

Every borrow operation creates a transaction record.

Benefits:

* Complete audit trail
* Borrow history tracking
* Supports future overdue/fine features

---

## Soft Return Model

Returned books are not deleted.

Instead:

* `returned_at` is populated
* `status` changes to `RETURNED`

Benefits:

* Historical reporting
* Auditability

---

# Validation Rules

## Book Validation

* Title is required
* Author is required
* ISBN must be unique
* Total copies must be greater than zero

## Member Validation

* Name is required
* Email must be valid
* Email must be unique
* Phone number must contain exactly 10 digits

## Borrow Validation

* Book must exist
* Member must exist
* Book must have available copies
* Member cannot borrow the same book twice without returning it

## Return Validation

* Transaction must exist
* Transaction must not already be returned

---

# Edge Cases Handled

## Borrowing When No Copies Are Available

Scenario:

```text
Available Copies = 0
```

Result:

```text
Borrow request is rejected
```

---

## Duplicate ISBN

Scenario:

```text
Book created with existing ISBN
```

Result:

```text
Request rejected
```

---

## Duplicate Member Email

Scenario:

```text
Member created with existing email
```

Result:

```text
Request rejected
```

---

## Returning an Already Returned Book

Scenario:

```text
Transaction status = RETURNED
```

Result:

```text
Return request rejected
```

---

## Borrowing Same Book Twice

Scenario:

```text
Member already has active borrow transaction
```

Result:

```text
Borrow request rejected
```

---

# Assumptions

* Application is intended for library staff usage.
* The frontend is designed as an administrative interface for library staff rather than an end-user self-service portal.
* Authentication is not implemented as it was outside assignment scope.
* Member and Book IDs are visible to staff for operational purposes.
* PostgreSQL is the primary datastore.
* REST API was chosen instead of gRPC for simplicity and faster development.

---

# Future Enhancements

* Authentication and Role-Based Access Control
* Due Dates, Overdue Tracking, and Fine Management
* Unit and Integration Testing
* Book Reservation System
* CI/CD Pipeline
