# src/display_module.py

# =========================================================
# Topic Used:
# CO1 - 2D Array / Grid Representation
# Display timetable as a formatted table in terminal
# =========================================================

from src.data import DAYS, TIME_SLOTS, LUNCH_SLOT


def show_summary(student, subjects):

    print("\n===== REVIEW DETAILS =====")
    print(f"  Name     : {student['first']} {student['last']}")
    print(f"  Roll No  : {student['roll']}")
    print(f"  Year     : {student['year']}")
    print(f"  Semester : {student['sem']}")
    print(f"  Branch   : {student['branch']}")
    print(f"  Section  : {student['section']}")

    print(f"\n  {'Code':<8} {'Subject':<30} {'Teacher'}")
    print("  " + "-" * 50)

    for s in subjects:
        print(f"  {s['code']:<8} {s['name']:<30} {s['teacher']}")


def show_timetable(timetable, subjects, student):

    CW = 14   # cell width
    TW = 14   # time column width

    print("\n===== WEEKLY TIMETABLE =====")
    print(f"  {student['first']} {student['last']} | {student['roll']} | {student['year']} | Sec {student['section']}\n")

    # header
    print("  +" + "-" * TW + "+" + ("-" * CW + "+") * len(DAYS))
    header = f"  |{'TIME':^{TW}}|"
    for d in DAYS:
        header += f"{d[:3].upper():^{CW}}|"
    print(header)
    print("  +" + "=" * TW + "+" + ("=" * CW + "+") * len(DAYS))

    # rows
    for slot in TIME_SLOTS:

        row1 = f"  |{slot:^{TW}}|"
        row2 = f"  |{' ' * TW}|"

        for day in DAYS:

            cell = timetable[day][slot]

            if slot == LUNCH_SLOT:
                row1 += f"{'LUNCH BREAK':^{CW}}|"
                row2 += f"{' ':^{CW}}|"

            elif cell is None:
                row1 += f"{'FREE':^{CW}}|"
                row2 += f"{' ':^{CW}}|"

            else:
                row1 += f"{'[' + cell['code'] + ']':^{CW}}|"
                row2 += f"{cell['teacher'][:CW]:^{CW}}|"

        print(row1)
        print(row2)
        print("  +" + "-" * TW + "+" + ("-" * CW + "+") * len(DAYS))

    # legend
    print("\n  LEGEND:")
    for s in subjects:
        print(f"  [{s['code']}]  {s['name']}  ->  {s['teacher']}")
    print("  [FREE] Free Slot   [LUNCH BREAK] Lunch 12-1pm")