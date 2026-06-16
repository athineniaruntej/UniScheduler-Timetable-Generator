package com.unischeduler.csp;

import com.unischeduler.model.*;
import java.util.*;
import java.util.stream.Collectors;

/**
 * CSP Solver for University Timetable Generation.
 *
 * Uses:
 *   - Backtracking Search
 *   - MRV (Minimum Remaining Values) heuristic for variable ordering
 *   - Forward Checking for constraint propagation
 *   - Hard constraint validation (faculty, room, group, capacity)
 */
public class CSPSolver {

    // ==================== DATA STRUCTURES ====================

    /** A lecture variable: one session of a course */
    public static class Variable {
        public final String key;           // e.g. "C101_1"
        public final Course course;
        public final int sessionIndex;

        public Variable(String key, Course course, int sessionIndex) {
            this.key = key;
            this.course = course;
            this.sessionIndex = sessionIndex;
        }

        @Override public String toString() { return key; }
    }

    /** A value in the domain: (day, timeSlot, room) */
    public static class Assignment {
        public final String day;
        public final int slotIndex;
        public final Room room;

        public Assignment(String day, int slotIndex, Room room) {
            this.day = day;
            this.slotIndex = slotIndex;
            this.room = room;
        }

        @Override public String toString() {
            return day + " Slot" + slotIndex + " " + room.getRoomId();
        }
    }

    /** Result of the solve() call */
    public static class SolveResult {
        public final boolean success;
        public final Map<String, Assignment> assignments; // variable.key → Assignment
        public final int backtracks;
        public final int nodesExplored;
        public final List<String> log;

        public SolveResult(boolean success, Map<String, Assignment> assignments,
                           int backtracks, int nodesExplored, List<String> log) {
            this.success = success;
            this.assignments = assignments;
            this.backtracks = backtracks;
            this.nodesExplored = nodesExplored;
            this.log = log;
        }
    }

    // ==================== SOLVER STATE ====================

    private final List<Course> courses;
    private final List<Room> rooms;
    private final List<String> days;
    private final int slotsPerDay;
    private final boolean avoidLateSessions;
    private final boolean forwardChecking;

    private int backtracks = 0;
    private int nodesExplored = 0;
    private final List<String> log = new ArrayList<>();

    private List<Variable> allVariables;
    private List<Assignment> fullDomain;

    public CSPSolver(List<Course> courses, List<Room> rooms, List<String> days,
                     int slotsPerDay, boolean avoidLateSessions, boolean forwardChecking) {
        this.courses = courses;
        this.rooms = rooms;
        this.days = days;
        this.slotsPerDay = slotsPerDay;
        this.avoidLateSessions = avoidLateSessions;
        this.forwardChecking = forwardChecking;
    }

    // ==================== PUBLIC SOLVE ====================

    public SolveResult solve() {
        log("=== CSP Solver Initialized ===");
        log("Courses: " + courses.size() + " | Rooms: " + rooms.size() +
            " | Days: " + days + " | Slots: " + slotsPerDay);

        // Step 1 – Build variables
        allVariables = buildVariables();
        log("Variables: " + allVariables.size() + " lecture sessions");

        // Step 2 – Build full domain
        fullDomain = buildDomain();
        log("Domain per variable: up to " + fullDomain.size() + " (day, slot, room) triples");

        // Step 3 – Backtracking
        log("Starting backtracking search with MRV heuristic...");
        Map<String, Assignment> partialAssignment = new LinkedHashMap<>();
        boolean solved = backtrack(allVariables, partialAssignment);

        if (!solved) {
            log("WARNING: Could not fully schedule. Applying greedy fallback...");
            greedyFallback(allVariables, partialAssignment);
        }

        int assigned = partialAssignment.size();
        log("Assigned " + assigned + "/" + allVariables.size() + " sessions");
        log("Backtracks: " + backtracks + " | Nodes explored: " + nodesExplored);
        return new SolveResult(solved || assigned == allVariables.size(), partialAssignment,
                               backtracks, nodesExplored, log);
    }

    // ==================== BACKTRACKING ====================

    private boolean backtrack(List<Variable> unassigned, Map<String, Assignment> assignment) {
        if (unassigned.isEmpty()) return true;
        nodesExplored++;

        // MRV: pick variable with fewest valid assignments
        Variable variable = selectByMRV(unassigned, assignment);
        List<Variable> rest = new ArrayList<>(unassigned);
        rest.remove(variable);

        List<Assignment> domain = getValidAssignments(variable, assignment);
        log("  [MRV] " + variable.key + ": " + domain.size() + " values remaining");

        for (Assignment value : domain) {
            assignment.put(variable.key, value);

            // Forward checking: prune domains of future variables
            boolean consistent = true;
            if (forwardChecking) {
                consistent = forwardCheck(rest, assignment);
            }

            if (consistent && backtrack(rest, assignment)) return true;

            assignment.remove(variable.key);
            backtracks++;
        }
        return false;
    }

    // ==================== MRV HEURISTIC ====================

    private Variable selectByMRV(List<Variable> unassigned, Map<String, Assignment> assignment) {
        Variable best = null;
        int minRemaining = Integer.MAX_VALUE;
        for (Variable v : unassigned) {
            int remaining = getValidAssignments(v, assignment).size();
            if (remaining < minRemaining) {
                minRemaining = remaining;
                best = v;
            }
        }
        return best != null ? best : unassigned.get(0);
    }

    // ==================== FORWARD CHECKING ====================

    private boolean forwardCheck(List<Variable> unassigned, Map<String, Assignment> assignment) {
        for (Variable v : unassigned) {
            if (getValidAssignments(v, assignment).isEmpty()) {
                return false; // Domain wipe-out — prune this branch
            }
        }
        return true;
    }

    // ==================== CONSTRAINT CHECKING ====================

    private List<Assignment> getValidAssignments(Variable variable, Map<String, Assignment> assignment) {
        Course course = variable.course;
        int groupStrength = course.getStudentGroup() != null ? course.getStudentGroup().getStrength() : 0;

        return fullDomain.stream()
            .filter(slot -> {
                // Capacity constraint
                if (slot.room.getCapacity() < groupStrength) return false;
                // Soft: avoid last slot of day
                if (avoidLateSessions && slot.slotIndex == slotsPerDay - 1) return false;
                // Check hard constraints against all current assignments
                for (Map.Entry<String, Assignment> entry : assignment.entrySet()) {
                    Assignment other = entry.getValue();
                    if (!other.day.equals(slot.day) || other.slotIndex != slot.slotIndex) continue;
                    Variable otherVar = allVariables.stream()
                        .filter(v -> v.key.equals(entry.getKey())).findFirst().orElse(null);
                    if (otherVar == null) continue;
                    Course otherCourse = otherVar.course;
                    // Faculty conflict
                    if (otherCourse.getFaculty() != null && course.getFaculty() != null &&
                        otherCourse.getFaculty().getFacultyId().equals(course.getFaculty().getFacultyId()))
                        return false;
                    // Room conflict
                    if (other.room.getRoomId().equals(slot.room.getRoomId())) return false;
                    // Student group conflict
                    if (otherCourse.getStudentGroup() != null && course.getStudentGroup() != null &&
                        otherCourse.getStudentGroup().getGroupId().equals(course.getStudentGroup().getGroupId()))
                        return false;
                }
                return true;
            })
            .collect(Collectors.toList());
    }

    // ==================== GREEDY FALLBACK ====================

    private void greedyFallback(List<Variable> variables, Map<String, Assignment> assignment) {
        for (Variable v : variables) {
            if (assignment.containsKey(v.key)) continue;
            List<Assignment> valid = getValidAssignments(v, assignment);
            if (!valid.isEmpty()) {
                assignment.put(v.key, valid.get(0));
                log("  [Greedy] " + v.key + " → " + valid.get(0));
            } else {
                log("  [Greedy] FAILED: " + v.key + " — no valid slot found");
            }
        }
    }

    // ==================== BUILDERS ====================

    private List<Variable> buildVariables() {
        List<Variable> vars = new ArrayList<>();
        for (Course c : courses) {
            for (int i = 1; i <= c.getWeeklyClasses(); i++) {
                vars.add(new Variable(c.getCourseId() + "_" + i, c, i));
            }
        }
        return vars;
    }

    private List<Assignment> buildDomain() {
        List<Assignment> domain = new ArrayList<>();
        for (String day : days) {
            for (int slot = 0; slot < slotsPerDay; slot++) {
                for (Room room : rooms) {
                    domain.add(new Assignment(day, slot, room));
                }
            }
        }
        return domain;
    }

    private void log(String msg) { log.add(msg); }
}
