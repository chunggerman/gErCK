import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/tenant/default/team/default/workspace/default/assistant");
  return null;
}
