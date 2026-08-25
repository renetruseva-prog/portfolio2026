import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Renet Ruseva — Creative Developer" },
    {
      name: "description",
      content:
        "Portfolio of Renet Ruseva, a creative developer combining visual storytelling with web technology.",
    },
  ];
}

export function loader({}: Route.LoaderArgs) {
  return null;
}

export default function Home() {
  return <Welcome />;
}
