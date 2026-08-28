import { useEffect, useRef } from "react";

import { languagesContent } from "~/content/site";
import { initLanguagesWiggle } from "~/lib/languages-wiggle.client";
import "./languages-section.css";

export function LanguagesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    return initLanguagesWiggle(section);
  }, []);

  return (
    <section
      ref={sectionRef}
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
