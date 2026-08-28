import { useEffect, useRef } from "react";

import { footerAssets, footerContent, site } from "~/content/site";
import { initFooterMotion } from "~/lib/section-scroll-motion.client";
import "./footer-section.css";

function renderHeading() {
  const highlight = footerContent.headingHighlight;
  const highlightIndex = footerContent.heading.indexOf(highlight);

  if (highlightIndex === -1) {
    return footerContent.heading;
  }

  const before = footerContent.heading.slice(0, highlightIndex);
  const after = footerContent.heading.slice(highlightIndex + highlight.length);

  return (
    <>
      {before}
      <span className="footer__heading-highlight">
        {highlight}
        <img
          className="footer__frame"
          src={footerAssets.frame}
          alt=""
          width={174}
          height={67}
          draggable={false}
        />
      </span>
      {after}
    </>
  );
}

export function FooterSection() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    return initFooterMotion(footer);
  }, []);

  return (
    <footer ref={footerRef} id="contact" className="footer">
      <svg
        className="footer__decorative-line"
        viewBox="0 -36 1484.22 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0.297323 48.0168C44.464 15.3502 170.597 -30.3832 321.797 48.0168C510.797 146.017 697.788 28.5108 658.797 2.51684C630.297 -16.4831 619.487 106.01 750.297 67.5169C950.797 8.51678 1181.3 78.4074 1293.3 127.017C1437.3 189.517 1500.8 94.5168 1479.8 26.5168"
          stroke="var(--color-cream)"
        />
      </svg>

      <div className="footer__panel">
        <img
          className="footer__star"
          src={footerAssets.star}
          alt=""
          width={500}
          height={500}
          draggable={false}
        />

        <div className="footer__inner">
          <p className="footer__heading display-title">{renderHeading()}</p>

          <div className="footer__links">
            <div className="footer__column">
              <h2 className="footer__column-title display-title">
                {footerContent.exploreTitle}
              </h2>
              <ul className="footer__link-list">
                {footerContent.exploreLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__column">
              <h2 className="footer__column-title display-title">
                {footerContent.contactTitle}
              </h2>
              <ul className="footer__link-list">
                {footerContent.contactLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="footer__link footer__link--external"
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      download={link.href === site.cv.href ? true : undefined}
                    >
                      {link.label}
                      <img
                        className="footer__external-icon"
                        src={footerAssets.arrowExternal}
                        alt=""
                        width={16}
                        height={16}
                        draggable={false}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer__meta">
            <a href="#main" className="footer__link footer__link--back">
              {footerContent.backToTop}
              <img
                className="footer__back-icon"
                src={footerAssets.arrowUp}
                alt=""
                width={16}
                height={16}
                draggable={false}
              />
            </a>
            <p className="footer__copyright">{footerContent.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
