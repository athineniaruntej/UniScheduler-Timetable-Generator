# UniScheduler — University Timetable Generator

A full-stack timetable scheduling system using **Constraint Satisfaction Problem (CSP)** algorithms.

---

## Technology Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML, CSS, JavaScript (Vanilla)   |
| Backend   | Java 17 + Spring Boot 3.2         |
| Database  | MySQL 8.x                         |
| Algorithm | CSP + Backtracking + MRV + FC     |

---

## Project Structure

```
timetable-generator/
├── index.html          ← Frontend (open in browser)
├── style.css
├── app.js              ← CSP solver runs here in browser demo mode
└── backend/            ← Spring Boot backend
    ├── pom.xml
    └── src/main/
        ├── java/com/unischeduler/
        │   ├── UniSchedulerApplication.java
        │   ├── model/          ← JPA entities
        │   ├── repository/     ← Spring Data repos
        │   ├── service/        ← Business logic
        │   ├── controller/     ← REST API endpoints
        │   └── csp/
        │       └── CSPSolver.java   ← Core algorithm
        └── resources/
            ├── application.properties
            └── schema.sql      ← MySQL DDL + seed data
```

---

## Quick Start

### 1. Frontend (demo mode, no backend needed)
Simply open `index.html` in a browser. All data is in-memory.

### 2. Full Stack Setup

#### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.x

#### Step 1: Database
```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

#### Step 2: Configure DB password
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=your_password
```

#### Step 3: Run Spring Boot
```bash
cd backend
mvn spring-boot:run
```

Server starts at `http://localhost:8080`

---

## REST API Endpoints

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | /api/faculty                      | List all faculty         |
| POST   | /api/faculty                      | Add faculty              |
| DELETE | /api/faculty/{id}                 | Remove faculty           |
| GET    | /api/courses                      | List all courses         |
| POST   | /api/courses                      | Add course               |
| GET    | /api/rooms                        | List all rooms           |
| POST   | /api/rooms                        | Add room                 |
| GET    | /api/groups                       | List student groups      |
| POST   | /api/groups                       | Add student group        |
| POST   | /api/timetable/generate           | **Run CSP Solver**       |
| GET    | /api/timetable                    | Get full timetable       |
| GET    | /api/timetable/faculty/{id}       | Faculty timetable        |
| GET    | /api/timetable/room/{id}          | Room timetable           |
| GET    | /api/timetable/group/{id}         | Student group timetable  |
| DELETE | /api/timetable                    | Clear timetable          |

### Generate Request Body
```json
{
  "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "slotsPerDay": 6,
  "avoidLate": true,
  "forwardChecking": true
}
```

---

## CSP Algorithm

### Variables
Each lecture session is a variable: `DBMS_1`, `DBMS_2`, `JAVA_1`, etc.

### Domain
Every variable can be assigned a `(day, timeSlot, room)` triple.

### Hard Constraints
1. **Faculty** — same faculty cannot teach two classes at the same time
2. **Room** — same room cannot host two classes at the same time
3. **Student Group** — same group cannot attend two classes at the same time
4. **Capacity** — `room.capacity >= group.strength`

### Algorithm Flow
```
1. Build variables from weekly_classes of each course
2. Build domain: all (day, slot, room) combinations
3. Apply MRV: order variables by fewest valid values
4. Backtrack:
   a. Pick next variable (MRV)
   b. Try each value in domain
   c. Check all constraints
   d. If valid → recurse
   e. If conflict → backtrack
5. Forward checking: prune domains of future vars after each assignment
6. If no solution → greedy fallback
```

---

## Database Design

```
Faculty(faculty_id PK, faculty_name, department)
StudentGroups(group_id PK, group_name, strength, department)
Courses(course_id PK, course_name, faculty_id FK, group_id FK, weekly_classes)
Rooms(room_id PK, capacity, room_type)
TimetableEntries(id PK, course_id FK, room_id FK, day_of_week, slot_index, time_label)
```

---

## Modules

| # | Module               | Description                                    |
|---|----------------------|------------------------------------------------|
| 1 | Data Entry           | Faculty, Courses, Rooms, Groups CRUD           |
| 2 | Constraint Manager   | Hard & soft constraint configuration           |
| 3 | CSP Solver           | Backtracking + MRV + Forward Checking          |
| 4 | Timetable Generator  | Runs solver, stores results                    |
| 5 | Visualization        | Master/Faculty/Room/Group views                |
| 6 | Export               | PDF (iText) / Excel (Apache POI) — backend     |

---

*Built with ❤ — CSP-based scheduling*
