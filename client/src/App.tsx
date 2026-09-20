import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type Role = 'Student' | 'Admin' | 'Maintenance'

const roleDetails: Record<Role, { name: string; initials: string; description: string }> = {
  Student: { name: 'Arjun Kumar', initials: 'AK', description: 'Report campus issues and follow their progress.' },
  Admin: { name: 'Priya Shah', initials: 'PS', description: 'Manage reports, staff assignments, and campus insights.' },
  Maintenance: { name: 'Ravi Mehta', initials: 'RM', description: 'View assigned work and keep students updated.' },
}

function App() {
  const [role, setRole] = useState<Role | null>(null)
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    function handleUnwiredAction(event: MouseEvent) {
      const target = (event.target as HTMLElement).closest('button, a')
      if (!target || target.closest('.modal-backdrop') || target.closest('.notification-popover')) return
      const label = target.textContent?.replace(/\s+/g, ' ').trim()
      if (!label) return
      if (target.tagName === 'A') event.preventDefault()
      if (target.classList.contains('admin-profile')) setActionMessage('Profile menu opened')
      else if (target.classList.contains('details-button')) setActionMessage('Complaint details opened')
      else if (target.classList.contains('icon-button') && !target.closest('.main-content:not(.admin-content):not(.maintenance-content)')) setActionMessage('You have 3 new updates')
      else if (target.tagName === 'A' && label.includes('Maintenance staff')) setActionMessage('Maintenance staff directory opened')
      else if (target.tagName === 'A' && label.includes('Analytics')) setActionMessage('Analytics dashboard is ready for the next section')
      else if (target.tagName === 'A' && label.includes('Help center')) setActionMessage('Help center opened')
      else if (target.tagName === 'A' && label.includes('Notifications')) setActionMessage('Notifications opened')
      else if (target.tagName === 'A' && label.includes('Completed jobs')) setActionMessage('Completed jobs opened')
      else return
      window.setTimeout(() => setActionMessage(''), 2400)
    }
    document.addEventListener('click', handleUnwiredAction)
    return () => document.removeEventListener('click', handleUnwiredAction)
  }, [])

  return <>{!role ? <Login onLogin={setRole} /> : <Dashboard role={role} onSignOut={() => setRole(null)} />}{actionMessage && <div className="global-toast">✓ {actionMessage}</div>}</>
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [role, setRole] = useState<Role>('Student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onLogin(role)
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand"><span className="brand-mark">SC</span><strong>Smart Campus</strong></div>
        <div className="auth-message"><span className="banner-label">CAMPUS CARE</span><h1>A better campus starts with being heard.</h1><p>One clear place to report an issue, track its progress, and help your campus work better for everyone.</p><div className="auth-stat"><strong>2.3 days</strong><span>average response time this month</span></div></div>
        <div className="auth-shape shape-one"></div><div className="auth-shape shape-two"></div>
      </section>
      <section className="auth-card"><div className="auth-card-inner"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your campus</h2><p className="auth-intro">Choose your account type to continue.</p><div className="role-tabs" role="tablist">{(['Student', 'Admin', 'Maintenance'] as Role[]).map((item) => <button key={item} type="button" className={role === item ? 'selected' : ''} onClick={() => setRole(item)}>{item}</button>)}</div><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={`${role.toLowerCase()}@campus.edu`} required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required /></label><div className="form-options"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><a href="#forgot">Forgot password?</a></div><button className="login-button" type="submit">Sign in as {role} <span>→</span></button></form><p className="auth-note">New to the system? <a href="#register">Create an account</a></p></div></section>
    </main>
  )
}

function ReportForm({ onClose }: { onClose: () => void }) {
  const [photo, setPhoto] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <div className="modal-backdrop"><section className="report-modal success-modal"><button className="modal-close" onClick={onClose} aria-label="Close">×</button><div className="success-icon">✓</div><p className="eyebrow">REPORT RECEIVED</p><h2>Your issue is in the queue.</h2><p className="success-copy">Your complaint has been submitted successfully. The campus team will review it and update you as it moves forward.</p><div className="ticket-number"><span>Complaint ID</span><strong>SC-2026-0149</strong><b>Pending</b></div><button className="login-button" onClick={onClose}>Back to overview</button></section></div>
  }

  return <div className="modal-backdrop"><section className="report-modal"><div className="modal-heading"><div><p className="eyebrow">NEW COMPLAINT</p><h2>Report an issue</h2><p>Give us the details so the right team can act quickly.</p></div><button className="modal-close" onClick={onClose} aria-label="Close">×</button></div><form className="report-form" onSubmit={submit}><label className="photo-upload">{photo ? <img src={photo} alt="Selected issue" /> : <><span>＋</span><strong>Add a photo</strong><small>JPG or PNG, up to 5 MB</small></>}<input type="file" accept="image/png,image/jpeg" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }} />{photo && <button type="button" className="remove-photo" onClick={() => setPhoto(null)}>Remove photo</button>}</label><div className="form-grid"><label>Category<select required defaultValue=""><option value="" disabled>Select a category</option><option>Furniture</option><option>AC / Cooler</option><option>Electrical</option><option>Washroom</option><option>Cleanliness</option><option>Other</option></select></label><label>Building<select required defaultValue=""><option value="" disabled>Select building</option><option>Block A</option><option>Block B</option><option>Library</option><option>Sports Complex</option></select></label><label>Floor<select required defaultValue=""><option value="" disabled>Select floor</option><option>Ground Floor</option><option>1st Floor</option><option>2nd Floor</option><option>3rd Floor</option></select></label><label>Room / section<input required placeholder="e.g. Room 204 or East Wing" /></label></div><label className="description-label">Describe the issue<textarea required rows={4} placeholder="Tell us what happened and anything that may help the maintenance team..."></textarea></label><div className="form-actions"><button type="button" className="cancel-button" onClick={onClose}>Cancel</button><button type="submit" className="login-button">Submit complaint <span>→</span></button></div></form></section></div>
}

type AdminReport = { id: string; title: string; location: string; category: string; status: string; date: string; assignee: string }
const adminReports: AdminReport[] = [
  { id: 'SC-0148', title: 'Broken chair in lecture hall', location: 'Block A · 2nd Floor · Room 204', category: 'Furniture', status: 'In progress', date: 'Sep 16', assignee: 'Ravi Mehta' },
  { id: 'SC-0147', title: 'Flickering lights near staircase', location: 'Block B · Ground Floor · East Wing', category: 'Electrical', status: 'Pending', date: 'Sep 14', assignee: 'Unassigned' },
  { id: 'SC-0146', title: 'Water leakage in washroom', location: 'Block A · 1st Floor · North Wing', category: 'Washroom', status: 'Resolved', date: 'Sep 10', assignee: 'Vikram Singh' },
  { id: 'SC-0145', title: 'AC not cooling properly', location: 'Block C · 3rd Floor · Lab 301', category: 'AC / Cooler', status: 'Pending', date: 'Sep 09', assignee: 'Unassigned' },
]

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const [buildingFilter, setBuildingFilter] = useState('All buildings')
  const [assigned, setAssigned] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState('')
  const filteredReports = adminReports.filter((report) => (statusFilter === 'All statuses' || report.status === statusFilter) && (buildingFilter === 'All buildings' || report.location.startsWith(buildingFilter)))

  function assign(reportId: string, staff: string) {
    setAssigned((current) => ({ ...current, [reportId]: staff }))
    setNotice(`${reportId} assigned to ${staff}`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  return <div className="app-shell admin-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">SC</span><span>Smart Campus</span></div><div className="profile"><div className="avatar">PS</div><div><strong>Priya Shah</strong><small>Admin account</small></div><span className="chevron">⌄</span></div><nav><a className="active" href="#admin-overview"><span>▦</span> Dashboard</a><a href="#admin-reports"><span>◉</span> All complaints <b>18</b></a><a href="#staff"><span>♧</span> Maintenance staff</a><a href="#analytics"><span>◒</span> Analytics</a></nav><div className="sidebar-bottom"><a href="#help"><span>?</span> Help center</a><button className="sign-out" onClick={onSignOut}><span>↪</span> Sign out</button></div></aside><main className="main-content admin-content"><header className="topbar"><div><p className="eyebrow">ADMINISTRATION · MONDAY, 19 SEPTEMBER 2026</p><h1>Good morning, Priya.</h1><p className="subheading">Here is what needs your attention today.</p></div><div className="header-actions"><button className="icon-button" aria-label="Notifications">♢<i></i></button><button className="admin-profile">PS <span>⌄</span></button></div></header><section className="admin-intro"><div><p className="eyebrow">CAMPUS OPERATIONS</p><h2>Make every report count.</h2><p>Review new complaints, keep assignments moving, and give students visibility at every step.</p></div><div className="admin-date"><strong>18</strong><span>open complaints<br />need attention</span></div></section><div className="admin-stats"><article><span className="admin-stat-icon coral">◌</span><small>Total complaints</small><strong>148</strong><em>+12 this month</em></article><article><span className="admin-stat-icon amber">◷</span><small>Pending review</small><strong>18</strong><em className="orange">6 need assignment</em></article><article><span className="admin-stat-icon blue">♧</span><small>Assigned today</small><strong>7</strong><em>Across 4 teams</em></article><article><span className="admin-stat-icon green">✓</span><small>Resolved this month</small><strong>121</strong><em>81.7% resolution rate</em></article></div><section className="admin-table-panel"><div className="panel-heading"><div><p className="eyebrow">WORK QUEUE</p><h2>Complaints to manage</h2></div><span className="queue-count">{filteredReports.length} of {adminReports.length} shown</span></div><div className="admin-filters"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>Pending</option><option>In progress</option><option>Resolved</option></select><select value={buildingFilter} onChange={(event) => setBuildingFilter(event.target.value)}><option>All buildings</option><option>Block A</option><option>Block B</option><option>Block C</option></select><button className="filter-button">More filters <span>⌄</span></button></div><div className="admin-table"><div className="admin-table-head"><span>Complaint</span><span>Location</span><span>Category</span><span>Status</span><span>Assignment</span></div>{filteredReports.map((report) => <div className="admin-table-row" key={report.id}><div className="admin-complaint"><span className={`issue-dot ${report.category === 'Electrical' ? 'electrical' : report.status === 'Resolved' ? 'resolved' : 'furniture'}`}>{report.category === 'Electrical' ? 'ϟ' : report.status === 'Resolved' ? '✓' : '▰'}</span><div><strong>{report.title}</strong><small>{report.id} · {report.date}</small></div></div><span className="table-location">{report.location}</span><span className="table-category">{report.category}</span><span className={`status ${report.status === 'Resolved' ? 'resolved' : report.status === 'Pending' ? 'pending' : 'in-progress'}`}>{report.status}</span><select className="assign-select" value={assigned[report.id] || report.assignee} onChange={(event) => assign(report.id, event.target.value)}><option>Unassigned</option><option>Ravi Mehta</option><option>Vikram Singh</option><option>Neha Joshi</option></select></div>)}</div>{filteredReports.length === 0 && <p className="empty-queue">No complaints match these filters.</p>}</section>{notice && <div className="admin-toast">✓ {notice}</div>}</main></div>
}

type MaintenanceJob = { id: string; title: string; location: string; category: string; priority: string; status: string; due: string }
const maintenanceJobs: MaintenanceJob[] = [
  { id: 'SC-0148', title: 'Broken chair in lecture hall', location: 'Block A · 2nd Floor · Room 204', category: 'Furniture', priority: 'High', status: 'In progress', due: 'Today' },
  { id: 'SC-0147', title: 'Flickering lights near staircase', location: 'Block B · Ground Floor · East Wing', category: 'Electrical', priority: 'Medium', status: 'Assigned', due: 'Tomorrow' },
  { id: 'SC-0145', title: 'AC not cooling properly', location: 'Block C · 3rd Floor · Lab 301', category: 'AC / Cooler', priority: 'High', status: 'Assigned', due: 'Sep 22' },
]

function MaintenanceDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [jobs, setJobs] = useState(maintenanceJobs)
  const [selectedJob, setSelectedJob] = useState<MaintenanceJob | null>(null)
  const [note, setNote] = useState('')
  const [notice, setNotice] = useState('')

  function updateStatus(jobId: string, status: string) {
    setJobs((current) => current.map((job) => job.id === jobId ? { ...job, status } : job))
    setNotice(`${jobId} marked ${status.toLowerCase()}`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function saveNote() {
    if (!selectedJob) return
    setNotice(`Note saved for ${selectedJob.id}`)
    setSelectedJob(null)
    setNote('')
    window.setTimeout(() => setNotice(''), 2600)
  }

  return <div className="app-shell maintenance-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">SC</span><span>Smart Campus</span></div><div className="profile"><div className="avatar">RM</div><div><strong>Ravi Mehta</strong><small>Maintenance account</small></div><span className="chevron">⌄</span></div><nav><a className="active" href="#work"><span>▦</span> My work</a><a href="#completed"><span>✓</span> Completed jobs <b>24</b></a><a href="#notifications"><span>♢</span> Notifications</a></nav><div className="sidebar-bottom"><a href="#help"><span>?</span> Help center</a><button className="sign-out" onClick={onSignOut}><span>↪</span> Sign out</button></div></aside><main className="main-content maintenance-content"><header className="topbar"><div><p className="eyebrow">MAINTENANCE TEAM · MONDAY, 19 SEPTEMBER 2026</p><h1>Good morning, Ravi.</h1><p className="subheading">Here are the issues assigned to you.</p></div><div className="header-actions"><button className="icon-button" aria-label="Notifications">♢<i></i></button><button className="admin-profile">RM <span>⌄</span></button></div></header><section className="maintenance-banner"><div><p className="eyebrow">TODAY'S FOCUS</p><h2>Small fixes make a big difference.</h2><p>Keep students informed by updating your work as you move through each job.</p></div><div className="work-progress"><strong>{jobs.filter((job) => job.status === 'Resolved').length}</strong><span>of {jobs.length}<br />jobs complete</span></div></section><div className="maintenance-stats"><article><span className="admin-stat-icon amber">◷</span><small>Assigned to me</small><strong>{jobs.length}</strong><em>Active work orders</em></article><article><span className="admin-stat-icon coral">!</span><small>High priority</small><strong>{jobs.filter((job) => job.priority === 'High').length}</strong><em className="orange">Needs attention today</em></article><article><span className="admin-stat-icon green">✓</span><small>Completed this month</small><strong>24</strong><em>+5 from last month</em></article></div><section className="jobs-panel"><div className="panel-heading"><div><p className="eyebrow">MY WORK QUEUE</p><h2>Assigned complaints</h2></div><span className="queue-count">{jobs.length} active jobs</span></div><div className="job-list">{jobs.map((job) => <article className="job-card" key={job.id}><div className="job-card-top"><div className="job-title"><span className={`issue-dot ${job.category === 'Electrical' ? 'electrical' : 'furniture'}`}>{job.category === 'Electrical' ? 'ϟ' : '▰'}</span><div><strong>{job.title}</strong><small>{job.id} · Reported Sep 16 by Arjun Kumar</small></div></div><span className={`priority ${job.priority.toLowerCase()}`}>{job.priority} priority</span></div><div className="job-info"><span>⌖ {job.location}</span><span>▣ {job.category}</span><span>Due: <b>{job.due}</b></span></div><div className="job-actions"><select value={job.status} onChange={(event) => updateStatus(job.id, event.target.value)}><option>Assigned</option><option>In progress</option><option>Resolved</option></select><button className="note-button" onClick={() => setSelectedJob(job)}>＋ Add resolution note</button><button className="details-button">View details <span>→</span></button></div></article>)}</div></section>{notice && <div className="admin-toast">✓ {notice}</div>}{selectedJob && <div className="modal-backdrop"><section className="report-modal note-modal"><button className="modal-close" onClick={() => setSelectedJob(null)} aria-label="Close">×</button><p className="eyebrow">{selectedJob.id} · RESOLUTION NOTE</p><h2>What did you find?</h2><p>Add a short note so the admin and student understand the work completed.</p><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={5} placeholder="e.g. Replaced the damaged chair leg and tested it for stability..." /><button className="login-button" onClick={saveNote}>Save note <span>→</span></button></section></div>}</main></div>
}

type HistoryEvent = { title: string; detail: string; date: string; done: boolean; current?: boolean }

const complaintHistory: HistoryEvent[] = [
  { title: 'Complaint submitted', detail: 'Arjun Kumar reported this issue with a photo.', date: 'Sep 16, 10:24 AM', done: true },
  { title: 'Assigned to maintenance', detail: 'Ravi Mehta has been assigned to review the issue.', date: 'Sep 16, 2:10 PM', done: true },
  { title: 'Work in progress', detail: 'The maintenance team is currently working on it.', date: 'Sep 17, 9:05 AM', done: true, current: true },
  { title: 'Resolved', detail: 'The issue will appear here once the work is completed.', date: 'Waiting for update', done: false },
]

function Notifications({ onClose, onOpenHistory }: { onClose: () => void; onOpenHistory: () => void }) {
  const [read, setRead] = useState(false)
  return <div className="notification-popover"><div className="notification-head"><div><p className="eyebrow">UPDATES</p><h3>Notifications</h3></div><button onClick={() => setRead(true)}>{read ? 'All caught up' : 'Mark all read'}</button><button className="popover-close" onClick={onClose} aria-label="Close">×</button></div><div className="notification-item unread"><span className="notification-icon green">✓</span><div><strong>Complaint assigned</strong><p>SC-0148 was assigned to Ravi Mehta.</p><small>2 hours ago</small></div></div><button className="notification-item notification-action" onClick={onOpenHistory}><span className="notification-icon amber">◷</span><div><strong>Status updated</strong><p>Broken chair in lecture hall is now in progress.</p><small>Yesterday</small></div><span>→</span></button><div className={`notification-item ${read ? '' : 'unread'}`}><span className="notification-icon coral">♢</span><div><strong>Complaint received</strong><p>Your latest report is waiting for review.</p><small>Sep 16</small></div></div><button className="view-notifications" onClick={onOpenHistory}>View complaint timeline <span>→</span></button></div>
}

function StatusHistory({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop"><section className="report-modal history-modal"><button className="modal-close" onClick={onClose} aria-label="Close">×</button><p className="eyebrow">SC-0148 · STATUS HISTORY</p><h2>Broken chair in lecture hall</h2><p className="history-location">Block A · 2nd Floor · Room 204</p><div className="history-status"><span>Current status</span><strong>In progress</strong></div><div className="timeline">{complaintHistory.map((event) => <div className={`timeline-event ${event.done ? 'done' : ''} ${event.current ? 'current' : ''}`} key={event.title}><span className="timeline-dot">{event.done ? '✓' : ''}</span><div><strong>{event.title}</strong><p>{event.detail}</p><small>{event.date}</small></div></div>)}</div><button className="login-button" onClick={onClose}>Close timeline</button></section></div>
}

function Dashboard({ role, onSignOut }: { role: Role; onSignOut: () => void }) {
  const user = roleDetails[role]
  const [showReport, setShowReport] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showAllReports, setShowAllReports] = useState(false)
  if (role === 'Admin') return <AdminDashboard onSignOut={onSignOut} />
  if (role === 'Maintenance') return <MaintenanceDashboard onSignOut={onSignOut} />
  return (
    <>
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">SC</span><span>Smart Campus</span></div>
        <div className="profile"><div className="avatar">{user.initials}</div><div><strong>{user.name}</strong><small>{role} account</small></div><span className="chevron">⌄</span></div>
        <nav><a className="active" href="#overview"><span>▦</span> Overview</a><a href="#reports"><span>◉</span> {role === 'Student' ? 'My reports' : 'All reports'} <b>3</b></a><a href="#notifications"><span>♢</span> Notifications</a></nav>
        <div className="sidebar-bottom"><a href="#help"><span>?</span> Help center</a><button className="sign-out" onClick={onSignOut}><span>↪</span> Sign out</button></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div><p className="eyebrow">MONDAY, 19 SEPTEMBER 2026</p><h1>Good morning, {user.name.split(' ')[0]}.</h1><p className="subheading">{user.description}</p></div><div className="header-actions"><button className="icon-button" aria-label="Notifications" onClick={() => setShowNotifications((current) => !current)}>♢<i></i></button><button className="report-button" onClick={() => setShowReport(true)}>＋ Report an issue</button>{showNotifications && <Notifications onClose={() => setShowNotifications(false)} onOpenHistory={() => { setShowNotifications(false); setShowHistory(true) }} />}</div></header>
        <section className="welcome-banner"><div><span className="banner-label">CAMPUS CARE</span><h2>See something that needs attention?</h2><p>Report it in under a minute. Add a photo and exact location so the right team can act faster.</p><button className="banner-button" onClick={() => setShowReport(true)}>Start a new report <span>→</span></button></div><div className="banner-art" aria-hidden="true"><div className="sun"></div><div className="building building-one"></div><div className="building building-two"></div><div className="plant">✦</div></div></section>
        <section className="section-heading"><div><p className="eyebrow">YOUR ACTIVITY</p><h2>Issue overview</h2></div><button className="text-action" onClick={() => setShowAllReports(true)}>View all reports <span>→</span></button></section>
        <div className="stats-grid"><article className="stat-card"><span className="stat-icon coral">◌</span><p>Total reports</p><strong>{role === 'Student' ? '12' : '148'}</strong><small><em>+2</em> this month</small></article><article className="stat-card"><span className="stat-icon amber">◷</span><p>In progress</p><strong>{role === 'Student' ? '3' : '18'}</strong><small>Being looked into</small></article><article className="stat-card"><span className="stat-icon green">✓</span><p>Resolved</p><strong>{role === 'Student' ? '9' : '121'}</strong><small><em>75%</em> resolution rate</small></article><article className="stat-card response"><div className="ring"><span>2.3</span><small>days</small></div><div><p>Average response</p><small>Campus-wide this month</small></div></article></div>
        <section className="reports-panel" id="reports"><div className="panel-heading"><div><p className="eyebrow">RECENT ACTIVITY</p><h2>{showAllReports ? 'All your reports' : 'Your recent reports'}</h2></div><button className="filter-button" onClick={() => setShowAllReports((current) => !current)}>{showAllReports ? 'Recent reports' : 'All reports'} <span>⌄</span></button></div><div className="report-list"><button className="report-row report-row-button" onClick={() => setShowHistory(true)}><span className="issue-dot furniture">▰</span><div className="report-detail"><strong>Broken chair in lecture hall</strong><span>Block A · 2nd Floor · Room 204</span></div><span className="status in-progress">In progress</span><time>Sep 16</time><span className="row-arrow">›</span></button><div className="report-row"><span className="issue-dot electrical">ϟ</span><div className="report-detail"><strong>Flickering lights near staircase</strong><span>Block B · Ground Floor · East Wing</span></div><span className="status pending">Pending</span><time>Sep 14</time><span className="row-arrow">›</span></div><div className="report-row"><span className="issue-dot resolved">✓</span><div className="report-detail"><strong>Water leakage in washroom</strong><span>Block A · 1st Floor · North Wing</span></div><span className="status resolved">Resolved</span><time>Sep 10</time><span className="row-arrow">›</span></div>{showAllReports && <div className="report-row"><span className="issue-dot furniture">▰</span><div className="report-detail"><strong>Damaged desk in seminar room</strong><span>Block C · 1st Floor · Room 112</span></div><span className="status pending">Pending</span><time>Sep 04</time><span className="row-arrow">›</span></div>}</div></section>
      </main>
    </div>
    {showReport && <ReportForm onClose={() => setShowReport(false)} />}
    {showHistory && <StatusHistory onClose={() => setShowHistory(false)} />}
    </>
  )
}

export default App
