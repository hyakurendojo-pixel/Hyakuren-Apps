const tabs = document.querySelectorAll('.tab');
const views = document.querySelectorAll('.viewBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const appSection = document.getElementById('appSection');
const authSection = document.getElementById('authSection');
const scheduleList = document.getElementById('scheduleList');
const checkinClass = document.getElementById('checkinClass');
const logTable = document.getElementById('logTable');
const languageSelect = document.getElementById('languageSelect');

const classes = [
  'Special Karate with Sensei Rai',
  'Regular Karate',
  'Regular Aikido',
  'Extensive Karate',
  'Extensive Aikido'
];

const t = {
  EN: {
    appTitle: 'Hyakuren Dojo Administration',
    appSubtitle: 'Member: Hyakuren Juku • Instructor: Hyakuren Kyōshi',
    languageLabel: 'Language', tabLogin: 'Login', tabRegister: 'Register',
    loginHeader: 'Login', loginEmailLabel: 'Email', loginPasswordLabel: 'Password', loginRoleLabel: 'Role',
    loginButton: 'Login', registerHeader: 'Register', registerNameLabel: 'Full Name',
    registerEmailLabel: 'Email', registerPasswordLabel: 'Password', registerAttendanceLabel: 'Attendance Frequency',
    registerBloodTypeLabel: 'Blood Type', registerBackgroundLabel: 'Martial Arts Background (if any)',
    registerDesiredLabel: 'Desired Martial Art', registerRoleLabel: 'Role', registerButton: 'Create Account',
    navDashboard: 'Dashboard', navSchedule: 'Schedule', navCheckin: 'Check In', navLogs: 'Check-In Logs', logoutButton: 'Logout',
    dashboardTitle: 'Dashboard', scheduleTitle: 'Class Schedule', checkinTitle: 'Check In Class',
    checkinClassLabel: 'Class', checkinDateLabel: 'Date', checkinButton: 'Submit Check-In', logsTitle: 'Log Report for Check-In',
    logNameHeader: 'Name', logRoleHeader: 'Role', logClassHeader: 'Class', logDateHeader: 'Date'
  },
  ID: {
    appTitle: 'Administrasi Dojo Hyakuren',
    appSubtitle: 'Anggota: Hyakuren Juku • Instruktur: Hyakuren Kyōshi',
    languageLabel: 'Bahasa', tabLogin: 'Masuk', tabRegister: 'Daftar',
    loginHeader: 'Masuk', loginEmailLabel: 'Email', loginPasswordLabel: 'Kata Sandi', loginRoleLabel: 'Peran',
    loginButton: 'Masuk', registerHeader: 'Daftar', registerNameLabel: 'Nama Lengkap',
    registerEmailLabel: 'Email', registerPasswordLabel: 'Kata Sandi', registerAttendanceLabel: 'Frekuensi Kehadiran',
    registerBloodTypeLabel: 'Golongan Darah', registerBackgroundLabel: 'Latar Belakang Bela Diri (jika ada)',
    registerDesiredLabel: 'Bela Diri yang Diinginkan', registerRoleLabel: 'Peran', registerButton: 'Buat Akun',
    navDashboard: 'Dasbor', navSchedule: 'Jadwal', navCheckin: 'Check In', navLogs: 'Log Kehadiran', logoutButton: 'Keluar',
    dashboardTitle: 'Dasbor', scheduleTitle: 'Jadwal Kelas', checkinTitle: 'Check In Kelas',
    checkinClassLabel: 'Kelas', checkinDateLabel: 'Tanggal', checkinButton: 'Kirim Check-In', logsTitle: 'Laporan Log Check-In',
    logNameHeader: 'Nama', logRoleHeader: 'Peran', logClassHeader: 'Kelas', logDateHeader: 'Tanggal'
  },
  JP: {
    appTitle: '百蓮道場 管理アプリ',
    appSubtitle: '会員: Hyakuren Juku • 指導者: Hyakuren Kyōshi',
    languageLabel: '言語', tabLogin: 'ログイン', tabRegister: '登録',
    loginHeader: 'ログイン', loginEmailLabel: 'メール', loginPasswordLabel: 'パスワード', loginRoleLabel: '役割',
    loginButton: 'ログイン', registerHeader: '登録', registerNameLabel: '氏名',
    registerEmailLabel: 'メール', registerPasswordLabel: 'パスワード', registerAttendanceLabel: '出席頻度',
    registerBloodTypeLabel: '血液型', registerBackgroundLabel: '武道経験（あれば）',
    registerDesiredLabel: '希望武道', registerRoleLabel: '役割', registerButton: 'アカウント作成',
    navDashboard: 'ダッシュボード', navSchedule: 'スケジュール', navCheckin: 'チェックイン', navLogs: 'チェックイン記録', logoutButton: 'ログアウト',
    dashboardTitle: 'ダッシュボード', scheduleTitle: 'クラス予定', checkinTitle: 'クラスチェックイン',
    checkinClassLabel: 'クラス', checkinDateLabel: '日付', checkinButton: 'チェックイン送信', logsTitle: 'チェックイン記録レポート',
    logNameHeader: '氏名', logRoleHeader: '役割', logClassHeader: 'クラス', logDateHeader: '日付'
  }
};

const users = JSON.parse(localStorage.getItem('users') || '[]');
const logs = JSON.parse(localStorage.getItem('logs') || '[]');
let currentUser = null;

function saveData() {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('logs', JSON.stringify(logs));
}

function renderSchedule() {
  scheduleList.innerHTML = '';
  checkinClass.innerHTML = '';
  classes.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    scheduleList.appendChild(li);
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    checkinClass.appendChild(option);
  });
}

function renderLogs() {
  logTable.innerHTML = '';
  logs.forEach((log) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${log.name}</td><td>${log.role}</td><td>${log.className}</td><td>${log.date}</td>`;
    logTable.appendChild(row);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

function setLanguage(lang) {
  Object.entries(t[lang]).forEach(([id, value]) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  });
}

function enterApp(user) {
  currentUser = user;
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  document.getElementById('welcomeMessage').textContent = `Welcome ${user.name} (${user.role})`;
  document.getElementById('memberInfo').innerHTML = `
    <li>Email: ${user.email}</li>
    <li>Attendance: ${user.attendance}</li>
    <li>Blood Type: ${user.bloodType}</li>
    <li>Background: ${user.background || '-'}</li>
    <li>Desired Martial Art: ${user.desired}</li>
  `;
}

tabs.forEach((tab) => tab.addEventListener('click', () => {
  tabs.forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.tabContent').forEach((form) => form.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(`${tab.dataset.tab}Form`).classList.add('active');
}));

views.forEach((btn) => btn.addEventListener('click', () => {
  views.forEach((v) => v.classList.remove('active'));
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(btn.dataset.view).classList.add('active');
}));

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = {
    name: registerName.value,
    email: registerEmail.value,
    password: registerPassword.value,
    attendance: registerAttendance.value,
    bloodType: registerBloodType.value,
    background: registerBackground.value,
    desired: registerDesired.value,
    role: registerRole.value
  };

  if (users.find((u) => u.email === user.email)) return showToast('Email already exists');
  users.push(user);
  saveData();
  registerForm.reset();
  showToast('Registration successful');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = users.find((u) => u.email === loginEmail.value && u.password === loginPassword.value && u.role === loginRole.value);
  if (!user) return showToast('Invalid login data');
  enterApp(user);
  showToast('Logged in');
});

document.getElementById('checkinForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentUser) return;
  logs.push({
    name: currentUser.name,
    role: currentUser.role,
    className: checkinClass.value,
    date: checkinDate.value
  });
  saveData();
  renderLogs();
  showToast('Check-in submitted');
});

document.getElementById('logoutButton').addEventListener('click', () => {
  currentUser = null;
  appSection.classList.add('hidden');
  authSection.classList.remove('hidden');
  showToast('Logged out');
});

languageSelect.addEventListener('change', (e) => setLanguage(e.target.value));

renderSchedule();
renderLogs();
setLanguage('EN');
