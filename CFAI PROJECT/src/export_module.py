# src/export_module.py

# =========================================================
# Topic Used:
# CO6 - File Handling (write timetable to CSV file)
# =========================================================

import csv, os
from src.data import DAYS, TIME_SLOTS, LUNCH_SLOT


def export_csv(timetable, student, subjects):

    os.makedirs("output", exist_ok=True)

    filename = f"output/timetable_{student['roll']}.csv"

    with open(filename, "w", newline="") as f:

        w = csv.writer(f)

        w.writerow(["Name", f"{student['first']} {student['last']}",
                    "Roll", student['roll'], "Year", student['year']])
        w.writerow([])
        w.writerow(["Time"] + DAYS)

        for slot in TIME_SLOTS:

            row = [slot]

            for day in DAYS:

                cell = timetable[day][slot]

                if slot == LUNCH_SLOT:
                    row.append("LUNCH")
                elif cell is None:
                    row.append("FREE")
                else:
                    row.append(f"{cell['code']} [{cell['teacher']}]")

            w.writerow(row)

    print(f"  [OK] Saved -> {filename}")