import { Fragment } from "react";

import { educationContent } from "~/content/site";
import "./education-section.css";

export function EducationSection() {
  const lastIndex = educationContent.entries.length - 1;

  return (
    <section
      id="education"
      className="education"
      aria-labelledby="education-title"
    >
      <h2 id="education-title" className="education__title display-title">
        {educationContent.title}
      </h2>

      <ol className="education__list">
        {educationContent.entries.map((entry, index) => {
          const isLast = index === lastIndex;

          return (
            <Fragment key={entry.id}>
              <li className="education__item">
                <span className="education__marker" aria-hidden="true" />

                <div className="education__content">
                  <p className="education__period">{entry.period}</p>
                  <h3 className="education__institution">{entry.institution}</h3>
                  {"program" in entry && entry.program ? (
                    <p className="education__program">{entry.program}</p>
                  ) : null}
                  {!isLast ? (
                    <p className="education__location">{entry.location}</p>
                  ) : null}
                </div>
              </li>

              {isLast ? (
                <li className="education__item education__item--location">
                  <span className="education__marker" aria-hidden="true" />
                  <p className="education__location">{entry.location}</p>
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </section>
  );
}
