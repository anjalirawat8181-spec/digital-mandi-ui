import { Link, useSearchParams } from "react-router-dom";
import FarmerProfilePanel from "../components/FarmerProfilePanel";

const lots = [
  {
    id: "lemon",
    name: "Lemon",
    weight: "1,200 kg",
    hub: "Diphu Spoke",
    status: "Graded and open for bids",
    destination: "Going to Karbiang Hub",
    bids: "3 bids, top ₹48/kg",
    stage: 4,
  },
  {
    id: "ginger",
    name: "Ginger",
    weight: "800 kg",
    hub: "Diphu Spoke",
    status: "On the way to hub",
    destination: "Going to East Hub",
    bids: "2 bids, top ₹62/kg",
    stage: 3,
  },
];

function Brand() {
  return (
    <div className="dashboard-brand">
      <span className="dashboard-brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M19.5 4.5C12 4.5 6 7.5 6 13.5c0 3 2.25 5.25 5.25 5.25S17.25 16.5 17.25 12c0-2.25-.75-4.5-2.25-6" />
          <path d="M3.75 20.25c2.25-4.5 6-7.5 10.5-9.75" />
        </svg>
      </span>
      <span>Digital Mandi</span>
    </div>
  );
}

function LotCard({ lot, platform }: { lot: (typeof lots)[number]; platform: string }) {
  return (
    <article className="lot-card">
      <div className="lot-heading">
        <span className="lot-leaf" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19.5 4.5C12 4.5 6 7.5 6 13.5c0 3 2.25 5.25 5.25 5.25S17.25 16.5 17.25 12c0-2.25-.75-4.5-2.25-6" />
            <path d="M3.75 20.25c2.25-4.5 6-7.5 10.5-9.75" />
          </svg>
        </span>
        <h2>{lot.name}</h2>
        <span className="grade-badge">Grade A</span>
        <button className="lot-menu" type="button" aria-label={`${lot.name} lot options`}>•••</button>
      </div>
      <p className="lot-meta">{lot.weight}<span>·</span>{lot.hub}</p>
      <p className="lot-status">{lot.status}</p>
      <div className="lot-journey" aria-label={`Lot progress, stage ${lot.stage} of 4`}>
        <div className="journey-line" />
        {["Farm gate", "Spoke", "Hub", "Buyer"].map((step, index) => (
          <div className={`journey-step${index < lot.stage ? " complete" : ""}${index + 1 === lot.stage ? " current" : ""}`} key={step}>
            <span>{index + 1 === lot.stage ? lot.stage : index < lot.stage ? "✓" : index + 1}</span>
            <small>{step}</small>
          </div>
        ))}
      </div>
      <div className="lot-footer">
        <span className="lot-destination">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          {lot.destination}
        </span>
        <Link className="lot-bids-link" to={`/bids?lot=${lot.id}${platform ? `&platform=${platform}` : ""}`}>
          {lot.bids}
          <span aria-hidden="true">›</span>
        </Link>
      </div>
    </article>
  );
}

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") === "digital-mandi" ? "digital-mandi" : "";

  return (
    <main className="farmer-page">
      <div className="farmer-content">
        <header className="farmer-header">
          <Brand />
          <button className="menu-button" type="button" aria-label="Open menu">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <div className="greeting-row">
          <div>
            <p className="dashboard-date">THURSDAY, 08 OCTOBER</p>
            <h1>Hello, Ramesh</h1>
          </div>
          <FarmerProfilePanel />
        </div>

        <button className="farmapp-banner" type="button">
          <span className="banner-icon" aria-hidden="true">✿</span>
          <span>{platform ? "Digital Mandi" : "FarmApp + Digital Mandi"}</span>
          <span className="banner-arrow" aria-hidden="true">›</span>
        </button>

        <section className="dashboard-stats" aria-label="Season summary">
          <article><span>Lots</span><strong>4</strong><small>this season</small></article>
          <article><span>Open for bids</span><strong>2</strong><small>being seen</small></article>
          <article><span>Bids</span><strong>9</strong><small>from buyers</small></article>
        </section>

        <nav className="dashboard-tabs" aria-label="Farmer dashboard">
          <span className="dashboard-tab selected" aria-current="page">My lots</span>
          <Link className="dashboard-tab" to={`/bids?lot=lemon${platform ? `&platform=${platform}` : ""}`}>Bids <strong>9</strong></Link>
        </nav>

        <section className="lots-list" aria-label="My lots">
          {lots.map((lot) => <LotCard key={lot.id} lot={lot} platform={platform} />)}
        </section>
      </div>
    </main>
  );
}
