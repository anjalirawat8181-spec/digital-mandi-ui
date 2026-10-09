import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FarmerProfilePanel from "../components/FarmerProfilePanel";

const bidData = {
  lemon: {
    name: "LEMON",
    grade: "GRADE A",
    quantity: "1,200 KG",
    count: 3,
    offers: [
      { buyer: "Kolkata Agro", price: "₹48", total: "₹57,600", age: "12 min ago", terms: "Pays today", level: "highest" },
      { buyer: "Guwahati Fresh Traders", price: "₹46", total: "₹55,200", age: "28 min ago", terms: "Pays within 7 days", level: "soon" },
      { buyer: "Siliguri Mart", price: "₹44", total: "₹52,800", age: "41 min ago", terms: "Pays on credit", level: "credit" },
    ],
  },
  ginger: {
    name: "GINGER",
    grade: "GRADE A",
    quantity: "800 KG",
    count: 2,
    offers: [
      { buyer: "North East Produce", price: "₹62", total: "₹49,600", age: "18 min ago", terms: "Pays today", level: "highest" },
      { buyer: "Guwahati Fresh Traders", price: "₹60", total: "₹48,000", age: "36 min ago", terms: "Pays within 7 days", level: "soon" },
    ],
  },
};

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

export default function Bids() {
  const [searchParams] = useSearchParams();
  const lotId = searchParams.get("lot") === "ginger" ? "ginger" : "lemon";
  const platform = searchParams.get("platform") === "digital-mandi" ? "digital-mandi" : "";
  const lot = bidData[lotId];
  const [acceptedBid, setAcceptedBid] = useState<string | null>(null);

  return (
    <main className="farmer-page">
      <div className="farmer-content bids-content">
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
          <Link className="dashboard-tab" to={`/dashboard${platform ? `?platform=${platform}` : ""}`}>My lots</Link>
          <span className="dashboard-tab selected" aria-current="page">Bids <strong>9</strong></span>
        </nav>

        <section className="buyer-bids" aria-labelledby="buyer-bids-title">
          <div className="bids-title-row">
            <div>
              <p>{lot.name} · {lot.grade} · {lot.quantity}</p>
              <h2 id="buyer-bids-title">Buyer bids</h2>
            </div>
            <strong className="bid-count">{lot.count} bids</strong>
          </div>

          <div className="bid-list">
            {lot.offers.map((offer, index) => (
              <article className={`bid-card${index === 0 ? " best-bid" : ""}`} key={offer.buyer}>
                <span className="bid-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="bid-details">
                  <div className="buyer-name-row">
                    <h3>{offer.buyer}</h3>
                    {index === 0 && <span className="highest-badge">Highest</span>}
                  </div>
                  <p className="bid-age">{offer.age}</p>
                  <span className={`payment-terms ${offer.level}`}>₹ &nbsp;{offer.terms}</span>
                </div>
                <div className="bid-price">
                  <strong>{offer.price}<small>/kg</small></strong>
                  <span>{offer.total}</span>
                </div>
                <button
                  className={`accept-bid${acceptedBid === offer.buyer ? " accepted" : ""}`}
                  onClick={() => setAcceptedBid(offer.buyer)}
                  type="button"
                >
                  {acceptedBid === offer.buyer ? "Accepted" : "Accept"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
