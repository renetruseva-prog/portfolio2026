import { site } from "~/content/site";
import "./site-header.css";

const logo = {
  frame: "/images/portfolio/logo-frame.svg"
};

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__bar">
        <a href="/" aria-label="Home" className="site-header__logo">
          <img
            alt=""
            src={logo.frame}
            width={50}
            height={52}
            className="site-header__logo-frame"
          />
        </a>

        <div className="site-header__actions">
          <details className="site-header__menu">
            <summary
              className="site-header__menu-button"
              aria-label="Open menu"
            >
              <span className="site-header__menu-line" />
              <span className="site-header__menu-line" />
              <span className="site-header__menu-line" />
            </summary>

            <nav id="mobile-nav" aria-label="Main" className="site-header__nav">
              <ul className="site-header__nav-list">
                {site.nav.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="site-header__nav-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>

          <button
            type="button"
            className="site-header__lang-button"
            aria-label={`Switch to ${site.languages.alternate}`}
          >
            {site.languages.current}
          </button>
        </div>
      </div>
    </header>
  );
}
