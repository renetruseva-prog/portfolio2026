import { Fragment } from "react";

import { expertiseContent } from "~/content/site";
import "./expertise-section.css";

export function ExpertiseSection() {
  return (
    <section
      id="expertise"
      className="expertise"
      aria-labelledby="expertise-title"
    >
      <h2 id="expertise-title" className="expertise__title display-title">
        {expertiseContent.title}
      </h2>

      <ol className="expertise__list">
        {expertiseContent.areas.map((area) => (
          <li key={area.id} className="expertise__item">
            <div className="expertise__lead">
              <span className="expertise__index" aria-hidden="true">
                <span className="expertise__index-label">{area.index}</span>
              </span>

              <div className="expertise__intro">
                <h3 className="expertise__area-title">{area.title}</h3>
                <div className="expertise__rule" aria-hidden="true" />
              </div>
            </div>

            <ul className="expertise__skills">
              {area.skillLines.map((line, lineIndex) => (
                <li key={lineIndex} className="expertise__skill-line">
                  {line.map((skill, skillIndex) => (
                    <Fragment key={skill}>
                      {skillIndex > 0 ? (
                        <span className="expertise__skill-sep" aria-hidden="true">
                          {" * "}
                        </span>
                      ) : null}
                      {skill}
                    </Fragment>
                  ))}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
