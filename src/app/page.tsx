import CharacterLayout from "../components/Layouts/Character";
import PageLayout from "../components/Layouts/Page";
import { ClientOnly } from "./client";

export function generateStaticParams() {
  return [{ slug: [""] }];
}

const newRoleChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    role: "assistant",
    type: "character",
  },
];

export default function Page() {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout>
        <CharacterLayout chatLog={newRoleChat} />
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <ClientOnly />
      </div>
    </div>
  );
}
