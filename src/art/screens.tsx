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
    <div className="mscr mscr--vuboi">
      <StatusBar />
      <div className="mscr__pad">
        <p className="mscr__kicker">Good morning</p>
        <h4 className="mscr__title">Today: upper body</h4>
        <div className="vb-search">
          <Icon name="search" size={18} />
          <span>Search 540 exercises…</span>
        </div>
        <div className="vb-feature">
          <div className="vb-feature__dots" />
          <div>
            <p className="vb-feature__title">Push day</p>
            <p className="vb-feature__meta">5 moves · 40 min</p>
          </div>
          <span className="vb-feature__play" />
        </div>
        <div className="mscr__row-head">
          <span>Today</span>
          <span className="mscr__muted">See all</span>
        </div>
        {[
          ["Bench press", "Barbell · 4 × 8", "40 kg", "#4B5A3C"],
          ["Pull-up", "Bodyweight · 3 × 6", "bw", "#222222"],
          ["Plank", "Core · 3 × 45 s", "45 s", "#C9B48A"],
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

export function NumiOnboarding() {
  return (
    <div className="mscr mscr--numi">
      <StatusBar />
      <div className="nm-art">
        <span className="nm-ring nm-ring--1" />
        <span className="nm-ring nm-ring--2" />
        <span className="nm-ring nm-ring--3" />
        <span className="nm-core">n</span>
      </div>
      <div className="mscr__pad nm-copy">
        <h4 className="mscr__title">Know what to do today</h4>
        <p className="mscr__body">Open the app, know what to do, know if you&apos;re winning.</p>
        <div className="nm-dots">
          <i className="is-on" />
          <i />
          <i />
        </div>
        <div className="nm-button">Get started</div>
        <p className="nm-secondary">I already have an account</p>
      </div>
    </div>
  );
}
