import React from "react";

export default function Section({ title, description, meta, action, children }) {
  return (
    <section className="section">
      <header className="section__header">
        <div className="section__intro">
          <h2 className="section__title">{title}</h2>
          {description && <p className="section__description">{description}</p>}
        </div>
        <div className="section__header-aside">
          {meta && <span className="section__meta">{meta}</span>}
          {action && <div className="section__action">{action}</div>}
        </div>
      </header>
      <div className="section__content">{children}</div>
    </section>
  );
}
