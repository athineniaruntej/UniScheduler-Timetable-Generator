# src/data.py

TIME_SLOTS = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-01:00",  # LUNCH
    "01:00-02:00", "02:00-03:00", "03:00-04:00", "04:00-05:00"
]

LUNCH_SLOT = "12:00-01:00"

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

ROOMS = ["Room 101", "Room 102", "Lab A", "Lab B", "Seminar Hall"]

SUBJECT_CATALOG = {
    1: {
        "name": "AI & Machine Learning", "code": "AIML", "hrs": 4,
        "teachers": [
            {"id": 1, "name": "Raju",   "spec": "Deep Learning"},
            {"id": 2, "name": "Ravi",   "spec": "ML Algorithms"},
            {"id": 3, "name": "Ramu",   "spec": "Computer Vision"},
            {"id": 4, "name": "Raku",   "spec": "Reinforcement Learning"},
            {"id": 5, "name": "Ramesh", "spec": "Applied AI"}
        ]
    },
    2: {
        "name": "Data Structures", "code": "DSA", "hrs": 4,
        "teachers": [
            {"id": 1, "name": "Suresh", "spec": "Graph Algorithms"},
            {"id": 2, "name": "Satish", "spec": "Dynamic Programming"},
            {"id": 3, "name": "Sanjay", "spec": "Sorting & Searching"},
            {"id": 4, "name": "Sunil",  "spec": "Complexity Analysis"},
            {"id": 5, "name": "Sameer", "spec": "Competitive Programming"}
        ]
    },
    3: {
        "name": "Database Management", "code": "DBMS", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Priya",    "spec": "SQL"},
            {"id": 2, "name": "Pooja",    "spec": "NoSQL"},
            {"id": 3, "name": "Pavani",   "spec": "DB Design"},
            {"id": 4, "name": "Padma",    "spec": "Data Warehousing"},
            {"id": 5, "name": "Parvathi", "spec": "Distributed DB"}
        ]
    },
    4: {
        "name": "Operating Systems", "code": "OS", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Kiran",   "spec": "Process Scheduling"},
            {"id": 2, "name": "Krishna", "spec": "Memory Management"},
            {"id": 3, "name": "Kartik",  "spec": "File Systems"},
            {"id": 4, "name": "Kamal",   "spec": "Linux"},
            {"id": 5, "name": "Karthik", "spec": "Distributed OS"}
        ]
    },
    5: {
        "name": "Computer Networks", "code": "CN", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Venkat", "spec": "TCP/IP"},
            {"id": 2, "name": "Vijay",  "spec": "Network Security"},
            {"id": 3, "name": "Venu",   "spec": "Wireless Networks"},
            {"id": 4, "name": "Varun",  "spec": "Cloud Networking"},
            {"id": 5, "name": "Vikram", "spec": "SDN"}
        ]
    },
    6: {
        "name": "Software Engineering", "code": "SE", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Anjali",   "spec": "Agile"},
            {"id": 2, "name": "Asha",     "spec": "Testing"},
            {"id": 3, "name": "Arun",     "spec": "DevOps"},
            {"id": 4, "name": "Abhishek", "spec": "UML"},
            {"id": 5, "name": "Arjun",    "spec": "Project Management"}
        ]
    },
    7: {
        "name": "Web Technologies", "code": "WT", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Neha",    "spec": "React"},
            {"id": 2, "name": "Nisha",   "spec": "Node.js"},
            {"id": 3, "name": "Nikhil",  "spec": "Full Stack"},
            {"id": 4, "name": "Naveen",  "spec": "Cloud"},
            {"id": 5, "name": "Nandini", "spec": "UI/UX"}
        ]
    },
    8: {
        "name": "Cyber Security", "code": "CS", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Gopal",   "spec": "Encryption"},
            {"id": 2, "name": "Ganesh",  "spec": "PKI"},
            {"id": 3, "name": "Girish",  "spec": "Network Defense"},
            {"id": 4, "name": "Goutham", "spec": "Blockchain"},
            {"id": 5, "name": "Govind",  "spec": "Ethical Hacking"}
        ]
    },
    9: {
        "name": "Cloud Computing", "code": "CC", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Harish",  "spec": "AWS"},
            {"id": 2, "name": "Hemanth", "spec": "Azure"},
            {"id": 3, "name": "Hari",    "spec": "Google Cloud"},
            {"id": 4, "name": "Harsha",  "spec": "Kubernetes"},
            {"id": 5, "name": "Hariom",  "spec": "Serverless"}
        ]
    },
    10: {
        "name": "Internet of Things", "code": "IOT", "hrs": 3,
        "teachers": [
            {"id": 1, "name": "Mahesh",  "spec": "Embedded Systems"},
            {"id": 2, "name": "Manohar", "spec": "IoT Protocols"},
            {"id": 3, "name": "Mohan",   "spec": "Edge Computing"},
            {"id": 4, "name": "Murali",  "spec": "Industrial IoT"},
            {"id": 5, "name": "Madhu",   "spec": "IoT Security"}
        ]
    }
}

YEARS     = {1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year"}
SEMESTERS = {1: "Semester 1", 2: "Semester 2"}
BRANCHES  = {1: "CSE", 2: "IT", 3: "ECE", 4: "EEE", 5: "MECH", 6: "CIVIL"}
SECTIONS  = ["A", "B", "C", "D"]