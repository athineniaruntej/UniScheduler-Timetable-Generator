package com.unischeduler.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "faculty")
public class Faculty {

    @Id
    @Column(name = "faculty_id", length = 10)
    private String facultyId;

    @Column(name = "faculty_name", nullable = false)
    private String facultyName;

    @Column(name = "department")
    private String department;

    @OneToMany(mappedBy = "faculty", fetch = FetchType.LAZY)
    private List<Course> courses;

    public Faculty() {}

    public Faculty(String facultyId, String facultyName, String department) {
        this.facultyId = facultyId;
        this.facultyName = facultyName;
        this.department = department;
    }

    public String getFacultyId() { return facultyId; }
    public void setFacultyId(String facultyId) { this.facultyId = facultyId; }
    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public List<Course> getCourses() { return courses; }
}
