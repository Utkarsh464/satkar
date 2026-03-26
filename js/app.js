/* ============================================================
   ROOMADMIN — MAIN APP v2.0
   Premium Dashboard Logic
   ============================================================ */

'use strict';

/* ============================================================
   STORE — localStorage wrapper
   ============================================================ */
const STORE = {
  get(k) { try { return JSON.parse(localStorage.getItem('ra_' + k) || '[]'); } catch { return []; } },
  set(k, v) { localStorage.setItem('ra_' + k, JSON.stringify(v)); },
};

/* ============================================================
   UTILS
   ============================================================ */
function todayStr() { return new Date().toISOString().split('T')[0]; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function initials(n) { return n.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase(); }
function fmtDate(s) { if (!s) return '—'; const d = new Date(s + 'T00:00:00'); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }); }
function fmtCur(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
function daysBetween(a, b) { if (!a || !b) return '—'; return Math.round((new Date(b) - new Date(a)) / 86400000); }

/* ─── Animate number counting up ─── */
function animateNumber(el, target, prefix = '', suffix = '') {
  if (!el) return;
  const start = 0;
  const duration = 700;
  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const current = Math.round(start + (target - start) * ease);
    el.textContent = prefix + current.toLocaleString('en-IN') + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ─── Toast ─── */
function toast(msg, type = 'default') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => (t.className = ''), 2500);
}

/* ============================================================
   SEED DATA
   ============================================================ */
function seedData() {
  if (STORE.get('rooms').length === 0) {
    STORE.set('rooms', [
      { id: 'r1', number: '101', floor: 'Ground Floor', type: 'Single',  price: 800,  status: 'occupied', notes: '' },
      { id: 'r2', number: '102', floor: 'Ground Floor', type: 'Double',  price: 1200, status: 'occupied', notes: '' },
      { id: 'r3', number: '103', floor: 'Ground Floor', type: 'Single',  price: 800,  status: 'free',     notes: 'Near window' },
      { id: 'r4', number: '201', floor: 'First Floor',  type: 'Suite',   price: 2500, status: 'free',     notes: 'AC Room' },
      { id: 'r5', number: '202', floor: 'First Floor',  type: 'Double',  price: 1200, status: 'occupied', notes: '' },
      { id: 'r6', number: '203', floor: 'First Floor',  type: 'Single',  price: 800,  status: 'free',     notes: '' },
    ]);
  }

  if (STORE.get('clients').length === 0) {
    const d = new Date();
    const fmt = d => d.toISOString().split('T')[0];

    STORE.set('clients', [
      { id: 'c1', name: 'Rahul Sharma',  mobile: '9876543210', idType: 'Aadhaar Card', idNumber: 'XXXX-XXXX-1234', idImage: '', status: 'active',   notes: 'Regular guest' },
      { id: 'c2', name: 'Priya Mehta',   mobile: '9123456789', idType: 'PAN Card',     idNumber: 'ABCDE1234F',     idImage: '', status: 'active',   notes: 'Prefers ground floor' },
      { id: 'c3', name: 'Amit Kumar',    mobile: '9988776655', idType: 'Passport',     idNumber: 'J1234567',       idImage: '', status: 'inactive', notes: '' },
      { id: 'c4', name: 'Sunita Verma',  mobile: '9765432100', idType: 'Aadhaar Card', idNumber: 'XXXX-XXXX-5678', idImage: '', status: 'active',   notes: 'Corporate client' },
      { id: 'c5', name: 'Vikram Singh',  mobile: '9654321098', idType: 'Driving Lic.', idNumber: 'DL-01-2020-0001',idImage: '', status: 'inactive', notes: '' },
    ]);

    STORE.set('visits', [
      { id: 'v1', clientId: 'c1', clientName: 'Rahul Sharma',  room: '101', checkin: fmt(new Date(d - 5  * 864e5)), checkout: '',                        priceMode: 'preset', pricePerNight: 800,  totalAmount: 4000,  status: 'active'    },
      { id: 'v2', clientId: 'c2', clientName: 'Priya Mehta',   room: '102', checkin: fmt(new Date(d - 2  * 864e5)), checkout: '',                        priceMode: 'custom', pricePerNight: 1100, totalAmount: 2200,  status: 'active'    },
      { id: 'v3', clientId: 'c2', clientName: 'Priya Mehta',   room: '203', checkin: fmt(new Date(d - 30 * 864e5)), checkout: fmt(new Date(d-25*864e5)), priceMode: 'preset', pricePerNight: 800,  totalAmount: 4000,  status: 'completed' },
      { id: 'v4', clientId: 'c3', clientName: 'Amit Kumar',    room: '201', checkin: fmt(new Date(d - 15 * 864e5)), checkout: fmt(new Date(d-10*864e5)), priceMode: 'preset', pricePerNight: 2500, totalAmount: 12500, status: 'completed' },
      { id: 'v5', clientId: 'c1', clientName: 'Rahul Sharma',  room: '202', checkin: fmt(new Date(d - 60 * 864e5)), checkout: fmt(new Date(d-55*864e5)), priceMode: 'custom', pricePerNight: 1000, totalAmount: 5000,  status: 'completed' },
      { id: 'v6', clientId: 'c4', clientName: 'Sunita Verma',  room: '103', checkin: fmt(new Date(d - 8  * 864e5)), checkout: fmt(new Date(d-6*864e5)),  priceMode: 'preset', pricePerNight: 800,  totalAmount: 1600,  status: 'completed' },
      { id: 'v7', clientId: 'c5', clientName: 'Vikram Singh',  room: '201', checkin: fmt(new Date(d - 45 * 864e5)), checkout: fmt(new Date(d-42*864e5)), priceMode: 'custom', pricePerNight: 2200, totalAmount: 6600,  status: 'completed' },
      { id: 'v8', clientId: 'c4', clientName: 'Sunita Verma',  room: '101', checkin: fmt(new Date(d - 3  * 864e5)), checkout: '',                        priceMode: 'preset', pricePerNight: 800,  totalAmount: 2400,  status: 'active'    },
    ]);
  }
}

/* ============================================================
   AUTH
   ============================================================ */
const CREDS = { email: 'admin@roomadmin.com', pass: 'admin123' };

function doLogin() {
  const e = document.getElementById('login-email').value.trim();
  const p = document.getElementById('login-pass').value;
  const btn = document.querySelector('.login-btn');

  if (e === CREDS.email && p === CREDS.pass) {
    btn.textContent = '✓ Signing in…';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    setTimeout(() => {
      document.getElementById('login-page').style.display = 'none';
      initApp();
    }, 500);
  } else {
    const el = document.getElementById('login-error');
    el.style.display = 'block';
    el.style.animation = 'none';
    requestAnimationFrame(() => { el.style.animation = ''; });
    setTimeout(() => (el.style.display = 'none'), 3500);
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 400);
  }
}

function logout() {
  document.getElementById('login-page').style.display = 'flex';
  const btn = document.querySelector('.login-btn');
  btn.textContent = 'Sign In →';
  btn.style.background = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('login-page').style.display !== 'none') doLogin();
});

/* ============================================================
   INIT
   ============================================================ */
function initApp() {
  seedData();
  const d = new Date();
  document.getElementById('date-badge').textContent =
    d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  renderDashboard();
  renderRoomsGrid();
  renderClientsTable();
  renderRevenue();
  renderHistoryTable();
}

/* ============================================================
   NAVIGATION
   ============================================================ */
let currentPage = 'dashboard';

function showPage(page, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  currentPage = page;

  const titles = { dashboard: 'Dashboard', rooms: 'Room Management', clients: 'Client Records', revenue: 'Revenue', history: 'Visit History' };
  document.getElementById('topbar-title').textContent = titles[page] || page;

  /* Sidebar active state */
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  if (navEl) navEl.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.getAttribute('onclick')?.includes("'" + page + "'")) item.classList.add('active');
    });
  }

  /* Mobile nav active state */
  document.querySelectorAll('.mnav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.mnav-item').forEach(item => {
    if (item.getAttribute('onclick')?.includes("'" + page + "'")) item.classList.add('active');
  });

  /* FAB */
  const fab = document.getElementById('global-fab');
  const fabMap = {
    rooms: { show: true, label: '+ Room', action: "openModal('modal-room')" },
    clients: { show: true, label: '+ Client', action: 'openAddClient()' },
  };
  if (fabMap[page]) {
    fab.style.display = 'flex';
    fab.querySelector('.fab-label').textContent = fabMap[page].label;
    fab.setAttribute('onclick', fabMap[page].action);
  } else {
    fab.style.display = 'none';
  }

  closeSidebar();

  if (page === 'dashboard') renderDashboard();
  if (page === 'rooms') renderRoomsGrid();
  if (page === 'clients') renderClientsTable();
  if (page === 'revenue') renderRevenue();
  if (page === 'history') renderHistoryTable();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('show');
}

function refreshData() {
  toast('Refreshed ✓', 'success');
  if (currentPage === 'dashboard') renderDashboard();
  else if (currentPage === 'rooms') renderRoomsGrid();
  else if (currentPage === 'clients') renderClientsTable();
  else if (currentPage === 'revenue') renderRevenue();
  else if (currentPage === 'history') renderHistoryTable();
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  const rooms   = STORE.get('rooms');
  const clients = STORE.get('clients');
  const visits  = STORE.get('visits');
  const today   = todayStr();

  const occupied     = rooms.filter(r => r.status === 'occupied').length;
  const free         = rooms.filter(r => r.status === 'free').length;
  const activeClients = visits.filter(v => v.status === 'active').length;
  const occupancyPct = rooms.length ? Math.round(occupied / rooms.length * 100) : 0;

  const todayRev = visits.filter(v => v.checkin === today).reduce((a, v) => a + (v.totalAmount || 0), 0);
  const last7    = new Date(Date.now() - 7  * 864e5).toISOString().split('T')[0];
  const last30   = new Date(Date.now() - 30 * 864e5).toISOString().split('T')[0];
  const rev7     = visits.filter(v => v.checkin >= last7 ).reduce((a, v) => a + (v.totalAmount || 0), 0);
  const rev30    = visits.filter(v => v.checkin >= last30).reduce((a, v) => a + (v.totalAmount || 0), 0);

  /* Update sidebar active users */
  const activeVisits = visits.filter(v => v.status === 'active');
  const sauEl = document.getElementById('sau-row');
  if (sauEl) {
    const names = activeVisits.map(v => v.clientName);
    const unique = [...new Set(names)].slice(0, 3);
    const extra  = activeVisits.length - unique.length;
    sauEl.innerHTML = unique.map(n => `<div class="sau-avatar">${initials(n)[0]}</div>`).join('');
    if (extra > 0) sauEl.innerHTML += `<div class="sau-more">+${extra}</div>`;
    if (unique.length === 0) sauEl.innerHTML = `<span style="font-size:10px;color:var(--sidebar-muted);">No active guests</span>`;
  }

  /* Build sparkline data (last 7 days) */
  const sparkData = [];
  for (let i = 6; i >= 0; i--) {
    const key = new Date(Date.now() - i * 864e5).toISOString().split('T')[0];
    sparkData.push(visits.filter(v => v.checkin === key).reduce((s, v) => s + (v.totalAmount || 0), 0));
  }

  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card yellow" onclick="showPage('rooms',null)">
      <div class="stat-icon">🏨</div>
      <div class="stat-label">Total Rooms</div>
      <div class="stat-value" id="sv-rooms">${rooms.length}</div>
      <div class="stat-sub">${occupied} occupied · ${free} free</div>
      <div class="occ-bar-wrap"><div class="occ-bar" style="width:${occupancyPct}%"></div></div>
    </div>
    <div class="stat-card pink" onclick="showPage('rooms',null)">
      <div class="stat-icon">🔑</div>
      <div class="stat-label">Occupied</div>
      <div class="stat-value" id="sv-occ">${occupied}</div>
      <div class="stat-sub">${occupancyPct}% occupancy</div>
      <div class="stat-trend up">↑ Active</div>
    </div>
    <div class="stat-card green" onclick="showPage('clients',null)">
      <div class="stat-icon">👥</div>
      <div class="stat-label">Active Guests</div>
      <div class="stat-value" id="sv-guests">${activeClients}</div>
      <div class="stat-sub">${clients.length} total clients</div>
      <div class="stat-trend up">↑ In House</div>
    </div>
    <div class="stat-card blue" onclick="showPage('revenue',null)">
      <div class="stat-icon">💰</div>
      <div class="stat-label">Revenue (7d)</div>
      <div class="stat-value" id="sv-rev" style="font-size:${rev7>99999?'20px':'26px'}">₹0</div>
      <div class="stat-sub">30d: ${fmtCur(rev30)}</div>
      <div class="mini-chart-wrap"><svg id="dash-sparkline"></svg></div>
    </div>
  `;

  /* Animate numbers */
  animateNumber(document.getElementById('sv-rev'), rev7, '₹');

  /* Draw sparkline after DOM is ready */
  requestAnimationFrame(() => {
    const svg = document.getElementById('dash-sparkline');
    if (svg) drawSparkline(svg, sparkData);
  });

  /* Occupied rooms list */
  const oRooms = rooms.filter(r => r.status === 'occupied');
  const dor = document.getElementById('dash-occupied-rooms');
  if (oRooms.length === 0) {
    dor.innerHTML = `<div class="empty-state"><div class="empty-icon">🏨</div><p>No occupied rooms</p></div>`;
  } else {
    dor.innerHTML = oRooms.map((r, i) => {
      const v = visits.find(v => v.room === r.number && v.status === 'active');
      return `<div class="occ-room-item" onclick="showRoomDetail('${r.id}')" style="animation-delay:${i*0.05}s">
        <div>
          <div style="font-family:'Nunito',sans-serif;font-weight:900;font-size:15px;">Room ${r.number}</div>
          <div style="font-size:11.5px;color:var(--text-muted);">${v ? v.clientName : '—'} · ${r.type}</div>
        </div>
        <div style="text-align:right;">
          <span class="badge occupied-b">Occupied</span>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:3px;">${v ? 'Since ' + fmtDate(v.checkin) : ''}</div>
        </div>
      </div>`;
    }).join('');
  }

  /* Recent check-ins — styled like reference "Last Trips" table */
  const recent = visits.filter(v => v.status !== 'registered').slice().sort((a, b) => b.checkin.localeCompare(a.checkin)).slice(0, 5);
  if (recent.length === 0) {
    document.getElementById('dash-recent-checkins').innerHTML = `<div class="empty-state"><div class="empty-icon">🕐</div><p>No check-ins yet</p></div>`;
  } else {
    document.getElementById('dash-recent-checkins').innerHTML = `
      <div style="display:grid;grid-template-columns:1fr auto auto auto;gap:0;border-bottom:1px solid var(--border-light);padding-bottom:8px;margin-bottom:2px;">
        <div style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);">Members</div>
        <div style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);padding:0 16px;">Room</div>
        <div style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);padding:0 16px;">Nights</div>
        <div style="font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);">Amount</div>
      </div>
      ${recent.map(v => `
      <div class="trips-row" onclick="showClientDetail('${v.clientId}')">
        <div class="trip-avatar">${initials(v.clientName)}</div>
        <div style="flex:1;min-width:0;">
          <div class="trip-name">${v.clientName}</div>
          <div class="trip-email">${fmtDate(v.checkin)}</div>
        </div>
        <div style="padding:0 14px;text-align:center;">
          <div class="trip-flight">Rm ${v.room || '—'}</div>
        </div>
        <div style="padding:0 14px;text-align:center;">
          <div class="trip-members">${v.status === 'active' ? '✓' : v.checkout ? daysBetween(v.checkin,v.checkout) : '—'}</div>
        </div>
        <div class="trip-price">${fmtCur(v.totalAmount)}</div>
      </div>`).join('')}
    `;
  }
}

/* ============================================================
   ROOMS
   ============================================================ */
let editRoomId = null;

function renderRoomsGrid() {
  const rooms  = STORE.get('rooms');
  const visits = STORE.get('visits');
  const grid   = document.getElementById('rooms-grid');

  grid.innerHTML = rooms.map((r, i) => {
    const v = visits.find(v => v.room === r.number && v.status === 'active');
    return `<div class="room-card ${r.status}" onclick="showRoomDetail('${r.id}')" style="animation-delay:${i*0.04}s">
      <div class="room-number">${r.number}</div>
      <span class="room-status-badge ${r.status}">${r.status === 'occupied' ? 'Occupied' : 'Free'}</span>
      <div class="room-price">${fmtCur(r.price)} / night</div>
      ${v ? `<div class="room-client">👤 ${v.clientName}</div>` : ''}
      <div style="font-size:10.5px;color:var(--text-muted);margin-top:4px;">${r.type} · ${r.floor}</div>
    </div>`;
  }).join('');
}

function openAddRoom() {
  editRoomId = null;
  document.getElementById('room-modal-title').textContent = 'Add Room';
  document.getElementById('room-form').reset();
  openModal('modal-room');
}

function showRoomDetail(roomId) {
  const rooms  = STORE.get('rooms');
  const visits = STORE.get('visits');
  const r = rooms.find(x => x.id === roomId);
  if (!r) return;

  const activeVisit = visits.find(v => v.room === r.number && v.status === 'active');
  const roomVisits  = visits.filter(v => v.room === r.number).sort((a, b) => b.checkin.localeCompare(a.checkin));

  document.getElementById('rd-content').innerHTML = `
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid var(--border-light);">
      <div style="width:52px;height:52px;border-radius:15px;background:${r.status==='occupied'?'var(--card-yellow)':'var(--card-green)'};display:flex;align-items:center;justify-content:center;font-size:24px;border:2px solid ${r.status==='occupied'?'#fde68a':'#a7f3d0'};">🛏️</div>
      <div>
        <div style="font-family:'Nunito',sans-serif;font-size:20px;font-weight:800;">Room ${r.number}</div>
        <div style="display:flex;gap:6px;margin-top:5px;flex-wrap:wrap;">
          <span class="room-status-badge ${r.status}">${r.status === 'occupied' ? 'Occupied' : 'Free'}</span>
          <span style="font-size:10.5px;background:var(--card-blue);color:#1e40af;padding:2px 9px;border-radius:99px;font-weight:700;">${r.type}</span>
        </div>
      </div>
    </div>
    <div class="detail-rows" style="margin-bottom:16px;">
      <div class="detail-row"><span class="dr-label">Floor</span><span class="dr-value">${r.floor}</span></div>
      <div class="detail-row"><span class="dr-label">Price / Night</span><span class="dr-value" style="font-family:'Nunito',sans-serif;font-weight:800;">${fmtCur(r.price)}</span></div>
      ${r.notes ? `<div class="detail-row"><span class="dr-label">Notes</span><span class="dr-value">${r.notes}</span></div>` : ''}
      ${activeVisit ? `<div class="detail-row"><span class="dr-label">Current Guest</span><span class="dr-value" style="font-weight:700;">${activeVisit.clientName}</span></div>
        <div class="detail-row"><span class="dr-label">Check-in</span><span class="dr-value">${fmtDate(activeVisit.checkin)}</span></div>
        <div class="detail-row"><span class="dr-label">Amount</span><span class="dr-value" style="color:#065f46;font-weight:800;">${fmtCur(activeVisit.totalAmount)}</span></div>` : ''}
    </div>
    ${roomVisits.length > 0 ? `
    <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;">Visit History</div>
    <div class="history-visits">
      ${roomVisits.slice(0, 4).map(v => `<div class="visit-card">
        <div class="visit-card-top">
          <div class="visit-room">${v.clientName}</div>
          <div class="visit-amount">${fmtCur(v.totalAmount)}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="visit-dates">${fmtDate(v.checkin)}${v.checkout ? ' → ' + fmtDate(v.checkout) : ' (Active)'}</div>
          <span class="badge ${v.status === 'active' ? 'active' : 'checked-out'}">${v.status === 'active' ? 'Active' : 'Done'}</span>
        </div>
      </div>`).join('')}
    </div>` : ''}
    <div style="display:flex;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid var(--border-light);">
      <button class="btn btn-outline" style="flex:1;" onclick="closeModal('modal-room-detail');editRoom('${r.id}')">✏️ Edit</button>
      <button class="btn ${r.status==='occupied'?'btn-danger':'btn-success'}" style="flex:1;" onclick="toggleRoomStatus('${r.id}')">${r.status==='occupied'?'Mark Free':'Mark Occupied'}</button>
    </div>
  `;
  openModal('modal-room-detail');
}

function editRoom(roomId) {
  const rooms = STORE.get('rooms');
  const r = rooms.find(x => x.id === roomId);
  if (!r) return;
  editRoomId = roomId;
  document.getElementById('room-modal-title').textContent = 'Edit Room';
  document.getElementById('room-number').value = r.number;
  document.getElementById('room-floor').value  = r.floor;
  document.getElementById('room-type').value   = r.type;
  document.getElementById('room-price').value  = r.price;
  document.getElementById('room-notes').value  = r.notes;
  openModal('modal-room');
}

function saveRoom() {
  const rooms = STORE.get('rooms');
  const data  = {
    number: document.getElementById('room-number').value.trim(),
    floor:  document.getElementById('room-floor').value,
    type:   document.getElementById('room-type').value,
    price:  parseInt(document.getElementById('room-price').value) || 0,
    notes:  document.getElementById('room-notes').value.trim(),
  };
  if (!data.number) { toast('Room number required', 'error'); return; }

  if (editRoomId) {
    const idx = rooms.findIndex(r => r.id === editRoomId);
    rooms[idx] = { ...rooms[idx], ...data };
    toast('Room updated ✓', 'success');
  } else {
    rooms.push({ id: uid(), status: 'free', ...data });
    toast('Room added ✓', 'success');
  }

  STORE.set('rooms', rooms);
  closeModal('modal-room');
  renderRoomsGrid();
  renderDashboard();
}

function deleteRoom() {
  if (!editRoomId) return;
  if (!confirm('Delete this room?')) return;
  const rooms = STORE.get('rooms').filter(r => r.id !== editRoomId);
  STORE.set('rooms', rooms);
  closeModal('modal-room');
  renderRoomsGrid();
  renderDashboard();
  toast('Room deleted', 'default');
}

function toggleRoomStatus(roomId) {
  const rooms = STORE.get('rooms');
  const r = rooms.find(x => x.id === roomId);
  if (!r) return;
  r.status = r.status === 'occupied' ? 'free' : 'occupied';
  STORE.set('rooms', rooms);
  closeModal('modal-room-detail');
  renderRoomsGrid();
  renderDashboard();
  toast(`Room ${r.number} marked as ${r.status} ✓`, 'success');
}

/* ============================================================
   CLIENTS
   ============================================================ */
let editClientId = null;
let capturedImageData = '';

function renderClientsTable() {
  const clients = STORE.get('clients');
  const visits  = STORE.get('visits');
  const search  = document.getElementById('client-search').value.toLowerCase();
  const filter  = document.getElementById('client-filter').value;

  let list = clients.filter(c =>
    (c.name.toLowerCase().includes(search) || c.mobile.includes(search)) &&
    (filter === 'all' || c.status === filter)
  );

  const tbody = document.getElementById('clients-tbody');
  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">👥</div><p>No clients found</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(c => {
    const cVisits = visits.filter(v => v.clientId === c.id);
    const totalSpent = cVisits.reduce((a, v) => a + (v.totalAmount || 0), 0);
    const active = cVisits.find(v => v.status === 'active');
    return `<tr onclick="showClientDetail('${c.id}')" style="cursor:pointer;">
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:34px;height:34px;border-radius:10px;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:13px;color:#111;font-weight:700;flex-shrink:0;">${initials(c.name)}</div>
          <div>
            <div style="font-weight:600;font-size:13px;">${c.name}</div>
            <div style="font-size:11px;color:var(--text-muted);">${c.mobile}</div>
          </div>
        </div>
      </td>
      <td>${c.idType || '—'}</td>
      <td>${active ? `<span class="badge occupied-b">Rm ${active.room}</span>` : '<span style="color:var(--text-muted);font-size:12px;">—</span>'}</td>
      <td style="font-family:'Nunito',sans-serif;font-weight:700;">${fmtCur(totalSpent)}</td>
      <td><span class="badge ${c.status}">${c.status}</span></td>
      <td>
        ${c.idImage ? `<img src="${c.idImage}" class="id-thumb" onclick="event.stopPropagation();openLightbox('${c.idImage}')" alt="ID"/>` : `<span class="no-id-badge">No ID</span>`}
      </td>
    </tr>`;
  }).join('');
}

function openAddClient() {
  editClientId = null;
  capturedImageData = '';
  document.getElementById('client-form').reset();
  document.getElementById('id-preview').style.display = 'none';
  document.getElementById('upload-area').classList.remove('has-image');
  document.getElementById('upload-area').querySelector('.upload-icon').textContent = '📎';
  document.getElementById('clear-img-btn').style.display = 'none';
  document.getElementById('returning-banner').classList.remove('show');
  document.getElementById('client-modal-title').textContent = 'Add Client & Visit';
  openModal('modal-client');
}

function editClient(clientId) {
  const clients = STORE.get('clients');
  const c = clients.find(x => x.id === clientId);
  if (!c) return;
  editClientId = clientId;
  capturedImageData = c.idImage || '';
  document.getElementById('client-modal-title').textContent = 'Edit Client';
  document.getElementById('c-name').value    = c.name;
  document.getElementById('c-mobile').value  = c.mobile;
  document.getElementById('c-idtype').value  = c.idType;
  document.getElementById('c-idnum').value   = c.idNumber;
  document.getElementById('c-notes').value   = c.notes;
  document.getElementById('c-status').value  = c.status;
  if (c.idImage) {
    const prev = document.getElementById('id-preview');
    prev.src = c.idImage;
    prev.style.display = 'block';
    document.getElementById('upload-area').classList.add('has-image');
    document.getElementById('clear-img-btn').style.display = 'inline-flex';
  }
  openModal('modal-client');
}

function checkReturningClient() {
  const mobile = document.getElementById('c-mobile').value.trim();
  if (!mobile || mobile.length < 10 || editClientId) return;
  const clients = STORE.get('clients');
  const existing = clients.find(c => c.mobile === mobile);
  const banner = document.getElementById('returning-banner');
  if (existing) {
    document.getElementById('rb-name').textContent = existing.name;
    document.getElementById('rb-visits').textContent = STORE.get('visits').filter(v => v.clientId === existing.id).length;
    banner.classList.add('show');
    document.getElementById('rb-autofill-btn').onclick = () => {
      editClientId = existing.id;
      document.getElementById('c-name').value    = existing.name;
      document.getElementById('c-idtype').value  = existing.idType;
      document.getElementById('c-idnum').value   = existing.idNumber;
      document.getElementById('c-notes').value   = existing.notes;
      document.getElementById('c-status').value  = existing.status;
      banner.classList.remove('show');
      toast('Client info loaded ✓', 'success');
    };
  } else {
    banner.classList.remove('show');
  }
}

function saveClient() {
  const clients = STORE.get('clients');
  const visits  = STORE.get('visits');

  const name    = document.getElementById('c-name').value.trim();
  const mobile  = document.getElementById('c-mobile').value.trim();
  const room    = document.getElementById('c-room').value.trim();
  const checkin = document.getElementById('c-checkin').value;
  const priceMode = document.getElementById('c-price-mode').value;
  const pricePerNight = parseInt(document.getElementById('c-price-night').value) || 0;
  const totalAmount   = parseInt(document.getElementById('c-total').value) || 0;

  if (!name || !mobile) { toast('Name & mobile required', 'error'); return; }

  let clientId = editClientId;

  const clientData = {
    name,
    mobile,
    idType:   document.getElementById('c-idtype').value,
    idNumber: document.getElementById('c-idnum').value.trim(),
    notes:    document.getElementById('c-notes').value.trim(),
    status:   document.getElementById('c-status').value,
    idImage:  capturedImageData,
  };

  if (editClientId) {
    const idx = clients.findIndex(c => c.id === editClientId);
    clients[idx] = { ...clients[idx], ...clientData };
    toast('Client updated ✓', 'success');
  } else {
    clientId = uid();
    clients.push({ id: clientId, ...clientData });
    toast('Client added ✓', 'success');
  }

  STORE.set('clients', clients);

  /* Add visit if room + checkin filled; else create a stub entry so client appears in history */
  if (room && checkin) {
    const newVisit = {
      id: uid(),
      clientId,
      clientName: name,
      room, checkin,
      checkout: '',
      priceMode,
      pricePerNight,
      totalAmount,
      status: 'active',
    };
    visits.push(newVisit);
    STORE.set('visits', visits);

    /* Mark room occupied */
    const rooms = STORE.get('rooms');
    const rIdx = rooms.findIndex(r => r.number === room);
    if (rIdx !== -1) rooms[rIdx].status = 'occupied';
    STORE.set('rooms', rooms);
  } else if (!editClientId) {
    /* New client with no check-in: create a stub visit so they appear in history */
    const stubVisit = {
      id: uid(),
      clientId,
      clientName: name,
      room: '',
      checkin: todayStr(),
      checkout: '',
      priceMode: 'preset',
      pricePerNight: 0,
      totalAmount: 0,
      status: 'registered',
    };
    visits.push(stubVisit);
    STORE.set('visits', visits);
  }

  closeModal('modal-client');
  renderClientsTable();
  renderDashboard();
  renderRoomsGrid();
  renderHistoryTable();
}

function deleteClient(clientId) {
  if (!confirm('Delete this client?')) return;
  STORE.set('clients', STORE.get('clients').filter(c => c.id !== clientId));
  closeModal('modal-client-detail');
  renderClientsTable();
  renderDashboard();
  toast('Client deleted', 'default');
}

/* ============================================================
   CLIENT DETAIL & HISTORY MODAL
   ============================================================ */
function showClientDetail(clientId) {
  const clients = STORE.get('clients');
  const visits  = STORE.get('visits');
  const c = clients.find(cl => cl.id === clientId);
  if (!c) return;

  const cVisits    = visits.filter(v => v.clientId === clientId).sort((a, b) => b.checkin.localeCompare(a.checkin));
  const totalSpent = cVisits.reduce((a, v) => a + (v.totalAmount || 0), 0);
  const activeVisit = cVisits.find(v => v.status === 'active');

  document.getElementById('cd-title').textContent = 'Client Profile';
  document.getElementById('cd-content').innerHTML = `
    <div class="client-header">
      <div class="client-avatar-lg">${initials(c.name)}</div>
      <div>
        <div class="client-name-big">${c.name}</div>
        <div class="client-tags">
          <span class="client-tag badge ${c.status}">${c.status}</span>
          ${activeVisit ? `<span class="client-tag badge occupied-b">In Rm ${activeVisit.room}</span>` : ''}
          <span class="client-tag" style="background:var(--card-purple);color:#5b21b6;font-size:10.5px;padding:2px 9px;border-radius:99px;font-weight:700;">${cVisits.length} visit${cVisits.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
    <div class="detail-rows" style="margin-bottom:16px;">
      <div class="detail-row"><span class="dr-label">Mobile</span><span class="dr-value">📱 ${c.mobile}</span></div>
      <div class="detail-row"><span class="dr-label">ID Type</span><span class="dr-value">${c.idType || '—'}</span></div>
      <div class="detail-row"><span class="dr-label">ID Number</span><span class="dr-value" style="font-family:monospace;">${c.idNumber || '—'}</span></div>
      <div class="detail-row"><span class="dr-label">Total Spent</span><span class="dr-value" style="color:#065f46;font-weight:800;font-family:'Nunito',sans-serif;">${fmtCur(totalSpent)}</span></div>
      ${c.notes ? `<div class="detail-row"><span class="dr-label">Notes</span><span class="dr-value">${c.notes}</span></div>` : ''}
    </div>
    ${c.idImage ? `
    <div style="margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;">Government ID</div>
      <img src="${c.idImage}" style="max-width:100%;max-height:200px;border-radius:12px;object-fit:cover;border:1.5px solid var(--border);cursor:zoom-in;transition:.2s;" onclick="openLightbox('${c.idImage}')" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform=''" alt="ID Document"/>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Tap to view full size</div>
    </div>` : '<div style="background:var(--bg2);border-radius:10px;padding:12px;text-align:center;margin-bottom:16px;font-size:12.5px;color:var(--text-muted);">📷 No ID image uploaded</div>'}
    ${cVisits.length > 0 ? `
    <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px;">Recent Visits</div>
    <div class="history-visits">
      ${cVisits.slice(0, 3).map(v => `<div class="visit-card">
        <div class="visit-card-top"><div class="visit-room">Room ${v.room || '—'}</div><div class="visit-amount">${fmtCur(v.totalAmount)}</div></div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div class="visit-dates">${fmtDate(v.checkin)}${v.checkout ? ' → ' + fmtDate(v.checkout) : ' (Active)'}</div>
          <span class="badge ${v.status === 'active' ? 'active' : 'checked-out'}">${v.status === 'active' ? 'Active' : 'Done'}</span>
        </div>
      </div>`).join('')}
    </div>` : ''}
    <div style="display:flex;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid var(--border-light);">
      <button class="btn btn-outline" style="flex:1;" onclick="closeModal('modal-client-detail');showClientHistory('${c.id}')">Full History</button>
      <button class="btn btn-dark" style="flex:1;" onclick="closeModal('modal-client-detail');editClient('${c.id}')">✏️ Edit</button>
    </div>
  `;
  openModal('modal-client-detail');
}

/* ─── PREMIUM TIMELINE HISTORY ─── */
function showClientHistory(clientId) {
  const clients = STORE.get('clients');
  const visits  = STORE.get('visits');
  const c = clients.find(cl => cl.id === clientId);
  if (!c) return;

  const cVisits    = visits.filter(v => v.clientId === clientId).sort((a, b) => b.checkin.localeCompare(a.checkin));
  const totalSpent = cVisits.reduce((a, v) => a + (v.totalAmount || 0), 0);
  const totalNights = cVisits.reduce((a, v) => a + (v.checkout ? (daysBetween(v.checkin, v.checkout) || 0) : 0), 0);

  document.getElementById('ch-client-name').textContent = c.name + ' — Visit History';
  document.getElementById('ch-client-info').innerHTML = `
    <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:14px;">
      <span style="font-size:11.5px;background:var(--card-blue);padding:4px 13px;border-radius:99px;color:#1e40af;font-weight:700;">📱 ${c.mobile}</span>
      <span style="font-size:11.5px;background:var(--card-green);padding:4px 13px;border-radius:99px;color:#065f46;font-weight:700;">${c.idType}</span>
      <span style="font-size:11.5px;background:var(--card-yellow);padding:4px 13px;border-radius:99px;color:#92400e;font-weight:700;">${cVisits.length} visit${cVisits.length !== 1 ? 's' : ''}</span>
      <span style="font-size:11.5px;background:var(--card-purple);padding:4px 13px;border-radius:99px;color:#5b21b6;font-weight:700;">${fmtCur(totalSpent)} total</span>
      ${totalNights > 0 ? `<span style="font-size:11.5px;background:var(--card-orange);padding:4px 13px;border-radius:99px;color:#9a3412;font-weight:700;">${totalNights} nights</span>` : ''}
    </div>
  `;

  const ch = document.getElementById('ch-visits');
  if (cVisits.length === 0) {
    ch.innerHTML = `<div class="empty-state"><div class="empty-icon">🕐</div><p>No visits recorded yet</p></div>`;
  } else {
    ch.innerHTML = `
      <div class="history-timeline">
        ${cVisits.map((v, i) => `
          <div class="timeline-item" style="animation-delay:${i*0.06}s">
            <div class="timeline-dot ${v.status === 'active' ? 'active' : ''}"></div>
            <div class="timeline-card">
              <div class="timeline-top">
                <div class="timeline-room">Room ${v.room || '—'}</div>
                <div class="timeline-amount">${fmtCur(v.totalAmount)}</div>
              </div>
              <div class="timeline-dates">${fmtDate(v.checkin)}${v.checkout ? ' → ' + fmtDate(v.checkout) : ' (Currently Active)'}</div>
              <div class="timeline-meta">
                <span class="badge ${v.status === 'active' ? 'active' : 'checked-out'}">${v.status === 'active' ? 'Active' : 'Completed'}</span>
                <span class="visit-price-type">${v.priceMode === 'custom' ? 'Custom' : 'Preset'} · ${fmtCur(v.pricePerNight)}/n</span>
                ${v.checkout ? `<span style="font-size:10.5px;color:var(--text-muted);">${daysBetween(v.checkin, v.checkout)} nights</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
  openModal('modal-client-history');
}

/* ============================================================
   REVENUE + LINE CHART
   ============================================================ */
let revFilter = 'today';
let revChartDays = 14;

function setRevFilter(f, el) {
  revFilter = f;
  document.querySelectorAll('.rev-filter').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('custom-range-inputs').classList.toggle('show', f === 'custom');

  /* Update chart range */
  revChartDays = f === 'today' ? 7 : f === '7days' ? 7 : f === '30days' ? 30 : 30;
  renderRevenue();
}

function renderRevenue() {
  const visits = STORE.get('visits');
  const today  = todayStr();
  const last7  = new Date(Date.now() - 7  * 864e5).toISOString().split('T')[0];
  const last30 = new Date(Date.now() - 30 * 864e5).toISOString().split('T')[0];

  let filtered = [];
  if (revFilter === 'today')     filtered = visits.filter(v => v.checkin === today);
  else if (revFilter === '7days')  filtered = visits.filter(v => v.checkin >= last7);
  else if (revFilter === '30days') filtered = visits.filter(v => v.checkin >= last30);
  else if (revFilter === 'custom') {
    const from = document.getElementById('rev-from').value;
    const to   = document.getElementById('rev-to').value;
    filtered = from && to ? visits.filter(v => v.checkin >= from && v.checkin <= to) : visits;
  }

  const totalRev     = filtered.reduce((a, v) => a + (v.totalAmount || 0), 0);
  const completedRev = filtered.filter(v => v.status === 'completed').reduce((a, v) => a + (v.totalAmount || 0), 0);
  const activeRev    = filtered.filter(v => v.status === 'active').reduce((a, v) => a + (v.totalAmount || 0), 0);

  /* Revenue cards */
  const rc = document.getElementById('rev-cards');
  rc.innerHTML = `
    <div class="rev-card">
      <div class="rev-card-label">Total Revenue</div>
      <div class="rev-card-value" id="rcv-total">₹0</div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">${filtered.length} visits</div>
    </div>
    <div class="rev-card" style="background:var(--card-green);border-color:#a7f3d0;">
      <div class="rev-card-label">Completed</div>
      <div class="rev-card-value" id="rcv-done">₹0</div>
      <div style="font-size:11px;color:#065f46;margin-top:4px;">${filtered.filter(v => v.status === 'completed').length} stays</div>
    </div>
    <div class="rev-card" style="background:var(--card-yellow);border-color:#fde68a;">
      <div class="rev-card-label">Active Stays</div>
      <div class="rev-card-value" id="rcv-active">₹0</div>
      <div style="font-size:11px;color:#92400e;margin-top:4px;">${filtered.filter(v => v.status === 'active').length} ongoing</div>
    </div>
  `;

  /* Animate numbers */
  animateNumber(document.getElementById('rcv-total'), totalRev, '₹');
  animateNumber(document.getElementById('rcv-done'), completedRev, '₹');
  animateNumber(document.getElementById('rcv-active'), activeRev, '₹');

  /* Line chart */
  requestAnimationFrame(() => {
    RevenueChart.render('revenue-chart', visits, revChartDays);
  });

  /* Table */
  const tw = document.getElementById('rev-table-wrap');
  if (filtered.length === 0) {
    tw.innerHTML = `<div class="empty-state"><div class="empty-icon">💰</div><p>No revenue data for selected period</p></div>`;
    return;
  }

  const sorted = filtered.slice().sort((a, b) => b.checkin.localeCompare(a.checkin));
  tw.innerHTML = `<table>
    <thead><tr><th>Client</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Nights</th><th>Rate</th><th>Amount</th><th>Status</th></tr></thead>
    <tbody>${sorted.map(v => `<tr onclick="showClientDetail('${v.clientId}')" style="cursor:pointer;">
      <td><strong>${v.clientName}</strong></td>
      <td>Rm ${v.room || '—'}</td>
      <td>${fmtDate(v.checkin)}</td>
      <td>${v.checkout ? fmtDate(v.checkout) : '<span style="color:var(--accent);font-weight:600;">Active</span>'}</td>
      <td style="font-size:12px;">${v.checkout ? daysBetween(v.checkin, v.checkout) : '—'}</td>
      <td style="font-size:12px;">${fmtCur(v.pricePerNight)}/n</td>
      <td style="font-weight:700;font-family:'Nunito',sans-serif;">${fmtCur(v.totalAmount)}</td>
      <td><span class="badge ${v.status === 'active' ? 'active' : 'checked-out'}">${v.status === 'active' ? 'Active' : 'Done'}</span></td>
    </tr>`).join('')}</tbody>
  </table>`;
}

/* ============================================================
   HISTORY TABLE
   ============================================================ */
function renderHistoryTable() {
  const visits  = STORE.get('visits');
  const clients = STORE.get('clients');
  const search  = document.getElementById('history-search').value.toLowerCase();

  const list = visits.filter(v =>
    v.clientName.toLowerCase().includes(search) ||
    (v.room || '').includes(search)
  ).sort((a, b) => b.checkin.localeCompare(a.checkin));

  const container = document.getElementById('history-table-container');
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🕐</div><p>No visit records found</p></div>`;
    return;
  }

  container.innerHTML = `<table>
    <thead><tr><th>Client</th><th>Room</th><th>Check-in</th><th>Check-out</th><th>Rate</th><th>Total</th><th>Status</th></tr></thead>
    <tbody>${list.map(v => {
      const c = clients.find(cl => cl.id === v.clientId);
      return `<tr>
        <td>
          <div class="history-client-row" onclick="showClientHistory('${v.clientId}')">
            <div style="width:30px;height:30px;border-radius:9px;background:var(--gold);display:flex;align-items:center;justify-content:center;font-size:12px;color:#111;font-weight:700;flex-shrink:0;">${initials(v.clientName)}</div>
            <strong>${v.clientName}</strong>
          </div>
        </td>
        <td>${v.room ? `Rm ${v.room}` : '—'}</td>
        <td>${fmtDate(v.checkin)}</td>
        <td>${v.checkout ? fmtDate(v.checkout) : '<span style="color:var(--accent);font-weight:600;">Active</span>'}</td>
        <td style="font-size:11.5px;">${fmtCur(v.pricePerNight)}/n</td>
        <td style="font-weight:700;font-family:'Nunito',sans-serif;">${fmtCur(v.totalAmount)}</td>
        <td><span class="badge ${v.status === 'active' ? 'occupied-b' : v.status === 'registered' ? 'inactive' : 'checked-out'}">${v.status === 'active' ? 'Active' : v.status === 'registered' ? 'Registered' : 'Completed'}</span></td>
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}

/* ============================================================
   ID IMAGE UPLOAD
   ============================================================ */
function triggerUpload() { document.getElementById('id-file-input').click(); }

function clearImage() {
  capturedImageData = '';
  document.getElementById('id-preview').style.display = 'none';
  document.getElementById('upload-area').classList.remove('has-image');
  document.getElementById('upload-area').querySelector('.upload-icon').textContent = '📎';
  document.getElementById('clear-img-btn').style.display = 'none';
  document.getElementById('id-file-input').value = '';
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('Image too large (max 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    capturedImageData = ev.target.result;
    const prev = document.getElementById('id-preview');
    prev.src = capturedImageData;
    prev.style.display = 'block';
    document.getElementById('upload-area').classList.add('has-image');
    document.getElementById('upload-area').querySelector('.upload-icon').textContent = '✅';
    document.getElementById('clear-img-btn').style.display = 'inline-flex';
    toast('Image selected ✓', 'success');
  };
  reader.readAsDataURL(file);
}

/* ─── Camera ─── */
let videoStream = null;

function openCamera() {
  if (!navigator.mediaDevices) { toast('Camera not supported', 'error'); return; }
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    .then(stream => {
      videoStream = stream;
      document.getElementById('camera-video').srcObject = stream;
      openModal('modal-camera');
    })
    .catch(() => toast('Camera access denied', 'error'));
}

function capturePhoto() {
  const video  = document.getElementById('camera-video');
  const canvas = document.getElementById('camera-canvas');
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  capturedImageData = canvas.toDataURL('image/jpeg', 0.85);
  const prev = document.getElementById('id-preview');
  prev.src = capturedImageData;
  prev.style.display = 'block';
  document.getElementById('upload-area').classList.add('has-image');
  document.getElementById('upload-area').querySelector('.upload-icon').textContent = '✅';
  document.getElementById('clear-img-btn').style.display = 'inline-flex';
  stopCamera();
  toast('Photo captured ✓', 'success');
}

function stopCamera() {
  if (videoStream) videoStream.getTracks().forEach(t => t.stop());
  videoStream = null;
  closeModal('modal-camera');
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('id-lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('id-lightbox').classList.remove('open');
}

/* ============================================================
   CHECKOUT MODAL
   ============================================================ */
function openCheckout(visitId) {
  const visits = STORE.get('visits');
  const v = visits.find(x => x.id === visitId);
  if (!v) return;
  document.getElementById('co-client-name').textContent = v.clientName;
  document.getElementById('co-room').textContent = 'Room ' + v.room;
  document.getElementById('co-checkin').textContent = fmtDate(v.checkin);
  document.getElementById('co-total').textContent = fmtCur(v.totalAmount);
  document.getElementById('co-confirm-btn').onclick = () => doCheckout(visitId);
  openModal('modal-checkout');
}

function doCheckout(visitId) {
  const visits = STORE.get('visits');
  const rooms  = STORE.get('rooms');
  const idx = visits.findIndex(v => v.id === visitId);
  if (idx === -1) return;

  visits[idx].status   = 'completed';
  visits[idx].checkout = todayStr();
  STORE.set('visits', visits);

  const rIdx = rooms.findIndex(r => r.number === visits[idx].room);
  if (rIdx !== -1) rooms[rIdx].status = 'free';
  STORE.set('rooms', rooms);

  closeModal('modal-checkout');
  renderDashboard();
  renderRoomsGrid();
  renderHistoryTable();
  toast('Checked out ✓', 'success');
}

/* ============================================================
   PWA
   ============================================================ */
const manifestData = {
  name: 'RoomAdmin Dashboard',
  short_name: 'RoomAdmin',
  description: 'Private Room & Client Management',
  start_url: '/',
  display: 'standalone',
  background_color: '#f6f2ec',
  theme_color: '#111111',
  icons: [{ src: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%23111'/><text y='.9em' font-size='70' x='15'>🏨</text></svg>`, sizes: '192x192', type: 'image/svg+xml' }],
};

const blob = new Blob([JSON.stringify(manifestData)], { type: 'application/json' });
const manifestURL = URL.createObjectURL(blob);
const lnk = document.createElement('link');
lnk.rel = 'manifest';
lnk.href = manifestURL;
document.head.appendChild(lnk);

if ('serviceWorker' in navigator) {
  const swCode = `
    const CACHE='roomadmin-v3';
    self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/']))));
    self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>new Response('Offline')))));
  `;
  const swBlob = new Blob([swCode], { type: 'text/javascript' });
  const swURL  = URL.createObjectURL(swBlob);
  navigator.serviceWorker.register(swURL).catch(() => {});
}
