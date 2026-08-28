import { languagesContent } from "~/content/site";
import "./languages-section.css";

export function LanguagesSection() {
  return (
    <section
      id="languages"
      className="languages"
      aria-labelledby="languages-title"
    >
      <h2 id="languages-title" className="languages__title display-title">
        {languagesContent.title}
      </h2>

      <ul className="languages__tags">
        {languagesContent.items.map((language) => (
          <li
            key={language.id}
            className={`languages__tag languages__tag--${language.id}`}
          >
            {language.name} ({language.level})
          </li>
        ))}
      </ul>
    </section>
  );
}
