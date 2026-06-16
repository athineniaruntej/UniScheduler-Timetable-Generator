// ==================== DATA STORE ====================
let db = {
  faculty: [
    { id: 'F1', name: 'Dr. Rao', dept: 'Computer Science' },
    { id: 'F2', name: 'Dr. Kumar', dept: 'Computer Science' },
    { id: 'F3', name: 'Dr. Sharma', dept: 'Mathematics' },
    { id: 'F4', name: 'Dr. Patel', dept: 'Computer Science' },
  ],
  courses: [
    { id: 'C101', name: 'DBMS', faculty: 'F1', group: 'CSE-A', weekly: 3 },
    { id: 'C102', name: 'Java Programming', faculty: 'F2', group: 'CSE-A', weekly: 4 },
    { id: 'C103', name: 'Mathematics', faculty: 'F3', group: 'CSE-B', weekly: 3 },
    { id: 'C104', name: 'Operating Systems', faculty: 'F4', group: 'CSE-B', weekly: 3 },
    { id: 'C105', name: 'Computer Networks', faculty: 'F1', group: 'CSE-A', weekly: 2 },
  ],
  rooms: [
    { id: 'R101', capacity: 60, type: 'Lecture Hall' },
    { id: 'R102', capacity: 40, type: 'Lecture Hall' },
    { id: 'R103', capacity: 30, type: 'Seminar Room' },
    { id: 'R104', capacity: 80, type: 'Lecture Hall' },
  ],
  groups: [
    { id: 'CSE-A', name: 'CSE-A 2024', strength: 55, dept: 'Computer Science' },
    { id: 'CSE-B', name: 'CSE-B 2024', strength: 45, dept: 'Computer Science' },
  ],
  timetable: null
};

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const COURSE_COLORS = ['cell-blue','cell-green','cell-purple','cell-orange','cell-red','cell-teal','cell-pink'];
let courseColorMap = {};

// ==================== NAVIGATION ====================
document.querySelectorAll('.nav-item').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const page = a.dataset.page;
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    document.getElementById('page-' + page).classList.add('active');
    if (page === 'dashboard') renderDashboard();
    if (page === 'faculty') renderFacultyTable();
    if (page === 'courses') renderCoursesTable();
    if (page === 'rooms') renderRoomsTable();
    if (page === 'groups') renderGroupsTable();
    if (page === 'timetable') renderTimetable();
    if (page === 'csp') initCSPVisualizer();
  });
});

// ==================== MODALS ====================
function openModal(id) {
  if (id === 'course-modal') populateCourseModal();
  document.getElementById(id).classList.add('open');
}
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function closeModalOutside(e, id) { if (e.target.id === id) closeModal(id); }

function populateCourseModal() {
  const fSel = document.getElementById('c-faculty');
  fSel.innerHTML = db.faculty.map(f => `<option value="${f.id}">${f.id} - ${f.name}</option>`).join('');
  const gSel = document.getElementById('c-group');
  gSel.innerHTML = db.groups.map(g => `<option value="${g.id}">${g.id}</option>`).join('');
}

// ==================== CRUD ====================
function addFaculty() {
  const id = document.getElementById('f-id').value.trim();
  const name = document.getElementById('f-name').value.trim();
  const dept = document.getElementById('f-dept').value;
  if (!id || !name) return toast('Please fill all fields');
  if (db.faculty.find(f => f.id === id)) return toast('Faculty ID already exists');
  db.faculty.push({ id, name, dept });
  closeModal('faculty-modal');
  renderFacultyTable();
  renderDashboard();
  toast('Faculty added successfully');
  document.getElementById('f-id').value = '';
  document.getElementById('f-name').value = '';
}

function deleteFaculty(id) {
  db.faculty = db.faculty.filter(f => f.id !== id);
  renderFacultyTable();
  renderDashboard();
  toast('Faculty removed');
}

function addCourse() {
  const id = document.getElementById('c-id').value.trim();
  const name = document.getElementById('c-name').value.trim();
  const faculty = document.getElementById('c-faculty').value;
  const group = document.getElementById('c-group').value;
  const weekly = parseInt(document.getElementById('c-weekly').value);
  if (!id || !name) return toast('Please fill all fields');
  if (db.courses.find(c => c.id === id)) return toast('Course ID already exists');
  db.courses.push({ id, name, faculty, group, weekly });
  closeModal('course-modal');
  renderCoursesTable();
  renderDashboard();
  toast('Course added successfully');
  document.getElementById('c-id').value = '';
  document.getElementById('c-name').value = '';
}

function deleteCourse(id) {
  db.courses = db.courses.filter(c => c.id !== id);
  renderCoursesTable();
  renderDashboard();
  toast('Course removed');
}

function addRoom() {
  const id = document.getElementById('r-id').value.trim();
  const capacity = parseInt(document.getElementById('r-cap').value);
  const type = document.getElementById('r-type').value;
  if (!id || !capacity) return toast('Please fill all fields');
  if (db.rooms.find(r => r.id === id)) return toast('Room ID already exists');
  db.rooms.push({ id, capacity, type });
  closeModal('room-modal');
  renderRoomsTable();
  toast('Room added successfully');
  document.getElementById('r-id').value = '';
  document.getElementById('r-cap').value = '';
}

function deleteRoom(id) {
  db.rooms = db.rooms.filter(r => r.id !== id);
  renderRoomsTable();
  toast('Room removed');
}

function addGroup() {
  const id = document.getElementById('g-id').value.trim();
  const name = document.getElementById('g-name').value.trim();
  const strength = parseInt(document.getElementById('g-strength').value);
  const dept = document.getElementById('g-dept').value;
  if (!id || !name || !strength) return toast('Please fill all fields');
  if (db.groups.find(g => g.id === id)) return toast('Group ID already exists');
  db.groups.push({ id, name, strength, dept });
  closeModal('group-modal');
  renderGroupsTable();
  renderDashboard();
  toast('Student group added');
  document.getElementById('g-id').value = '';
  document.getElementById('g-name').value = '';
  document.getElementById('g-strength').value = '';
}

function deleteGroup(id) {
  db.groups = db.groups.filter(g => g.id !== id);
  renderGroupsTable();
  renderDashboard();
  toast('Group removed');
}

// ==================== RENDER TABLES ====================
function getFacultyName(id) {
  const f = db.faculty.find(f => f.id === id);
  return f ? f.name : id;
}

function renderFacultyTable() {
  const tbody = document.getElementById('faculty-table-body');
  if (!tbody) return;
  tbody.innerHTML = db.faculty.map(f => {
    const courseCount = db.courses.filter(c => c.faculty === f.id).length;
    return `<tr>
      <td><span class="id-badge" style="background:#e8eef8;color:#2a52a0;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600">${f.id}</span></td>
      <td><strong>${f.name}</strong></td>
      <td>${f.dept}</td>
      <td>${courseCount} course${courseCount !== 1 ? 's' : ''}</td>
      <td><button class="btn-secondary btn-sm btn-danger" onclick="deleteFaculty('${f.id}')">Remove</button></td>
    </tr>`;
  }).join('');
}

function renderCoursesTable() {
  const tbody = document.getElementById('courses-table-body');
  if (!tbody) return;
  tbody.innerHTML = db.courses.map(c => {
    return `<tr>
      <td><span style="background:#e8eef8;color:#2a52a0;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600">${c.id}</span></td>
      <td><strong>${c.name}</strong></td>
      <td>${getFacultyName(c.faculty)}</td>
      <td><span style="background:#e8f4ed;color:#1a6e3c;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600">${c.weekly}/week</span></td>
      <td>${c.group}</td>
      <td><button class="btn-secondary btn-sm btn-danger" onclick="deleteCourse('${c.id}')">Remove</button></td>
    </tr>`;
  }).join('');
}

function renderRoomsTable() {
  const tbody = document.getElementById('rooms-table-body');
  if (!tbody) return;
  tbody.innerHTML = db.rooms.map(r => {
    return `<tr>
      <td><span style="background:#e8eef8;color:#2a52a0;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600">${r.id}</span></td>
      <td>${r.capacity} students</td>
      <td><span style="background:#e8f4ed;color:#1a6e3c;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600">Available</span></td>
      <td><button class="btn-secondary btn-sm btn-danger" onclick="deleteRoom('${r.id}')">Remove</button></td>
    </tr>`;
  }).join('');
}

function renderGroupsTable() {
  const tbody = document.getElementById('groups-table-body');
  if (!tbody) return;
  tbody.innerHTML = db.groups.map(g => {
    return `<tr>
      <td><span style="background:#e8eef8;color:#2a52a0;padding:2px 7px;border-radius:4px;font-size:11px;font-weight:600">${g.id}</span></td>
      <td><strong>${g.name}</strong></td>
      <td>${g.strength}</td>
      <td>${g.dept}</td>
      <td><button class="btn-secondary btn-sm btn-danger" onclick="deleteGroup('${g.id}')">Remove</button></td>
    </tr>`;
  }).join('');
}

// ==================== DASHBOARD ====================
function renderDashboard() {
  const sg = document.getElementById('stats-grid');
  if (!sg) return;
  const totalClasses = db.courses.reduce((a, c) => a + c.weekly, 0);
  sg.innerHTML = `
    <div class="stat-card"><div class="stat-label">Faculty Members</div><div class="stat-val">${db.faculty.length}</div><div class="stat-badge badge-blue">Active</div></div>
    <div class="stat-card"><div class="stat-label">Total Courses</div><div class="stat-val">${db.courses.length}</div><div class="stat-badge badge-blue">Registered</div></div>
    <div class="stat-card"><div class="stat-label">Rooms Available</div><div class="stat-val">${db.rooms.length}</div><div class="stat-badge badge-green">Open</div></div>
    <div class="stat-card"><div class="stat-label">Weekly Classes</div><div class="stat-val">${totalClasses}</div><div class="stat-badge badge-orange">Pending</div></div>
  `;

  const fl = document.getElementById('dash-faculty-list');
  if (fl) {
    fl.innerHTML = db.faculty.slice(0, 4).map(f => `
      <div class="dash-list-item">
        <div><strong>${f.name}</strong><div style="font-size:11.5px;color:#8a8880;margin-top:2px">${f.dept}</div></div>
        <span class="id-badge">${f.id}</span>
      </div>`).join('');
  }

  const cl = document.getElementById('dash-courses-list');
  if (cl) {
    cl.innerHTML = db.courses.slice(0, 5).map(c => `
      <div class="dash-list-item">
        <div><strong>${c.name}</strong><div style="font-size:11.5px;color:#8a8880;margin-top:2px">${getFacultyName(c.faculty)} · ${c.group}</div></div>
        <span class="id-badge">${c.weekly}/wk</span>
      </div>`).join('');
  }

  const ss = document.getElementById('system-status');
  if (ss) {
    const hasTT = db.timetable ? 'generated' : 'not generated';
    ss.innerHTML = `
      <div class="status-item"><div class="status-dot dot-green2"></div>CSP Engine<span class="badge-tag badge-green" style="background:#e8f4ed;color:#1a6e3c">Ready</span></div>
      <div class="status-item"><div class="status-dot dot-green2"></div>Constraint Validator<span class="badge-tag badge-green" style="background:#e8f4ed;color:#1a6e3c">Online</span></div>
      <div class="status-item"><div class="status-dot ${db.timetable ? 'dot-green2' : 'dot-yellow'}"></div>Timetable<span class="badge-tag" style="background:${db.timetable ? '#e8f4ed' : '#fef3e2'};color:${db.timetable ? '#1a6e3c' : '#7a4e0a'}">${db.timetable ? 'Generated' : 'Not Generated'}</span></div>
      <div class="status-item"><div class="status-dot dot-green2"></div>MRV Heuristic<span class="badge-tag badge-green" style="background:#e8f4ed;color:#1a6e3c">Active</span></div>
    `;
  }
}

// ==================== CSP SOLVER ====================
async function generateTimetable() {
  const log = document.getElementById('solver-log');
  const progressSection = document.getElementById('progress-section');
  const progressBar = document.getElementById('progress-bar');
  const progressLabel = document.getElementById('progress-label');

  log.innerHTML = '';
  progressSection.style.display = 'block';
  progressBar.style.width = '0%';

  const addLog = (msg, type = 'neutral') => {
    const el = document.createElement('div');
    el.className = `log-entry log-${type}`;
    el.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
  };

  const setProgress = (pct) => {
    progressBar.style.width = pct + '%';
    progressLabel.textContent = Math.round(pct) + '%';
  };

  if (db.courses.length === 0) { addLog('ERROR: No courses found. Add courses first.', 'error'); return; }
  if (db.rooms.length === 0) { addLog('ERROR: No rooms found. Add rooms first.', 'error'); return; }
  if (db.faculty.length === 0) { addLog('ERROR: No faculty found. Add faculty first.', 'error'); return; }

  addLog('Initializing CSP Solver...', 'info');
  await delay(300);
  addLog(`Algorithm: ${document.getElementById('algo-select').value}`, 'neutral');
  await delay(200);

  // Build variables (lecture sessions)
  let variables = [];
  db.courses.forEach(course => {
    for (let i = 1; i <= course.weekly; i++) {
      variables.push({ key: `${course.id}_${i}`, course, session: i });
    }
  });

  addLog(`Variables (lecture sessions): ${variables.length}`, 'step');
  await delay(200);

  // Build domain
  const slotsCount = parseInt(document.getElementById('slots-select').value);
  const activeDays = Array.from(document.querySelectorAll('.day-checkboxes input:checked')).map(el => el.value);
  let domain = [];
  activeDays.forEach(day => {
    for (let t = 0; t < slotsCount; t++) {
      db.rooms.forEach(room => {
        domain.push({ day, slot: t, room: room.id });
      });
    }
  });

  addLog(`Domain size: ${domain.length} possible (day, slot, room) combinations`, 'step');
  addLog(`Days: ${activeDays.join(', ')} | Slots per day: ${slotsCount}`, 'neutral');
  await delay(300);
  setProgress(10);

  addLog('Applying MRV heuristic — ordering variables by fewest valid assignments...', 'info');
  await delay(400);

  // CSP Backtracking Solver
  const assignment = {};
  let backtracks = 0;
  let nodesExplored = 0;
  const softLate = document.getElementById('sc-late').checked;

  function getValidSlots(variable, assignment) {
    const course = variable.course;
    const group = db.groups.find(g => g.id === course.group);
    const groupStrength = group ? group.strength : 30;
    return domain.filter(slot => {
      // Room capacity constraint
      const room = db.rooms.find(r => r.id === slot.room);
      if (!room || room.capacity < groupStrength) return false;
      // Soft: avoid late slots
      if (softLate && slot.slot >= slotsCount - 1) return false;
      // Check all other assigned variables for conflicts
      for (const [key, assigned] of Object.entries(assignment)) {
        if (assigned.day !== slot.day || assigned.slot !== slot.slot) continue;
        // Find the course for this key
        const assignedCourse = variables.find(v => v.key === key)?.course;
        if (!assignedCourse) continue;
        // Faculty conflict
        if (assignedCourse.faculty === course.faculty) return false;
        // Room conflict
        if (assigned.room === slot.room) return false;
        // Student group conflict
        if (assignedCourse.group === course.group) return false;
      }
      return true;
    });
  }

  // MRV: sort variables by number of valid slots
  function mrvSort(remaining, assignment) {
    return [...remaining].sort((a, b) => {
      return getValidSlots(a, assignment).length - getValidSlots(b, assignment).length;
    });
  }

  function solve(remaining, assignment, depth) {
    if (remaining.length === 0) return true;
    nodesExplored++;
    const sorted = mrvSort(remaining, assignment);
    const variable = sorted[0];
    const rest = sorted.slice(1);
    const validSlots = getValidSlots(variable, assignment);
    for (const slot of validSlots) {
      assignment[variable.key] = slot;
      if (solve(rest, assignment, depth + 1)) return true;
      delete assignment[variable.key];
      backtracks++;
    }
    return false;
  }

  addLog('Starting backtracking search...', 'info');
  await delay(200);
  setProgress(20);

  // Simulate step-by-step logging
  const totalVars = variables.length;
  for (let i = 0; i < Math.min(5, totalVars); i++) {
    const v = variables[i];
    const valid = getValidSlots(v, {});
    addLog(`  → ${v.key}: ${valid.length} valid assignments in domain`, 'step');
    await delay(150);
    setProgress(20 + (i / totalVars) * 20);
  }

  addLog('Running solver (forward checking + backtracking)...', 'info');
  await delay(400);
  setProgress(50);

  const solved = solve(variables, assignment, 0);
  await delay(300);
  setProgress(80);

  if (!solved) {
    addLog('Solver could not find a complete solution. Relaxing soft constraints...', 'warning');
    await delay(400);
    // Relax and retry with greedy fallback
    variables.forEach(variable => {
      if (!assignment[variable.key]) {
        const course = variable.course;
        const group = db.groups.find(g => g.id === course.group);
        const groupStrength = group ? group.strength : 30;
        for (const slot of domain) {
          const room = db.rooms.find(r => r.id === slot.room);
          if (!room || room.capacity < groupStrength) continue;
          let conflict = false;
          for (const [key, assigned] of Object.entries(assignment)) {
            if (assigned.day !== slot.day || assigned.slot !== slot.slot) continue;
            const ac = variables.find(v => v.key === key)?.course;
            if (!ac) continue;
            if (ac.faculty === course.faculty || assigned.room === slot.room || ac.group === course.group) {
              conflict = true; break;
            }
          }
          if (!conflict) { assignment[variable.key] = slot; break; }
        }
      }
    });
  }

  await delay(300);
  setProgress(95);

  const assignedCount = Object.keys(assignment).length;
  addLog(`Solver complete. Assigned: ${assignedCount}/${totalVars} lectures`, 'success');
  addLog(`Total backtracks: ${backtracks} | Nodes explored: ${nodesExplored}`, 'neutral');
  await delay(200);

  if (assignedCount < totalVars) {
    addLog(`WARNING: ${totalVars - assignedCount} sessions could not be scheduled`, 'warning');
  } else {
    addLog('✓ All lectures scheduled without conflicts!', 'success');
  }

  // Validate constraints
  addLog('Validating hard constraints...', 'info');
  await delay(300);
  let conflicts = 0;
  const slotMap = {};
  for (const [key, slot] of Object.entries(assignment)) {
    const slotKey = `${slot.day}_${slot.slot}`;
    if (!slotMap[slotKey]) slotMap[slotKey] = [];
    const course = variables.find(v => v.key === key)?.course;
    slotMap[slotKey].push({ key, course, room: slot.room });
  }
  for (const [slotKey, entries] of Object.entries(slotMap)) {
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        if (entries[i].room === entries[j].room) { addLog(`Room conflict: ${entries[i].room} at ${slotKey}`, 'error'); conflicts++; }
        if (entries[i].course?.faculty === entries[j].course?.faculty) { addLog(`Faculty conflict: ${entries[i].course?.faculty} at ${slotKey}`, 'error'); conflicts++; }
        if (entries[i].course?.group === entries[j].course?.group) { addLog(`Group conflict: ${entries[i].course?.group} at ${slotKey}`, 'error'); conflicts++; }
      }
    }
  }

  if (conflicts === 0) addLog('✓ All hard constraints satisfied — zero conflicts', 'success');
  else addLog(`⚠ ${conflicts} conflict(s) detected`, 'warning');

  setProgress(100);

  // Build timetable
  db.timetable = { assignment, variables, slotsCount, activeDays };
  addLog('Timetable generated. Navigate to Timetable tab to view.', 'success');
  toast('Timetable generated! Go to Timetable tab.');
  renderDashboard();
}

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

// ==================== TIMETABLE RENDER ====================
const colorCycle = COURSE_COLORS;
let colorIdx = 0;

function getCourseColor(courseId) {
  if (!courseColorMap[courseId]) {
    courseColorMap[courseId] = colorCycle[colorIdx % colorCycle.length];
    colorIdx++;
  }
  return courseColorMap[courseId];
}

function renderTimetable() {
  const container = document.getElementById('timetable-container');
  const viewSel = document.getElementById('view-select');
  if (!container) return;

  if (!db.timetable) {
    container.innerHTML = `<div style="text-align:center;padding:60px;color:#8a8880">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" style="opacity:0.4;display:block;margin:0 auto 12px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      <div>No timetable generated yet.</div>
      <div style="font-size:12px;margin-top:6px">Go to <strong>Generate</strong> tab and run the CSP Solver.</div>
    </div>`;
    return;
  }

  const { assignment, variables, slotsCount, activeDays } = db.timetable;
  const view = viewSel ? viewSel.value : 'master';

  // Build slot grid
  const slots = TIME_SLOTS.slice(0, slotsCount);
  const days = activeDays || DAYS;

  // Build cell map: [day][slot] = [{course, room, key}]
  const cellMap = {};
  days.forEach(d => { cellMap[d] = {}; slots.forEach((_, i) => { cellMap[d][i] = []; }); });

  for (const [key, slot] of Object.entries(assignment)) {
    const v = variables.find(v => v.key === key);
    if (!v) continue;
    if (!cellMap[slot.day]) continue;
    if (cellMap[slot.day][slot.slot] === undefined) continue;
    cellMap[slot.day][slot.slot].push({ course: v.course, room: slot.room, key });
  }

  const fo = document.getElementById('filter-options');
  if (fo) fo.innerHTML = `<span style="font-size:12px;color:#8a8880">View: <strong style="color:#1a1916">${viewSel ? viewSel.options[viewSel.selectedIndex].text : 'Master'}</strong></span>`;

  let html = `<div class="timetable-grid"><table class="tt-table"><thead><tr><th style="min-width:90px">Time</th>`;
  days.forEach(d => html += `<th>${d}</th>`);
  html += '</tr></thead><tbody>';

  slots.forEach((timeLabel, slotIdx) => {
    html += `<tr><td class="time-col">${timeLabel}</td>`;
    days.forEach(day => {
      const entries = cellMap[day][slotIdx] || [];
      if (entries.length === 0) {
        html += `<td></td>`;
      } else {
        html += `<td>`;
        entries.forEach(entry => {
          const colorClass = getCourseColor(entry.course.id);
          const faculty = getFacultyName(entry.course.faculty);
          html += `<div class="tt-cell ${colorClass}">
            <div class="course-name">${entry.course.name}</div>
            <div class="course-info">${faculty} · ${entry.room}</div>
            <div class="course-info">${entry.course.group}</div>
          </div>`;
        });
        html += `</td>`;
      }
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// ==================== EXPORT ====================
function exportPDF() {
  toast('PDF export: In a full implementation, this uses iText/JasperReports on the Java backend.');
}
function exportExcel() {
  toast('Excel export: In a full implementation, this uses Apache POI on the Java backend.');
}

// ==================== CSP VISUALIZER ====================
let cspState = { step: 0, playing: false, playTimer: null };
let cspSteps = [];

function initCSPVisualizer() {
  buildCSPSteps();
  cspState.step = 0;
  drawCSPStep(0);
  updateCSPInfo(0);
}

function buildCSPSteps() {
  // Simulate a small CSP search tree for visualization
  cspSteps = [
    { node: 0, label: 'Start', status: 'root', assign: '—', backs: 0, nodes: 1, varName: 'DBMS_1', tree: buildTree(0) },
    { node: 1, label: 'DBMS_1 → Mon 9AM R101', status: 'try', assign: 'Mon 9AM / R101', backs: 0, nodes: 2, varName: 'DBMS_2', tree: buildTree(1) },
    { node: 2, label: 'DBMS_2 → Mon 10AM R101', status: 'try', assign: 'Mon 10AM / R101', backs: 0, nodes: 3, varName: 'JAVA_1', tree: buildTree(2) },
    { node: 3, label: 'JAVA_1 → Mon 9AM R102', status: 'fail', assign: 'Mon 9AM / R102', backs: 1, nodes: 4, varName: 'JAVA_1', tree: buildTree(3) },
    { node: 4, label: 'JAVA_1 → Tue 9AM R101 (backtrack)', status: 'backtrack', assign: 'Tue 9AM / R101', backs: 1, nodes: 5, varName: 'JAVA_1', tree: buildTree(4) },
    { node: 5, label: 'JAVA_2 → Tue 10AM R102', status: 'try', assign: 'Tue 10AM / R102', backs: 1, nodes: 6, varName: 'JAVA_2', tree: buildTree(5) },
    { node: 6, label: 'DBMS_3 → Wed 9AM R101', status: 'try', assign: 'Wed 9AM / R101', backs: 1, nodes: 7, varName: 'DBMS_3', tree: buildTree(6) },
    { node: 7, label: 'Solution found!', status: 'success', assign: 'Complete', backs: 1, nodes: 8, varName: '—', tree: buildTree(7) },
  ];
}

function buildTree(step) {
  // Returns nodes for drawing
  return {
    nodes: [
      { x: 280, y: 30, label: 'Start', status: step >= 0 ? 'done' : 'pending' },
      { x: 280, y: 100, label: 'DBMS_1', status: step >= 1 ? (step >= 3 ? 'done' : 'active') : 'pending' },
      { x: 180, y: 175, label: 'DBMS_2', status: step >= 2 ? 'done' : 'pending' },
      { x: 100, y: 250, label: 'JAVA_1 ✗', status: step === 3 ? 'fail' : step > 3 ? 'fail' : 'pending' },
      { x: 220, y: 250, label: 'JAVA_1 ✓', status: step >= 4 ? 'active' : 'pending' },
      { x: 350, y: 175, label: 'JAVA_2', status: step >= 5 ? 'done' : 'pending' },
      { x: 420, y: 250, label: 'DBMS_3', status: step >= 6 ? 'done' : 'pending' },
      { x: 350, y: 330, label: '🎯 Solution', status: step >= 7 ? 'success' : 'pending' },
    ],
    edges: [
      [0,1],[1,2],[2,3],[2,4],[1,5],[5,6],[6,7]
    ]
  };
}

function drawCSPStep(step) {
  const canvas = document.getElementById('csp-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { nodes, edges } = cspSteps[step].tree;
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const colors = {
    pending: { fill: '#f1f0ec', stroke: '#ccc9be', text: '#8a8880' },
    active:  { fill: '#e8eef8', stroke: '#2a52a0', text: '#1a3070' },
    done:    { fill: '#e8f4ed', stroke: '#1a6e3c', text: '#1a4e2c' },
    fail:    { fill: '#fdeaea', stroke: '#8b1e1e', text: '#6e1a1a' },
    success: { fill: '#fef3e2', stroke: '#7a4e0a', text: '#5a3a0a' },
    root:    { fill: '#ede9fe', stroke: '#3b0764', text: '#2a0550' },
  };

  // Draw edges
  edges.forEach(([from, to]) => {
    const a = nodes[from], b = nodes[to];
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + 18);
    ctx.lineTo(b.x, b.y - 18);
    ctx.strokeStyle = '#ccc9be';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Draw nodes
  nodes.forEach(n => {
    const c = colors[n.status] || colors.pending;
    const r = 18, w = Math.max(80, n.label.length * 7.5 + 20);
    ctx.fillStyle = c.fill;
    ctx.strokeStyle = c.stroke;
    ctx.lineWidth = n.status === 'active' || n.status === 'success' ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(n.x - w/2, n.y - r, w, r*2, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = c.text;
    ctx.font = `${n.status === 'active' || n.status === 'success' ? '500' : '400'} 12px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, n.x, n.y);
  });
}

function updateCSPInfo(step) {
  const s = cspSteps[step];
  document.getElementById('csp-var').textContent = s.varName;
  document.getElementById('csp-assign').textContent = s.assign;
  document.getElementById('csp-backs').textContent = s.backs;
  document.getElementById('csp-nodes').textContent = s.nodes;
  document.getElementById('csp-status').textContent =
    s.status === 'success' ? '✓ Solution found' :
    s.status === 'fail' ? 'Constraint violated — backtrack' :
    s.status === 'backtrack' ? 'Backtracking...' :
    s.status === 'try' ? 'Trying assignment...' : 'Initializing';

  // MRV display
  const mrvEl = document.getElementById('mrv-display');
  const courses = db.courses.slice(0, 4);
  const remaining = [3, 5, 8, 2];
  if (mrvEl) {
    mrvEl.innerHTML = courses.map((c, i) => `
      <div class="mrv-item">
        <span>${c.id} ${c.name}</span>
        <span class="mrv-count">${remaining[i]} values left</span>
      </div>`).join('');
  }

  // Constraint log
  const clEl = document.getElementById('constraint-log');
  if (clEl) {
    const checks = [
      { pass: true, msg: 'Faculty F1 free at Mon 9AM' },
      { pass: true, msg: 'Room R101 free at Mon 9AM' },
      { pass: true, msg: 'Group CSE-A free at Mon 9AM' },
      { pass: true, msg: 'Capacity 60 ≥ strength 55' },
      { pass: step >= 3, msg: step >= 3 ? 'Faculty F2 conflict at Mon 9AM' : 'Checking Faculty F2...' },
      { pass: false, msg: step >= 3 ? '✗ Constraint violated → backtrack' : '' },
    ].filter(c => c.msg);
    clEl.innerHTML = checks.map(c => `
      <div class="cl-item ${c.pass ? 'cl-pass' : 'cl-fail'}">${c.pass ? '✓' : '✗'} ${c.msg}</div>
    `).join('');
  }
}

function cspStep(dir) {
  cspState.step = Math.max(0, Math.min(cspSteps.length - 1, cspState.step + dir));
  drawCSPStep(cspState.step);
  updateCSPInfo(cspState.step);
}

function cspPlay() {
  const btn = document.getElementById('csp-play-btn');
  if (cspState.playing) {
    clearInterval(cspState.playTimer);
    cspState.playing = false;
    btn.textContent = '▶ Play';
  } else {
    cspState.playing = true;
    btn.textContent = '⏸ Pause';
    if (cspState.step >= cspSteps.length - 1) cspState.step = 0;
    cspState.playTimer = setInterval(() => {
      cspState.step++;
      drawCSPStep(cspState.step);
      updateCSPInfo(cspState.step);
      if (cspState.step >= cspSteps.length - 1) {
        clearInterval(cspState.playTimer);
        cspState.playing = false;
        btn.textContent = '▶ Play';
      }
    }, 1000);
  }
}

function cspReset() {
  clearInterval(cspState.playTimer);
  cspState.playing = false;
  cspState.step = 0;
  document.getElementById('csp-play-btn').textContent = '▶ Play';
  drawCSPStep(0);
  updateCSPInfo(0);
}

// ==================== TOAST ====================
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2800);
}

// ==================== INIT ====================
renderDashboard();
renderFacultyTable();
renderCoursesTable();
renderRoomsTable();
renderGroupsTable();
