package com.unischeduler.service;

import com.unischeduler.csp.CSPSolver;
import com.unischeduler.model.*;
import com.unischeduler.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class FacultyService {
    @Autowired FacultyRepository repo;
    public List<Faculty> findAll() { return repo.findAll(); }
    public Faculty save(Faculty f) { return repo.save(f); }
    public void deleteById(String id) { repo.deleteById(id); }
}

@Service
class CourseService {
    @Autowired CourseRepository repo;
    public List<Course> findAll() { return repo.findAll(); }
    public Course save(Course c) { return repo.save(c); }
    public void deleteById(String id) { repo.deleteById(id); }
}

@Service
class RoomService {
    @Autowired RoomRepository repo;
    public List<Room> findAll() { return repo.findAll(); }
    public Room save(Room r) { return repo.save(r); }
    public void deleteById(String id) { repo.deleteById(id); }
}

@Service
class StudentGroupService {
    @Autowired StudentGroupRepository repo;
    public List<StudentGroup> findAll() { return repo.findAll(); }
    public StudentGroup save(StudentGroup g) { return repo.save(g); }
    public void deleteById(String id) { repo.deleteById(id); }
}

@Service
class TimetableService {
    @Autowired TimetableRepository repo;
    @Autowired CourseRepository courseRepo;
    @Autowired RoomRepository roomRepo;

    private final String[] TIME_LABELS = {
        "9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM"
    };

    public List<TimetableEntry> findAll() { return repo.findAll(); }

    public List<TimetableEntry> findByFaculty(String facultyId) {
        return repo.findByCourse_Faculty_FacultyId(facultyId);
    }

    public List<TimetableEntry> findByRoom(String roomId) {
        return repo.findByRoom_RoomId(roomId);
    }

    public List<TimetableEntry> findByGroup(String groupId) {
        return repo.findByCourse_StudentGroup_GroupId(groupId);
    }

    public void clearAll() { repo.deleteAll(); }

    public List<TimetableEntry> saveFromResult(CSPSolver.SolveResult result,
                                                List<Course> courses, List<Room> rooms) {
        repo.deleteAll();
        List<TimetableEntry> entries = new ArrayList<>();
        for (Map.Entry<String, CSPSolver.Assignment> e : result.assignments.entrySet()) {
            String courseId = e.getKey().substring(0, e.getKey().lastIndexOf('_'));
            CSPSolver.Assignment assignment = e.getValue();
            Course course = courses.stream().filter(c -> c.getCourseId().equals(courseId))
                .findFirst().orElse(null);
            Room room = rooms.stream().filter(r -> r.getRoomId().equals(assignment.room.getRoomId()))
                .findFirst().orElse(null);
            if (course == null || room == null) continue;
            String timeLabel = assignment.slotIndex < TIME_LABELS.length
                ? TIME_LABELS[assignment.slotIndex] : "Slot " + assignment.slotIndex;
            TimetableEntry entry = new TimetableEntry(course, room, assignment.day,
                assignment.slotIndex, timeLabel);
            entries.add(repo.save(entry));
        }
        return entries;
    }
}
