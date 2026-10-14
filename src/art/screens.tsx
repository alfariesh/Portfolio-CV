import type { ReactNode } from "react";
import { Icon } from "../components/Icon";

const PHONE_W = 390;
const PHONE_H = 844;

// Draws a 390×844 screen and scales it to the requested width.
export function MiniScreen({ width, children }: { width: number; children: ReactNode }) {
  const scale = width / PHONE_W;
  return (
    <div className="mini" style={{ width, height: PHONE_H * scale }}>
      <div className="mini__inner" style={{ transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}

function StatusBar({ tone = "ink" }: { tone?: "ink" | "light" }) {
  return (
    <div className={`sb sb--${tone}`}>
      <span>9:41</span>
      <span className="sb__icons">
        <i />
        <i />
        <i className="sb__battery" />
      </span>
    </div>
  );
}

export function VuboiHome() {
  return (
    <div className="scr scr--vuboi">
      <StatusBar />
      <div className="scr__pad">
        <p className="scr__kicker">Good morning</p>
        <h4 className="scr__title">Your week, calmly</h4>
        <div className="vb-search">
          <Icon name="search" size={18} />
          <span>Search places, people…</span>
        </div>
        <div className="vb-feature">
          <div className="vb-feature__dots" />
          <div>
            <p className="vb-feature__title">Weekend reset</p>
            <p className="vb-feature__meta">3 rituals · 25 min</p>
          </div>
          <span className="vb-feature__play" />
        </div>
        <div className="scr__row-head">
          <span>Today</span>
          <span className="scr__muted">See all</span>
        </div>
        {[
          ["Morning pages", "Journal · 10 min", "07:30", "#4B5A3C"],
          ["Studio focus", "Deep work · 90 min", "09:00", "#222222"],
          ["Long walk", "Outside · 40 min", "17:15", "#C9B48A"],
        ].map(([title, sub, time, color]) => (
          <div key={title} className="vb-row">
            <span className="vb-row__thumb" style={{ background: color }} />
            <span className="vb-row__text">
              <b>{title}</b>
              <span>{sub}</span>
            </span>
            <span className="vb-row__time">{time}</span>
          </div>
        ))}
      </div>
      <div className="tabbar">
        <Icon name="home" size={24} />
        <Icon name="search" size={24} />
        <Icon name="grid" size={24} />
        <Icon name="user" size={24} />
      </div>
    </div>
  );
}

export function ChickenGoals() {
  const progress = 0.64;
  const r = 74;
  const c = 2 * Math.PI * r;
  return (
    <div className="scr scr--chicken">
      <StatusBar />
      <div className="scr__pad">
        <div className="ck-head">
          <h4 className="scr__title">Goals</h4>
          <span className="ck-avatar">SA</span>
        </div>
        <div className="ck-card">
          <svg width="180" height="180" viewBox="0 0 180 180" aria-hidden="true">
            <circle
              cx="90"
              cy="90"
              r={r}
              fill="none"
              stroke="rgb(24 24 24 / 12%)"
              strokeWidth="14"
            />
            <circle
              cx="90"
              cy="90"
              r={r}
              fill="none"
              stroke="#181818"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${c * progress} ${c}`}
              transform="rotate(-90 90 90)"
            />
            <text x="90" y="100" textAnchor="middle" fontSize="30" fontWeight="600" fill="#181818">
              64%
            </text>
          </svg>
          <p className="ck-card__title">New bike</p>
          <p className="ck-card__meta">Rp 2.450.000 of Rp 3.800.000</p>
        </div>
        <div className="ck-chips">
          <span>+ 50k</span>
          <span>+ 100k</span>
          <span>Custom</span>
        </div>
        <div className="scr__row-head">
          <span>Recent</span>
          <span className="scr__muted">History</span>
        </div>
        {[
          ["Weekly top-up", "+ Rp 50.000"],
          ["Round-ups", "+ Rp 12.300"],
        ].map(([title, amount]) => (
          <div key={title} className="ck-row">
            <span>{title}</span>
            <b>{amount}</b>
          </div>
        ))}
        <div className="ck-button">Add to savings</div>
      </div>
    </div>
  );
}

export function NumiOnboarding() {
  return (
    <div className="scr scr--numi">
      <StatusBar />
      <div className="nm-art">
        <span className="nm-ring nm-ring--1" />
        <span className="nm-ring nm-ring--2" />
        <span className="nm-ring nm-ring--3" />
        <span className="nm-core">n</span>
      </div>
      <div className="scr__pad nm-copy">
        <h4 className="scr__title">Numbers, in plain words</h4>
        <p className="scr__body">
          Track what matters and let Numi explain the rest — no spreadsheets required.
        </p>
        <div className="nm-dots">
          <i className="is-on" />
          <i />
          <i />
        </div>
        <div className="ck-button">Get started</div>
        <p className="nm-secondary">I already have an account</p>
      </div>
    </div>
  );
}
