import { data } from "react-router";

import { ProjectPage } from "~/components/project/ProjectPage";
import {
  getAdjacentProjects,
  getProjectBySlug,
  getProjectDescription,
  getProjectDocumentTitle,
} from "~/content/projects";
import type { Route } from "./+types/works.$slug";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${getProjectDocumentTitle(loaderData.project)} — Renet Ruseva` },
    {
      name: "description",
      content: getProjectDescription(loaderData.project),
    },
  ];
}

export function loader({ params }: Route.LoaderArgs) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    throw data(null, { status: 404 });
  }

  const { prev, next } = getAdjacentProjects(project.slug);

  return { project, prevProject: prev, nextProject: next };
}

export default function WorkProjectRoute({ loaderData }: Route.ComponentProps) {
  return (
    <ProjectPage
      project={loaderData.project}
      prevProject={loaderData.prevProject}
      nextProject={loaderData.nextProject}
    />
  );
}
