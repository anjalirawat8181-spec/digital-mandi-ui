import { useMemo, useState, type FormEvent } from "react";
import BidActivityCard from "../../components/BidActivityCard";
import { formatWeight } from "../../utils/format";
import { useLots } from "../../hooks/useLots";
import type { Lot } from "../../types";

type HubFilter = "All hubs" | "Karbi Hub" | "East Hub";

function matchesHub(lot: Lot, hub: HubFilter) {
  if (hub === "All hubs") return true;
  return hub === "Karbi Hub"
    ? lot.destination.toLowerCase().includes("karbi")
    : lot.destination.toLowerCase().includes("east");
}

function HubLotCard({
  lot,
  column,
  onArrive,
  onVerify,
}: {
  lot: Lot;
  column: "transit" | "check" | "stored";
  onArrive: (lot: Lot) => void;
  onVerify: (lot: Lot, weightKg: number, grade: string) => void;
}) {
  const [checkedWeight, setCheckedWeight] = useState(String(lot.hubWeightKg ?? lot.weightKg));
  const [grade, setGrade] = useState(lot.grade === "Pending" ? "A" : lot.grade);
  const [error, setError] = useState("");

  function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weightKg = Number(checkedWeight);
    if (!Number.isFinite(weightKg) || weightKg <= 0) {
      setError("Enter a valid checked weight.");
      return;
    }
    setError("");
    onVerify(lot, weightKg, grade);
  }

  return (
    <article className={`hub-lot-card ${column}`}>
      <div className="hub-lot-card-top">
        <span className="hub-lot-id"><i />{lot.id.toUpperCase()}</span>
        {column === "stored" ? <span className="hub-stored-label">✓ Stored</span> : <span className={`hub-lot-dot ${column}`} />}
      </div>
      <div className="hub-lot-title">
        <span className="hub-crop-icon" aria-hidden="true">♧</span>
        <strong>{lot.crop}</strong>
        <span className="hub-grade-chip">Grade {lot.grade}</span>
      </div>
      <div className="hub-farmer">
        <span>{lot.farmer.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
        {lot.farmer}
      </div>
      <div className="hub-route">{lot.origin} <span>→</span> {lot.destination}</div>
      {column === "transit" && (
        <>
          <div className="hub-weight-row"><span>Spoke weight</span><strong>{formatWeight(lot.spokeWeightKg ?? lot.weightKg)}</strong></div>
          <button className="hub-arrival-button" onClick={() => onArrive(lot)} type="button">⇢ &nbsp; Mark arrived at hub</button>
        </>
      )}
      {column === "check" && (
        <form className="hub-verify-form" onSubmit={handleVerify}>
          <label>Checked weight
            <span className="hub-verify-input"><input min="1" onChange={(event) => setCheckedWeight(event.target.value)} type="number" value={checkedWeight} /><small>kg</small></span>
          </label>
          <label>Grade
            <select onChange={(event) => setGrade(event.target.value)} value={grade}>
              <option value="A">A</option><option value="B">B</option><option value="C">C</option>
            </select>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button-primary" type="submit">✓ &nbsp; Verify and store</button>
        </form>
      )}
      {column === "stored" && (
        <>
          <div className="hub-weight-row"><span>Spoke weight</span><strong>{formatWeight(lot.spokeWeightKg ?? lot.weightKg)}</strong></div>
          <div className="hub-weight-row"><span>Hub weight</span><strong>{lot.hubWeightKg === undefined ? "Not recorded" : formatWeight(lot.hubWeightKg)}</strong></div>
          {lot.weightDiscrepancy?.requiresReview ? (
            <span className="hub-discrepancy-label">⚠ Review required · {lot.weightDiscrepancy.percentage.toFixed(2)}%</span>
          ) : lot.weightDiscrepancy ? (
            <span className="hub-match-label">✓ Within 2% of spoke report</span>
          ) : null}
          <button className="hub-arrival-button" onClick={() => onArrive(lot)} type="button">↻ Recheck weight</button>
        </>
      )}
    </article>
  );
}

export default function HubDashboard() {
  const { lots, recordHubWeight, updateLotStatus } = useLots();
  const [hubFilter, setHubFilter] = useState<HubFilter>("All hubs");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferLotId, setTransferLotId] = useState("");
  const [transferDestination, setTransferDestination] = useState("Karbi Hub");
  const [transferError, setTransferError] = useState("");
  const [today] = useState(() => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date()).toUpperCase());

  const filteredLots = useMemo(() => lots.filter((lot) => {
    const matchesSearch = `${lot.id} ${lot.crop} ${lot.farmer} ${lot.origin} ${lot.destination}`.toLowerCase().includes(search.toLowerCase());
    return matchesHub(lot, hubFilter) && matchesSearch;
  }), [hubFilter, lots, search]);
  const inTransit = filteredLots.filter((lot) => lot.status === "Graded" || lot.status === "In transit");
  const toCheck = filteredLots.filter((lot) => lot.status === "At hub");
  const stored = filteredLots.filter((lot) => lot.status === "Open for bids" || lot.status === "Sold");
  const transferCandidates = lots.filter((lot) => lot.status === "Graded" || lot.status === "At hub");

  function handleTransfer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!transferLotId) {
      setTransferError("Select a lot to transfer.");
      return;
    }
    updateLotStatus(transferLotId, "In transit", 3, transferDestination);
    setShowTransfer(false);
    setTransferLotId("");
    setTransferError("");
  }

  function handleVerify(lot: Lot, weightKg: number, grade: string) {
    recordHubWeight(lot.id, grade, weightKg, lot.destination);
  }

  const hubs: { name: HubFilter; subtitle: string }[] = [
    { name: "All hubs", subtitle: "Combined view" },
    { name: "Karbi Hub", subtitle: "Karbi Anglong" },
    { name: "East Hub", subtitle: "Karbi Anglong" },
  ];

  return (
    <section className="page-container hub-dashboard">
      <header className="hub-dashboard-heading">
        <div>
          <p className="eyebrow">STORAGE AND VERIFICATION · {today}</p>
          <h1>Hub dashboard</h1>
          <p>Receive the right weight, verify quality, and keep stored stock visible.</p>
        </div>
        <div className="hub-header-actions">
          <button className="button-secondary" onClick={() => setShowSearch((current) => !current)} type="button">⌕ &nbsp; Find a lot</button>
          <button className="button-primary" onClick={() => setShowTransfer(true)} type="button">＋ &nbsp; Create transfer</button>
        </div>
      </header>

      {showSearch && (
        <label className="hub-search-bar">
          Find a lot by ID, crop, or farmer
          <input autoFocus onChange={(event) => setSearch(event.target.value)} placeholder="Search lots..." value={search} />
        </label>
      )}

      <div aria-label="Hub locations" className="hub-location-grid">
        {hubs.map((hub) => {
          const hubLots = lots.filter((lot) => matchesHub(lot, hub.name));
          const onWay = hubLots.filter((lot) => lot.status === "Graded" || lot.status === "In transit");
          const checking = hubLots.filter((lot) => lot.status === "At hub");
          const storedLots = hubLots.filter((lot) => lot.status === "Open for bids" || lot.status === "Sold");
          return (
            <button aria-pressed={hubFilter === hub.name} className={`hub-location-card${hubFilter === hub.name ? " selected" : ""}`} key={hub.name} onClick={() => setHubFilter(hub.name)} type="button">
              <span className="hub-location-top"><span className="hub-location-icon">{hub.name === "All hubs" ? "▤" : hub.name === "Karbi Hub" ? "⬡" : "⇢"}</span><span><strong>{hub.name}</strong><small>{hub.subtitle}</small></span><span className="hub-chevron">›</span></span>
              <span className="hub-location-stats">
                <span><small>On the way</small><strong>{onWay.length}</strong></span>
                <span><small>To check</small><strong>{checking.length}</strong></span>
                <span><small>Stored</small><strong>{formatWeight(storedLots.reduce((sum, lot) => sum + lot.weightKg, 0))}</strong></span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="hub-board-heading">
        <div><p className="eyebrow">OPERATIONS BOARD</p><h2>{hubFilter} <span>● Live</span></h2></div>
        <div className="hub-board-tools">
          <button aria-label="Toggle lot search" className="hub-icon-button" onClick={() => setShowSearch((current) => !current)} type="button">⌕</button>
        </div>
      </div>

      <div className="hub-operations-grid">
        <section className="hub-operations-column transit-column">
          <div className="hub-column-heading"><div><h3>On the way from spokes</h3><p>⇢ &nbsp;Moving toward your hub</p></div><span>{inTransit.length}</span></div>
          <div className="hub-column-cards">
            {inTransit.map((lot) => <HubLotCard column="transit" key={lot.id} lot={lot} onArrive={(currentLot) => updateLotStatus(currentLot.id, "At hub", 3)} onVerify={handleVerify} />)}
            {!inTransit.length && <p className="hub-empty-column">No lots on the way.</p>}
          </div>
        </section>
        <section className="hub-operations-column check-column">
          <div className="hub-column-heading"><div><h3>Arrived, to check</h3><p>ⓘ &nbsp;Verify weight and grade</p></div><span>{toCheck.length}</span></div>
          <div className="hub-column-cards">
            {toCheck.map((lot) => <HubLotCard column="check" key={lot.id} lot={lot} onArrive={(currentLot) => updateLotStatus(currentLot.id, "At hub", 3)} onVerify={handleVerify} />)}
            {!toCheck.length && <p className="hub-empty-column">No arrivals need checking.</p>}
          </div>
        </section>
        <section className="hub-operations-column stored-column">
          <div className="hub-column-heading"><div><h3>Verified and stored</h3><p>♧ &nbsp;Ready for buyer movement</p></div><span>{stored.length}</span></div>
          <div className="hub-column-cards">
            {stored.map((lot) => <HubLotCard column="stored" key={lot.id} lot={lot} onArrive={(currentLot) => updateLotStatus(currentLot.id, "At hub", 3)} onVerify={handleVerify} />)}
            {!stored.length && <p className="hub-empty-column">No verified stock yet.</p>}
          </div>
        </section>
      </div>

      <BidActivityCard type="hub" />

      {showTransfer && (
        <div className="spoke-modal-backdrop" onClick={() => setShowTransfer(false)} role="presentation">
          <form aria-labelledby="hub-transfer-title" className="spoke-add-lot-modal" onClick={(event) => event.stopPropagation()} onSubmit={handleTransfer}>
            <div><h2 id="hub-transfer-title">Create transfer</h2><button aria-label="Close transfer form" onClick={() => setShowTransfer(false)} type="button">×</button></div>
            <label>Lot<select onChange={(event) => setTransferLotId(event.target.value)} value={transferLotId}><option value="">Select a lot</option>{transferCandidates.map((lot) => <option key={lot.id} value={lot.id}>{lot.id.toUpperCase()} · {lot.crop} · {lot.destination}</option>)}</select></label>
            <label>Destination hub<select onChange={(event) => setTransferDestination(event.target.value)} value={transferDestination}><option>Karbi Hub</option><option>East Hub</option></select></label>
            {transferError && <p className="form-error" role="alert">{transferError}</p>}
            <button className="button-primary" type="submit">Create transfer</button>
          </form>
        </div>
      )}
    </section>
  );
}
