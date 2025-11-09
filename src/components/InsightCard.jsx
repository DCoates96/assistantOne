import React from "react";

export default function InsightCard({ header, summary, items, footer, emptyCopy }) {
  if (!summary && (!items || items.length === 0)) {
    return <p className="card__empty">{emptyCopy}</p>;
  }

  return (
    <article className="card">
      {header && <header className="card__header">{header}</header>}
      {summary && <p className="card__summary">{summary}</p>}
      {items && items.length > 0 && (
        <ul className="card__list">
          {items.map((item) => (
            <li key={item.key || item.title || item} className="card__list-item">
              {item.title && <strong>{item.title}</strong>}
              {item.detail && <div>{item.detail}</div>}
              {!item.title && !item.detail && item}
            </li>
          ))}
        </ul>
      )}
      {footer && <footer className="card__footer">{footer}</footer>}
    </article>
  );
}
