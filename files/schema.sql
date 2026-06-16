-- =============================================
-- UniScheduler Database Schema
-- MySQL 8.x
-- =============================================

CREATE DATABASE IF NOT EXISTS unischeduler CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE unischeduler;

-- Faculty
CREATE TABLE IF NOT EXISTS faculty (
    faculty_id   VARCHAR(10)  PRIMARY KEY,
    faculty_name VARCHAR(100) NOT NULL,
    department   VARCHAR(100)
);

-- Student Groups
CREATE TABLE IF NOT EXISTS student_groups (
    group_id   VARCHAR(20)  PRIMARY KEY,
    group_name VARCHAR(100),
    strength   INT          NOT NULL,
    department VARCHAR(100)
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
    course_id      VARCHAR(10)  PRIMARY KEY,
    course_name    VARCHAR(100) NOT NULL,
    faculty_id     VARCHAR(10)  REFERENCES faculty(faculty_id),
    group_id       VARCHAR(20)  REFERENCES student_groups(group_id),
    weekly_classes INT          NOT NULL DEFAULT 3
);

-- Rooms
CREATE TABLE IF NOT EXISTS rooms (
    room_id   VARCHAR(10) PRIMARY KEY,
    capacity  INT         NOT NULL,
    room_type VARCHAR(50) DEFAULT 'Lecture Hall'
);

-- Timetable Entries (generated output)
CREATE TABLE IF NOT EXISTS timetable_entries (
    id          BIGINT       AUTO_INCREMENT PRIMARY KEY,
    course_id   VARCHAR(10)  REFERENCES courses(course_id),
    room_id     VARCHAR(10)  REFERENCES rooms(room_id),
    day_of_week VARCHAR(10)  NOT NULL,
    slot_index  INT          NOT NULL,
    time_label  VARCHAR(20),
    UNIQUE KEY uniq_room_slot (room_id, day_of_week, slot_index),
    UNIQUE KEY uniq_group_slot (course_id, day_of_week, slot_index)
);

-- =============================================
-- SEED DATA
-- =============================================

INSERT INTO faculty (faculty_id, faculty_name, department) VALUES
    ('F1', 'Dr. Rao',    'Computer Science'),
    ('F2', 'Dr. Kumar',  'Computer Science'),
    ('F3', 'Dr. Sharma', 'Mathematics'),
    ('F4', 'Dr. Patel',  'Computer Science')
ON DUPLICATE KEY UPDATE faculty_name = VALUES(faculty_name);

INSERT INTO student_groups (group_id, group_name, strength, department) VALUES
    ('CSE-A', 'CSE-A 2024', 55, 'Computer Science'),
    ('CSE-B', 'CSE-B 2024', 45, 'Computer Science')
ON DUPLICATE KEY UPDATE strength = VALUES(strength);

INSERT INTO rooms (room_id, capacity, room_type) VALUES
    ('R101', 60, 'Lecture Hall'),
    ('R102', 40, 'Lecture Hall'),
    ('R103', 30, 'Seminar Room'),
    ('R104', 80, 'Lecture Hall')
ON DUPLICATE KEY UPDATE capacity = VALUES(capacity);

INSERT INTO courses (course_id, course_name, faculty_id, group_id, weekly_classes) VALUES
    ('C101', 'DBMS',              'F1', 'CSE-A', 3),
    ('C102', 'Java Programming',  'F2', 'CSE-A', 4),
    ('C103', 'Mathematics',       'F3', 'CSE-B', 3),
    ('C104', 'Operating Systems', 'F4', 'CSE-B', 3),
    ('C105', 'Computer Networks', 'F1', 'CSE-A', 2)
ON DUPLICATE KEY UPDATE course_name = VALUES(course_name);
