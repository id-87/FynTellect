import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Transactions } from "./pages/Transactions";
import { BudgetConfig } from "./pages/BudgetConfig";
import { Alerts } from "./pages/Alerts";
import { AgentChat } from "./pages/AgentChat";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "transactions", Component: Transactions },
      { path: "budget", Component: BudgetConfig },
      { path: "alerts", Component: Alerts },
      { path: "agent-chat", Component: AgentChat },
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
]);
