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

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

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

## Future Enhancements

* Authentication and Authorization
* Due Dates
* Overdue Tracking
* Fine Calculation
* Pagination
* Docker Compose
* Unit Testing
* Alembic Migrations
* Next.js Frontend
