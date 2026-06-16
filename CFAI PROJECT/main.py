
# bin/main.py

# =========================================================
# Topic Used:
# CO6 - System Integration / Main Menu using do-while loop
# All modules connected here
# Run: python bin/main.py
# =========================================================

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.student_module   import collect_student
from src.subject_module   import collect_subjects, assign_teachers
from src.scheduler_module import generate_timetable
from src.display_module   import show_summary, show_timetable
from src.export_module    import export_csv


def main():

    print("\n===== TIMETABLE MANAGEMENT SYSTEM =====")

    # Step 1 - Student Info
    student = collect_student()

    # Step 2 - Subject Selection
    selected_ids = collect_subjects()

    # Step 3 - Teacher Assignment
    subjects = assign_teachers(selected_ids)

    # Step 4 - Review
    show_summary(student, subjects)

    confirm = input("\n  > Generate Timetable? (y/n): ").strip().lower()
    if confirm != 'y':
        print("  Restarting...")
        main()
        return

    # Step 5 - Generate
    timetable = generate_timetable(subjects)

    # Step 6 - Display
    show_timetable(timetable, subjects, student)

    # Step 7 - Export
    save = input("\n  > Save to CSV? (y/n): ").strip().lower()
    if save == 'y':
        export_csv(timetable, student, subjects)

    print("\n  Program Ended.")


if __name__ == "__main__":
    main()