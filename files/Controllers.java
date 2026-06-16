package com.unischeduler.controller;

import com.unischeduler.csp.CSPSolver;
import com.unischeduler.model.*;
import com.unischeduler.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// ==================== FACULTY ====================
@RestController
@RequestMapping("/api/faculty")
@CrossOrigin(origins = "*")
class FacultyController {

    @Autowired FacultyService facultyService;

    @GetMapping
    public List<Faculty> getAll() { return facultyService.findAll(); }

    @PostMapping
    public ResponseEntity<Faculty> create(@RequestBody Faculty faculty) {
        return ResponseEntity.ok(facultyService.save(faculty));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        facultyService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// ==================== COURSES ====================
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
class CourseController {

    @Autowired CourseService courseService;

    @GetMapping
    public List<Course> getAll() { return courseService.findAll(); }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.save(course));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        courseService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// ==================== ROOMS ====================
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
class RoomController {

    @Autowired RoomService roomService;

    @GetMapping
    public List<Room> getAll() { return roomService.findAll(); }

    @PostMapping
    public ResponseEntity<Room> create(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.save(room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        roomService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// ==================== STUDENT GROUPS ====================
@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
class StudentGroupController {

    @Autowired StudentGroupService groupService;

    @GetMapping
    public List<StudentGroup> getAll() { return groupService.findAll(); }

    @PostMapping
    public ResponseEntity<StudentGroup> create(@RequestBody StudentGroup group) {
        return ResponseEntity.ok(groupService.save(group));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        groupService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

// ==================== TIMETABLE / CSP ====================
@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
class TimetableController {

    @Autowired CourseService courseService;
    @Autowired RoomService roomService;
    @Autowired TimetableService timetableService;

    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generate(@RequestBody Map<String, Object> config) {
        List<String> days = (List<String>) config.getOrDefault("days",
            Arrays.asList("Mon", "Tue", "Wed", "Thu", "Fri"));
        int slotsPerDay = (int) config.getOrDefault("slotsPerDay", 6);
        boolean avoidLate = (boolean) config.getOrDefault("avoidLate", true);
        boolean forwardChecking = (boolean) config.getOrDefault("forwardChecking", true);

        List<Course> courses = courseService.findAll();
        List<Room> rooms = roomService.findAll();

        CSPSolver solver = new CSPSolver(courses, rooms, days, slotsPerDay, avoidLate, forwardChecking);
        CSPSolver.SolveResult result = solver.solve();

        // Persist timetable entries
        List<TimetableEntry> entries = timetableService.saveFromResult(result, courses, rooms);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", result.success);
        response.put("assignedCount", result.assignments.size());
        response.put("backtracks", result.backtracks);
        response.put("nodesExplored", result.nodesExplored);
        response.put("log", result.log);
        response.put("entries", entries);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public List<TimetableEntry> getAll() { return timetableService.findAll(); }

    @GetMapping("/faculty/{facultyId}")
    public List<TimetableEntry> getByFaculty(@PathVariable String facultyId) {
        return timetableService.findByFaculty(facultyId);
    }

    @GetMapping("/room/{roomId}")
    public List<TimetableEntry> getByRoom(@PathVariable String roomId) {
        return timetableService.findByRoom(roomId);
    }

    @GetMapping("/group/{groupId}")
    public List<TimetableEntry> getByGroup(@PathVariable String groupId) {
        return timetableService.findByGroup(groupId);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearAll() {
        timetableService.clearAll();
        return ResponseEntity.noContent().build();
    }
}
