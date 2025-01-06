import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import CharacterLayout from "../../components/Layouts/Character";

import "../../index.css";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const newRoleChat = [
  {
    content:
      "Who am I? The question echoed louder with every heartbeat. What is my name? My gender? My height? What do I even enjoy in this life?",
    role: "assistant",
    type: "character",
  },
];

const NewCharacterPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout>
        <CharacterLayout chatLog={newRoleChat} />
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default NewCharacterPage;
