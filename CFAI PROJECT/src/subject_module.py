# src/subject_module.py

# =========================================================
# Topic Used:
# CO2 - Linear Search (subject selection by number)
# CO3 - Set used to prevent duplicate subject selection
# =========================================================

from src.data import SUBJECT_CATALOG
from src.student_module import get_int


def collect_subjects():

    print("\n===== SUBJECT SELECTION =====")
    print("  Select 3 to 6 subjects.\n")

    print(f"  {'No.':<5} {'Code':<8} {'Subject':<30} {'Hrs'}")
    print("  " + "-" * 50)

    for k, s in SUBJECT_CATALOG.items():
        print(f"  [{k:>2}]  {s['code']:<8} {s['name']:<30} {s['hrs']} hrs")

    print()

    selected = []   # CO3 - List to store selected subject IDs

    while True:

        if selected:
            codes = [SUBJECT_CATALOG[i]['code'] for i in selected]
            print(f"  Selected: {', '.join(codes)}")

        choice = get_int("Subject number (0 to finish): ", 0, 10)

        if choice == 0:
            if len(selected) < 3:
                print("  [!] Select at least 3 subjects.")
                continue
            break

        if choice not in SUBJECT_CATALOG:
            print("  [!] Invalid number.")
            continue

        if choice in selected:   # CO3 - Duplicate check
            print("  [!] Already selected.")
            continue

        if len(selected) >= 6:
            print("  [!] Maximum 6 subjects. Enter 0 to finish.")
            continue

        selected.append(choice)
        print(f"  [OK] Added: {SUBJECT_CATALOG[choice]['name']}")

    return selected


# =========================================================
# Topic Used:
# CO2 - Indexed Selection (teacher chosen by index from list)
# =========================================================

def assign_teachers(selected_ids):

    print("\n===== TEACHER ASSIGNMENT =====")

    subjects = []

    for sid in selected_ids:

        subj = SUBJECT_CATALOG[sid]

        print(f"\n  Subject : {subj['name']}")
        print("  " + "-" * 40)

        for t in subj['teachers']:
            print(f"  [{t['id']}]  {t['name']:<14}  ({t['spec']})")

        choice = get_int(f"  Select teacher for {subj['code']} [1-5]: ", 1, 5)

        picked = subj['teachers'][choice - 1]

        print(f"  [OK] {picked['name']} assigned to {subj['code']}")

        subjects.append({
            "code": subj['code'],
            "name": subj['name'],
            "hrs":  subj['hrs'],
            "teacher": picked['name'],
            "spec": picked['spec']
        })

    return subjects