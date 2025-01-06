import CharacterLayout from "../components/Layouts/Character";
import PageLayout from "../components/Layouts/Page";
import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

export default function Page() {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel={"Character"}>
        <CharacterLayout />
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <ClientOnly />
      </div>
    </div>
  );
}
