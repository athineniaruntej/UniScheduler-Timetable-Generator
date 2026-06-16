# src/scheduler_module.py

# =========================================================
# Topic Used:
# CO3 - Greedy Algorithm (assign sessions to first valid slot)
# CO4 - Constraint Satisfaction (no same subject twice per day)
# CO5 - Set used for O(1) constraint checking
# =========================================================

import random
from src.data import DAYS, TIME_SLOTS, LUNCH_SLOT, ROOMS


def generate_timetable(subjects):

    print("\n===== GENERATING TIMETABLE =====")

    # initialize empty grid
    timetable = {}
    for day in DAYS:
        timetable[day] = {}
        for slot in TIME_SLOTS:
            timetable[day][slot] = None

    # all slots except lunch
    teach_slots = [s for s in TIME_SLOTS if s != LUNCH_SLOT]

    # build session pool
    sessions = []
    for s in subjects:
        for _ in range(s['hrs']):
            sessions.append({"code": s['code'], "name": s['name'], "teacher": s['teacher']})

    random.shuffle(sessions)

    # all day-slot pairs
    all_pairs = [(d, sl) for d in DAYS for sl in teach_slots]
    random.shuffle(all_pairs)

    used_pairs   = set()                      # CO5 - Set for O(1) lookup
    day_subjects = {d: set() for d in DAYS}  # CO4 - Constraint tracker

    for session in sessions:

        for (day, slot) in all_pairs:

            if (day, slot) in used_pairs:         # slot already taken
                continue

            if session['code'] in day_subjects[day]:  # CO4 - same subject already today
                continue

            timetable[day][slot] = {
                "code":    session['code'],
                "name":    session['name'],
                "teacher": session['teacher'],
                "room":    random.choice(ROOMS)
            }

            used_pairs.add((day, slot))
            day_subjects[day].add(session['code'])
            break

    print("  [OK] Timetable Generated.")
    return timetable