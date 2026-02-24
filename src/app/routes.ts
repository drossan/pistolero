import { createBrowserRouter } from "react-router";
import { Home } from "./components/home";
import { VsMachine } from "./components/vs-machine";
import { Multiplayer } from "./components/multiplayer";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/vs-machine",
    Component: VsMachine,
  },
  {
    path: "/multiplayer",
    Component: Multiplayer,
  },
]);
