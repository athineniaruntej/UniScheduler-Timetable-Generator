# src/student_module.py

# =========================================================
# Topic Used:
# CO1 - Data Representation using Dictionary
# Collect and store student details
# =========================================================

from src.data import YEARS, SEMESTERS, BRANCHES, SECTIONS


def get_input(prompt):
    while True:
        v = input("  > " + prompt).strip()
        if v:
            return v
        print("  [!] Cannot be empty.")


def get_int(prompt, low, high):
    while True:
        try:
            v = int(input("  > " + prompt).strip())
            if low <= v <= high:
                return v
            print(f"  [!] Enter between {low} and {high}.")
        except ValueError:
            print("  [!] Enter a valid number.")


def collect_student():

    print("\n===== STUDENT INFORMATION =====")

    first = get_input("First Name  : ")
    last  = get_input("Last Name   : ")
    roll  = get_input("Roll Number : ")

    print("\n  Year Options:")
    for k, v in YEARS.items():
        print(f"  [{k}] {v}")
    year = get_int("Select Year [1-4]: ", 1, 4)

    print("\n  Semester Options:")
    for k, v in SEMESTERS.items():
        print(f"  [{k}] {v}")
    sem = get_int("Select Semester [1-2]: ", 1, 2)

    print("\n  Branch Options:")
    for k, v in BRANCHES.items():
        print(f"  [{k}] {v}")
    branch = get_int("Select Branch [1-6]: ", 1, 6)

    print("\n  Section Options:")
    for i, s in enumerate(SECTIONS, 1):
        print(f"  [{i}] Section {s}")
    sec = get_int(f"Select Section [1-{len(SECTIONS)}]: ", 1, len(SECTIONS))

    print("  [OK] Student profile created.")

    return {
        "first": first, "last": last, "roll": roll,
        "year": YEARS[year], "sem": SEMESTERS[sem],
        "branch": BRANCHES[branch], "section": SECTIONS[sec - 1]
    }