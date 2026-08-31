import { useEffect, useId, useState } from "react";

import { site } from "~/content/site";
import "./site-header.css";

const headerAssets = {
  logoFrame: "/images/portfolio/logo-frame.svg",
} as const;

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!isMenuOpen) return;

    const scrollY = window.scrollY;
    const { style: htmlStyle } = document.documentElement;
    const { style: bodyStyle } = document.body;

    const previousHtmlOverflow = htmlStyle.overflow;
    const previousBodyOverflow = bodyStyle.overflow;
    const previousBodyPosition = bodyStyle.position;
    const previousBodyTop = bodyStyle.top;
    const previousBodyWidth = bodyStyle.width;

    htmlStyle.overflow = "hidden";
    bodyStyle.overflow = "hidden";
    bodyStyle.position = "fixed";
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = "100%";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      htmlStyle.overflow = previousHtmlOverflow;
      bodyStyle.overflow = previousBodyOverflow;
      bodyStyle.position = previousBodyPosition;
      bodyStyle.top = previousBodyTop;
      bodyStyle.width = previousBodyWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen((open) => !open);
  }

  return (
    <header
      className={`site-header${isMenuOpen ? " site-header--menu-open" : ""}`}
    >
      <div className="site-header__bar">
        <a href="/" aria-label="Home" className="site-header__logo">
          <img
            alt=""
            src={headerAssets.logoFrame}
            width={50}
            height={52}
            className="site-header__logo-frame"
          />
        </a>

        <nav aria-label="Main" className="site-header__desktop-nav">
          <ul className="site-header__desktop-nav-list">
            {site.nav.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="site-header__desktop-nav-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__actions">
          <button
            type="button"
            className={`site-header__menu-button${
              isMenuOpen ? " site-header__menu-button--open" : ""
            }`}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
            <span className="site-header__menu-icon" aria-hidden="true">
              <span className="site-header__menu-line" />
              <span className="site-header__menu-line" />
              <span className="site-header__menu-line" />
            </span>
          </button>

          <button
            type="button"
            className="site-header__lang-button"
            aria-label={`Switch to ${site.languages.alternate}`}
          >
            <span className="site-header__lang-current">{site.languages.current}</span>
            <span className="site-header__lang-separator" aria-hidden="true">
              /
            </span>
            <span className="site-header__lang-alternate">{site.languages.alternate}</span>
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Main"
        className="site-header__menu-panel"
        hidden={!isMenuOpen}
      >
        <ul className="site-header__menu-list">
          {site.mobileMenuLinks.map((link, index) => (
            <li key={link.href} className="site-header__menu-item">
              <a
                href={link.href}
                className="site-header__menu-link display-title"
                onClick={closeMenu}
              >
                {link.label}
              </a>
              {index < site.mobileMenuLinks.length - 1 ? (
                <hr className="site-header__menu-divider" />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
