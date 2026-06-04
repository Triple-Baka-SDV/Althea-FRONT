import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Passer la commande – Althea Systems" },
];

export default function OrderRedirect() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/commande", { replace: true }); }, [navigate]);
  return null;
}
