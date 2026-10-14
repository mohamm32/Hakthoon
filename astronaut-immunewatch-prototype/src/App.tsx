import { useState, type FormEvent } from 'react'

type Astronaut = {
  id: string
  name: string
  mission: string
}

type Result = {
  id: number
  astronaut: string
  test: string
  value: number
  date: string
  unit: string
}

type AlertItem = {
  id: number
  astronaut: string
  title: string
  reason: string
  level: string
  reviewed: boolean
}

const astronauts: Astronaut[] = [
  { id: 'AST-001', name: 'Alex Morgan', mission: 'ISS Expedition 2026' },
  { id: 'AST-002', name: 'Sarah Chen', mission: 'Artemis Demo' },
  { id: 'AST-003', name: 'Jordan Lee', mission: 'ISS Expedition 2026' },
]

const initialResults: Result[] = [
  { id: 1, astronaut: 'AST-001', test: 'Demo Immune Marker', value: 12.1, date: '2026-10-08', unit: 'units' },
  { id: 2, astronaut: 'AST-001', test: 'Demo Immune Marker', value: 12.3, date: '2026-10-10', unit: 'units' },
  { id: 3, astronaut: 'AST-001', test: 'Demo Immune Marker', value: 12.2, date: '2026-10-12', unit: 'units' },
  { id: 4, astronaut: 'AST-002', test: 'Demo Immune Marker', value: 17.8, date: '2026-10-12', unit: 'units' },
  { id: 5, astronaut: 'AST-002', test: 'Demo Immune Marker', value: 18.2, date: '2026-10-14', unit: 'units' },
  { id: 6, astronaut: 'AST-003', test: 'Demo Immune Marker', value: 11.7, date: '2026-10-14', unit: 'units' },
]

const initialAlerts: AlertItem[] = [
  { id: 1, astronaut: 'AST-002', title: 'Repeated demo trend change', reason: 'Two consecutive synthetic measurements differ from the illustrative baseline.', level: 'Review', reviewed: false },
  { id: 2, astronaut: 'AST-003', title: 'Insufficient baseline', reason: 'Only one compatible measurement is available.', level: 'Info', reviewed: false },
]

const navItems = [
  ['Dashboard', '▦'],
  ['Astronauts', '♙'],
  ['Test Results', '▤'],
  ['Trends', '⌁'],
  ['Alert Center', '⚑'],
  ['Daily Check-in', '＋'],
  ['Audit Log', '≡'],
  ['Limitations', 'ⓘ'],
]

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [results, setResults] = useState(initialResults)
  const [alerts, setAlerts] = useState(initialAlerts)
  const [selected, setSelected] = useState('AST-001')
  const [notice, setNotice] = useState('')
  const [audit, setAudit] = useState<string[]>(['Prototype initialized', 'Synthetic demonstration data loaded'])
  const [checkin, setCheckin] = useState({ astronaut: 'AST-001', sleep: '8', fatigue: '2', symptoms: 'None' })
  const [form, setForm] = useState({
    astronaut: 'AST-001',
    test: 'Demo Immune Marker',
    value: '',
    date: '2026-10-14',
    unit: 'units',
  })

  const selectedAstronaut = astronauts.find(a => a.id === selected) ?? astronauts[0]
  const openAlerts = alerts.filter(a => !a.reviewed).length
  const selectedResults = results
    .filter(r => r.astronaut === selected)
    .sort((a, b) => a.date.localeCompare(b.date))

  function notify(message: string) {
    setNotice(message)
    setAudit(prev => [`${new Date().toLocaleTimeString()} — ${message}`, ...prev])
  }

  function loadScenario(name: string) {
    if (name === 'Stable') {
      setResults([
        { id: 101, astronaut: 'AST-001', test: 'Demo Immune Marker', value: 12.1, date: '2026-10-08', unit: 'units' },
        { id: 102, astronaut: 'AST-001', test: 'Demo Immune Marker', value: 12.3, date: '2026-10-10', unit: 'units' },
        { id: 103, astronaut: 'AST-001', test: 'Demo Immune Marker', value: 12.2, date: '2026-10-12', unit: 'units' },
      ])
      setAlerts([])
      setSelected('AST-001')
    } else if (name === 'Change') {
      setResults([
        { id: 201, astronaut: 'AST-002', test: 'Demo Immune Marker', value: 12, date: '2026-10-08', unit: 'units' },
        { id: 202, astronaut: 'AST-002', test: 'Demo Immune Marker', value: 17.8, date: '2026-10-12', unit: 'units' },
        { id: 203, astronaut: 'AST-002', test: 'Demo Immune Marker', value: 18.2, date: '2026-10-14', unit: 'units' },
      ])
      setAlerts([{ id: 201, astronaut: 'AST-002', title: 'Repeated demo trend change', reason: 'Two consecutive synthetic measurements differ from the illustrative baseline.', level: 'Review', reviewed: false }])
      setSelected('AST-002')
    } else if (name === 'Quality') {
      setAlerts([{ id: 301, astronaut: 'AST-001', title: 'Data quality issue', reason: 'Verify sample units and assay method before comparing results.', level: 'Warning', reviewed: false }])
    } else if (name === 'Symptoms') {
      setAlerts([{ id: 401, astronaut: 'AST-002', title: 'Symptom review', reason: 'Synthetic symptoms were recorded. Follow the demonstration review workflow.', level: 'Review', reviewed: false }])
    } else {
      setResults([{ id: 501, astronaut: 'AST-003', test: 'Demo Immune Marker', value: 11.7, date: '2026-10-14', unit: 'units' }])
      setAlerts([{ id: 501, astronaut: 'AST-003', title: 'Insufficient baseline', reason: 'Baseline unavailable — insufficient comparable data.', level: 'Info', reviewed: false }])
      setSelected('AST-003')
    }
    notify(`${name} demonstration scenario loaded`)
    setPage('Dashboard')
  }

  function addResult(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = Number(form.value)
    if (!form.value.trim() || !Number.isFinite(value) || !form.date || !form.test.trim()) {
      notify('Please enter a valid value, test name and date.')
      return
    }

    const matching = results.filter(r => r.astronaut === form.astronaut)
    const incompatible = matching.some(r => r.test === form.test && r.unit !== form.unit)

    const item: Result = { ...form, id: Date.now(), value }
    setResults(prev => [...prev, item])

    if (incompatible) {
      setAlerts(prev => [{
        id: Date.now(),
        astronaut: form.astronaut,
        title: 'Data compatibility requires review',
        reason: 'The unit differs from a previous result. Do not compare these measurements directly.',
        level: 'Warning',
        reviewed: false,
      }, ...prev])
    } else if (matching.length < 2) {
      setAlerts(prev => [{
        id: Date.now(),
        astronaut: form.astronaut,
        title: 'Baseline may be insufficient',
        reason: 'More compatible historical measurements may be required before establishing a personal baseline.',
        level: 'Info',
        reviewed: false,
      }, ...prev])
    }

    setSelected(form.astronaut)
    setForm(prev => ({ ...prev, value: '' }))
    notify('Synthetic result saved in this session')
    setPage('Test Results')
  }

  function reviewAlert(id: number) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, reviewed: true } : a))
    notify(`Alert ${id} marked reviewed`)
  }

  function saveCheckin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    notify(`Demo check-in saved for ${checkin.astronaut}`)
    setPage('Dashboard')
  }

  function renderPage() {
    switch (page) {
      case 'Dashboard':
        return <>
          <div className="stats-grid">
            <Stat icon="♙" label="Astronauts monitored" value="03" note="Synthetic profiles" />
            <Stat icon="✓" label="Test measurements" value={String(results.length).padStart(2, '0')} note="Current session" />
            <Stat icon="⚑" label="Open alerts" value={String(openAlerts).padStart(2, '0')} note="Requires demo review" />
            <Stat icon="⌁" label="Baseline profiles" value={String(astronauts.filter(a => results.filter(r => r.astronaut === a.id).length >= 2).length).padStart(2, '0')} note="Based on available counts" />
          </div>

          <div className="two-column">
            <div className="panel">
              <PanelTitle title="Immune monitoring overview" subtitle="Illustrative trend for the selected astronaut" />
              <div className="filter-row">
                <label>Profile
                  <select value={selected} onChange={e => setSelected(e.target.value)}>
                    {astronauts.map(a => <option key={a.id} value={a.id}>{a.id}</option>)}
                  </select>
                </label>
                <span className="soft-badge">DEMO TREND</span>
              </div>
              <TrendChart data={selectedResults} />
              {selectedResults.length < 2 && <p className="muted">Insufficient baseline — insufficient comparable data.</p>}
              <p className="chart-note">Values are synthetic. This chart does not indicate clinical risk.</p>
            </div>

            <div className="panel">
              <PanelTitle title="Scenario lab" subtitle="Load one of five demo cases" />
              <div className="scenario-list">
                {[
                  ['Stable', 'Stable measurements', '✓'],
                  ['Change', 'Repeated trend change', '↗'],
                  ['Quality', 'Data quality problem', '⚠'],
                  ['Symptoms', 'Symptoms for review', '＋'],
                  ['Baseline', 'Insufficient baseline', '?'],
                ].map(([id, label, icon]) => (
                  <button className="scenario-item" key={id} onClick={() => loadScenario(id)}>
                    <span className="scenario-icon">{icon}</span>
                    <span><strong>{label}</strong><small>{id === 'Stable' ? 'No alert in this scenario' : 'Explore the demo workflow'}</small></span>
                    <b>›</b>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <PanelTitle title="Recent alerts" subtitle="Explainable demonstration alerts" action={<button className="link-button" onClick={() => setPage('Alert Center')}>View all →</button>} />
            <AlertsTable alerts={alerts.filter(a => !a.reviewed).slice(0, 4)} onReview={reviewAlert} />
          </div>
        </>

      case 'Astronauts':
        return <div className="panel">
          <PanelTitle title="Astronaut profiles" subtitle="Select a profile to inspect recorded results" />
          <div className="profile-grid">
            {astronauts.map(a => {
              const count = results.filter(r => r.astronaut === a.id).length
              return <div className="profile-card" key={a.id}>
                <div className="profile-avatar">♙</div>
                <span className="soft-badge">{a.id}</span>
                <h3>{a.name}</h3><p>{a.mission}</p>
                <div className="profile-meta"><span>Measurements</span><strong>{count}</strong></div>
                <div className="profile-meta"><span>Baseline status</span><strong>{count >= 2 ? 'Count sufficient' : 'Insufficient'}</strong></div>
                <button className="secondary-button full-button" onClick={() => { setSelected(a.id); setPage('Profile Details') }}>View profile</button>
              </div>
            })}
          </div>
        </div>

      case 'Profile Details':
        return <div className="panel">
          <button className="link-button" onClick={() => setPage('Astronauts')}>← Back to profiles</button>
          <div className="profile-header"><div className="profile-avatar large">♙</div><div><span className="eyebrow">{selectedAstronaut.id}</span><h2>{selectedAstronaut.name}</h2><p>{selectedAstronaut.mission}</p></div></div>
          <PanelTitle title="Recorded measurements" subtitle="Synthetic data only" />
          <ResultsTable results={results.filter(r => r.astronaut === selected)} />
          <button className="primary-button" onClick={() => { setForm(prev => ({ ...prev, astronaut: selected })); setPage('Add Result') }}>＋ Add measurement</button>
        </div>

      case 'Test Results':
        return <div className="panel">
          <PanelTitle title="Laboratory results" subtitle="Synthetic measurements stored in this browser session" action={<button className="primary-button" onClick={() => setPage('Add Result')}>＋ Add result</button>} />
          <ResultsTable results={results} />
        </div>

      case 'Add Result':
        return <div className="panel form-panel">
          <PanelTitle title="Add test result" subtitle="Enter synthetic demonstration data" />
          <form className="data-form" onSubmit={addResult}>
            <label>Astronaut profile<select value={form.astronaut} onChange={e => setForm({ ...form, astronaut: e.target.value })}>{astronauts.map(a => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}</select></label>
            <label>Test name<input value={form.test} onChange={e => setForm({ ...form, test: e.target.value })} required /></label>
            <div className="form-row">
              <label>Numeric result<input type="number" step="any" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} required /></label>
              <label>Unit<select value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}><option>units</option><option>cells/mL</option><option>copies/mL</option><option>percent</option></select></label>
            </div>
            <label>Sample date<input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></label>
            <div className="info-box"><strong>Demo rule — not clinically validated</strong><p>Results are saved in browser memory only. No medical diagnosis is generated.</p></div>
            <div className="button-row"><button className="primary-button" type="submit">Save result</button><button className="secondary-button" type="button" onClick={() => setPage('Test Results')}>Cancel</button></div>
          </form>
        </div>

      case 'Trends':
        return <div className="panel">
          <PanelTitle title="Trend explorer" subtitle="Review the measurements for an astronaut" />
          <div className="filter-row"><label>Astronaut<select value={selected} onChange={e => setSelected(e.target.value)}>{astronauts.map(a => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}</select></label></div>
          <TrendChart data={selectedResults} />
          <ResultsTable results={selectedResults} />
          {selectedResults.length < 2 && <div className="info-box">Baseline unavailable — insufficient comparable data.</div>}
          <p className="chart-note">No clinically validated thresholds are applied.</p>
        </div>

      case 'Alert Center':
        return <div className="panel">
          <PanelTitle title="Alert center" subtitle="Inspect evidence, limitations and review status" />
          {alerts.length === 0 ? <Empty text="No alerts in this scenario. Load another scenario from the Dashboard." /> : alerts.map(a => (
            <div className={`alert-card ${a.reviewed ? 'reviewed' : ''}`} key={a.id}>
              <div className="alert-top"><span className={`status ${a.level.toLowerCase()}`}>{a.reviewed ? 'Reviewed' : a.level}</span><small>{a.astronaut}</small></div>
              <h3>{a.title}</h3><p>{a.reason}</p>
              <div className="evidence-box"><strong>Evidence</strong><p>{a.reason}</p><strong>Limitations</strong><p>Demo rule only. This alert is not a diagnosis and has not been clinically validated.</p><strong>Next step</strong><p>Verify source data and follow the applicable human review protocol.</p></div>
              {!a.reviewed && <button className="secondary-button" onClick={() => reviewAlert(a.id)}>Mark as reviewed</button>}
            </div>
          ))}
        </div>

      case 'Daily Check-in':
        return <div className="panel form-panel">
          <PanelTitle title="Daily check-in" subtitle="Record a synthetic wellness entry" />
          <form className="data-form" onSubmit={saveCheckin}>
            <label>Astronaut<select value={checkin.astronaut} onChange={e => setCheckin({ ...checkin, astronaut: e.target.value })}>{astronauts.map(a => <option key={a.id} value={a.id}>{a.id} — {a.name}</option>)}</select></label>
            <label>Sleep (hours)<input type="number" min="0" max="24" step=".5" value={checkin.sleep} onChange={e => setCheckin({ ...checkin, sleep: e.target.value })} required /></label>
            <label>Fatigue score (0–10)<input type="number" min="0" max="10" value={checkin.fatigue} onChange={e => setCheckin({ ...checkin, fatigue: e.target.value })} required /></label>
            <label>Symptoms<select value={checkin.symptoms} onChange={e => setCheckin({ ...checkin, symptoms: e.target.value })}><option>None</option><option>Fatigue</option><option>Headache</option><option>Sleep disturbance</option><option>Other</option></select></label>
            <div className="info-box">This check-in is a UI demonstration. It is not an emergency assessment.</div>
            <button className="primary-button" type="submit">Save check-in</button>
          </form>
        </div>

      case 'Audit Log':
        return <div className="panel">
          <PanelTitle title="Audit log" subtitle="Current-session activity" />
          {audit.map((entry, i) => <div className="audit-row" key={`${entry}-${i}`}><span className="audit-dot" /><div><strong>{entry.split(' — ').slice(1).join(' — ') || entry}</strong><small>{entry.includes(' — ') ? entry.split(' — ')[0] : 'Session event'}</small></div></div>)}
          <p className="chart-note">Prototype audit entries are session-only and are not a persistent security-grade audit trail.</p>
        </div>

      case 'Limitations':
        return <div className="panel">
          <PanelTitle title="Scientific limitations" subtitle="Important boundaries of this prototype" />
          {[
            'Different immune indicators measure different biological processes.',
            'A change in a viral marker does not by itself establish illness.',
            'Sample quality, units and assay methods affect comparability.',
            'Synthetic data cannot establish clinical accuracy.',
            'The system cannot establish the cause of a detected change.',
            'Urgent symptoms require the appropriate medical protocol and human assessment.',
            'All numeric scenario rules are demonstration-only and not clinically validated.',
            'This prototype does not replace professional medical judgment.',
          ].map((item, i) => <div className="limitation-row" key={item}><span>{String(i + 1).padStart(2, '0')}</span><p>{item}</p></div>)}
        </div>

      default:
        return <Empty text="Choose a page from the navigation menu." />
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-icon">✦</div><div><strong>Astronaut<br />ImmuneWatch</strong><small>SPACE HEALTH MONITOR</small></div></div>
        <div className="mission-label">MISSION CONTROL <span>● LOCAL</span></div>
        <nav>{navItems.map(([label, icon]) => <button key={label} className={`nav-item ${page === label || (page === 'Profile Details' && label === 'Astronauts') ? 'active' : ''}`} onClick={() => setPage(label)}><span className="nav-icon">{icon}</span><span>{label}</span>{label === 'Alert Center' && openAlerts > 0 && <b className="nav-count">{openAlerts}</b>}</button>)}</nav>
        <div className="sidebar-bottom"><div className="user-avatar">MC</div><div><strong>Mission Crew</strong><small>Demo workspace</small></div></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> {page}</div><div className="topbar-right"><span className="connection"><i /> Local demo</span><div className="user-avatar">MC</div></div></header>
        <div className="demo-banner"><span>✦</span><strong>SYNTHETIC DEMONSTRATION DATA</strong><span>Not for clinical use</span></div>
        <section className="content">
          <div className="page-heading"><div><div className="eyebrow">ASTRONAUT HEALTH / 2026</div><h1>{page}</h1><p>Explainable immune-health trend monitoring for space missions.</p></div><button className="primary-button" onClick={() => setPage('Add Result')}>＋ Add test result</button></div>
          {notice && <div className="notice"><span>✓</span><p>{notice}</p><button onClick={() => setNotice('')}>×</button></div>}
          {renderPage()}
        </section>
        <footer>ASTRONAUT IMMUNEWATCH <span>•</span> LOCAL PROTOTYPE <span>•</span> NOT FOR CLINICAL USE</footer>
      </main>
    </div>
  )
}

function Stat({ icon, label, value, note }: { icon: string; label: string; value: string; note: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className="stat-icon">{icon}</span></div><strong className="stat-value">{value}</strong><small>{note}</small></div>
}

function PanelTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>
}

function ResultsTable({ results }: { results: Result[] }) {
  if (!results.length) return <Empty text="No results available for this profile." />
  return <div className="table-wrap"><table><thead><tr><th>SAMPLE DATE</th><th>ASTRONAUT</th><th>TEST</th><th>VALUE</th><th>SOURCE</th></tr></thead><tbody>{results.map(r => <tr key={r.id}><td>{r.date}</td><td>{r.astronaut}</td><td>{r.test}</td><td><strong>{r.value} {r.unit}</strong></td><td><span className="status info">Synthetic</span></td></tr>)}</tbody></table></div>
}

function AlertsTable({ alerts, onReview }: { alerts: AlertItem[]; onReview: (id: number) => void }) {
  if (!alerts.length) return <Empty text="No open alerts in this scenario." />
  return <div className="table-wrap"><table><thead><tr><th>ALERT</th><th>ASTRONAUT</th><th>PRIORITY</th><th>STATUS</th></tr></thead><tbody>{alerts.map(a => <tr key={a.id}><td><strong>{a.title}</strong><small>{a.reason}</small></td><td>{a.astronaut}</td><td><span className={`status ${a.level.toLowerCase()}`}>{a.level}</span></td><td><button className="link-button" onClick={() => onReview(a.id)}>Review →</button></td></tr>)}</tbody></table></div>
}

function TrendChart({ data }: { data: Result[] }) {
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  if (!sorted.length) return <Empty text="No measurements available to display." />

  const values = sorted.map(r => r.value)
  const min = Math.min(...values) - 2
  const max = Math.max(...values) + 2
  const span = max - min || 1
  const points = values.map((value, i) => {
    const x = sorted.length === 1 ? 50 : 35 + i * (530 / (sorted.length - 1))
    const y = 175 - ((value - min) / span) * 145
    return `${x},${y}`
  }).join(' ')

  return <div className="chart-container"><div className="chart-y-labels"><span>{max.toFixed(1)}</span><span>{((max + min) / 2).toFixed(1)}</span><span>{min.toFixed(1)}</span></div><svg className="trend-chart" viewBox="0 0 600 210" preserveAspectRatio="none" role="img" aria-label="Synthetic measurement trend">{[30, 102, 175].map(y => <line key={y} x1="20" y1={y} x2="580" y2={y} stroke="#e7edf5" strokeDasharray="5 5" />)}{sorted.length > 1 && <polyline points={points} fill="none" stroke="#2585e8" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}{points.split(' ').map((point, i) => { const [x, y] = point.split(','); return <circle key={sorted[i].id} cx={x} cy={y} r="5" fill="#fff" stroke="#2585e8" strokeWidth="3"><title>{sorted[i].date}: {sorted[i].value}</title></circle> })}</svg><div className="chart-dates">{sorted.map(r => <span key={r.id}>{r.date.slice(5)}</span>)}</div></div>
}

function Empty({ text }: { text: string }) {
  return <div className="empty-state"><span>▤</span><p>{text}</p></div>
}
