import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type LoginMode = "farmapp" | "signup";
type Language = "English" | "हिन्दी" | "অসমীয়া";

export default function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<LoginMode>("farmapp");
  const [language, setLanguage] = useState<Language>("English");
  const [farmId, setFarmId] = useState("");
  const [pin, setPin] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const phoneInput = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "farmapp" && !farmId.trim()) {
      setError("Invalid Farm ID. Enter your Farm ID.");
      return;
    }

    if (mode === "farmapp" && !/^\d{4}$/.test(pin)) {
      setError("Invalid PIN. Enter exactly 4 digits.");
      return;
    }

    if (mode === "signup") {
      if (!/^\d{10}$/.test(phone)) {
        setError("Invalid phone number. Enter exactly 10 digits.");
        return;
      }

      if (!/^\d{6}$/.test(otp)) {
        setError("Invalid OTP. Enter exactly 6 digits.");
        return;
      }
    }

    setError("");
    if (mode === "farmapp") {
      navigate("/dashboard");
    } else {
      navigate("/dashboard?platform=digital-mandi");
    }
  }

  function selectMode(nextMode: LoginMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="welcome-page">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19.5 4.5C12 4.5 6 7.5 6 13.5c0 3 2.25 5.25 5.25 5.25S17.25 16.5 17.25 12c0-2.25-.75-4.5-2.25-6" />
              <path d="M3.75 20.25c2.25-4.5 6-7.5 10.5-9.75" />
            </svg>
          </span>
          <span>Digital Mandi</span>
        </div>

        {mode === "signup" && <p className="welcome-eyebrow">DIGITAL MANDI FOR KARBI ANGLONG</p>}
        <h1 id="welcome-title">Welcome</h1>
        <p className="welcome-subtitle">
          {mode === "signup" ? "Move every lot from farm gate to fair buyer." : "Tell us how you use Digital Mandi."}
        </p>

        <div className="language-options" aria-label="Language">
          {(["English", "हिन्दी", "অসমীয়া"] as const).map((option) => (
            <button
              className={`language-button${language === option ? " selected" : ""}`}
              key={option}
              onClick={() => setLanguage(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mode-options">
          <button
            aria-pressed={mode === "farmapp"}
            className={`mode-option${mode === "farmapp" ? " selected" : ""}`}
            onClick={() => selectMode("farmapp")}
            type="button"
          >
            <span className="mode-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 3 19 6v5.25c0 4.25-2.9 7.75-7 9.75-4.1-2-7-5.5-7-9.75V6l7-3Z" />
                <path d="m9 11.5 2 2 4-4" />
              </svg>
            </span>
            <span className="mode-title">I use ERDE Agro FarmApp</span>
            <span className="mode-subtitle">Log in with your Farm ID and PIN</span>
            <span className="mode-radio" aria-hidden="true" />
          </button>
          <button
            aria-pressed={mode === "signup"}
            className={`mode-option${mode === "signup" ? " selected" : ""}`}
            onClick={() => selectMode("signup")}
            type="button"
          >
            <span className="mode-icon add-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="mode-title">I am new to Digital Mandi</span>
            <span className="mode-subtitle">Sign up with your phone number and OTP</span>
            <span className="mode-radio" aria-hidden="true" />
          </button>
        </div>

        <form className="welcome-form" onSubmit={handleSubmit} noValidate>
          {mode === "farmapp" ? (
            <>
              <label className="field-label" htmlFor="farm-id">Farm ID</label>
              <input
                autoComplete="username"
                id="farm-id"
                onChange={(event) => {
                  setFarmId(event.target.value);
                  setError("");
                }}
                placeholder="e.g. FA-2048"
                value={farmId}
              />
              <label className="field-label pin-label" htmlFor="pin">4-digit PIN</label>
              <input
                autoComplete="current-password"
                id="pin"
                inputMode="numeric"
                onChange={(event) => {
                  setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
                  setError("");
                }}
                pattern="[0-9]{4}"
                placeholder="1234"
                type="text"
                value={pin}
              />
              <p className="form-hint">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3 19 6v5.25c0 4.25-2.9 7.75-7 9.75-4.1-2-7-5.5-7-9.75V6l7-3Z" />
                  <path d="m9 11.5 2 2 4-4" />
                </svg>
                <span>Same Farm ID and PIN as in FarmApp. Demo: any ID and a 4-digit PIN.</span>
              </p>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="submit-button" type="submit">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M10 17l5-5-5-5M15 12H3" />
                  <path d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
                </svg>
                <span>Log in</span>
              </button>
            </>
          ) : (
            <>
              <label className="field-label" htmlFor="phone">Mobile number</label>
              <input
                autoComplete="tel-national"
                className="phone-number-input"
                id="phone"
                inputMode="numeric"
                onChange={(event) => {
                  setPhone(event.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                pattern="[0-9]{10}"
                placeholder="+91 98765 43210"
                ref={phoneInput}
                type="tel"
                value={phone}
              />
              <label className="field-label otp-label" htmlFor="otp">6-digit OTP</label>
              <input
                autoComplete="one-time-code"
                className="otp-input"
                id="otp"
                inputMode="numeric"
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setError("");
                }}
                pattern="[0-9]{6}"
                placeholder="••••••"
                type="text"
                value={otp}
              />
              {error && <p className="form-error" role="alert">{error}</p>}
              <button className="submit-button" type="submit">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3 19 6v5.25c0 4.25-2.9 7.75-7 9.75-4.1-2-7-5.5-7-9.75V6l7-3Z" />
                  <path d="m9 11.5 2 2 4-4" />
                </svg>
                <span>Verify and sign up</span>
              </button>
              <button
                className="change-number-button"
                onClick={() => {
                  setPhone("");
                  setOtp("");
                  setError("");
                  phoneInput.current?.focus();
                }}
                type="button"
              >
                Change number
              </button>
            </>
          )}
        </form>
      </section>
    </main>
  );
}
