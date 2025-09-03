# Reservation System REST API
A fully functional Reservation System REST API built with Node.js, TypeScript, Express, and PostgreSQL.  
It includes authentication, role-based access control, resource management, reservation handling, availability checks, statistics, error handling, and testing.

---

## Quick Start

1. Clone the repository
- git clone https://github.com/maximo-ale/room-reservation-api.git
- cd room-reservation-api

2. Install dependencies
- npm install

3. Copy '.env.example' to '.env'
- On Windows CMD:
copy .env.example .env
- On Windows PowerShell:
Copy-Item .env.example .env
- On Linux/macOS:
cp .env.example .env

4. The '.env' file already includes a test user and a public database

4. Start the server
- npm run dev

## Database Reset for Demo

This project includes a script to reset the database and load test data automatically when the server starts with:

RESET_DB_ON_START=true

Notes:

Only for demo/testing purposes.

It is disabled by default (RESET_DB_ON_START=false) in production to preserve real data.

This ensures each recruiter or tester starts with a clean environment.

# Features

## Authentication & Authorization
- JWT-based authentication  
- Role-based access (`admin` / `user`)  

## Room Management
- Create, read, update, delete rooms 
- Resource availability status 

## Reservation Management
- Create reservations if room is available  
- View own reservations  
- Cancel reservations  
- Admin can view all reservations  
- Availability checks prevent overlapping reservations  

## Statistics / Reports
- Top reserved resources  
- Users with most reservations  
- Get all rooms with filters

## Security & Performance 
- Global error handler  

## Technologies
- Node.js  
- Express 
- PostgreSQL
- JWT for authentication  
- Zod 
- bcrypt (password hashing)  
- Postman (manual testing)  

## Project Structure
- /config --> DB connection
- /entities --> Each entity has its own folder containing:
    - Controller
    - Repository
    - Routes
    - Service
- /middlewares
- /utils --> General helper functions and utilities
- /schemas --> Zod schemas to validate fields
- 'server.js'
- .env (ignored)

# API Endpoints

## Users
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/users/register` | Register a new user  |
| POST   | `/api/users/login`    | Login and get a token|
| GET    | `/api/users/profile`  | Get own profile      |
| PATCH  | `/api/users/profile`  | Update own profile   |
| GET    | `/api/users/all`      | Get all users        |

## Rooms (only admins)
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| POST   | `/api/rooms/`         | Create a new room    |
| GET    | `/api/rooms/all`      | Get all rooms        |
| GET    | `/api/rooms/:room_id` | Get details of a room|
| PATCH  | `/api/rooms/:room_id` | Update a room        |
| DELETE | `/api/rooms/:room_id` | Delete a room        |

## Reservations
| Method | Endpoint                                        | Description                          |
|--------|-------------------------------------------------|--------------------------------------|
| POST   | `/api/reservations/`                            | Create a new reservation (if available) |
| GET    | `/api/reservations/me`                          | Get own reservations                 |
| GET    | `/api/reservations/details/:reservation_id`     | Get details of a reservation         |
| PATCH  | `/api/reservations/cancel/:reservation_id`      | Cancel own reservation               |
| GET    | `/api/reservations/roomReservations/:room_id`   | Get all reservations for a room      |
| GET    | `/api/reservations/`                            | Get all reservations (with filters)  |

## Stats
| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/api/stats/topRooms` | Get most reserved rooms      |
| GET    | `/api/stats/topUsers` | Get users with most reservations |

## Author
Developed by Máximo Ale.
Contact: maximoale20000@gmail.com