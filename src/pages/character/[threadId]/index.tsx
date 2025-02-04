// src/pages/character/[threadId]/index.tsx

import dynamic from "next/dynamic";
import { GetServerSideProps, NextPage } from "next";
import CharacterLayout from "../../../components/Layouts/Character";
import PageLayout from "../../../components/Layouts/Page";
import { Character } from "../../../types/characters";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface CharacterPageProps {
  threadData: Character;
}

const CharacterPage: NextPage<CharacterPageProps> = ({ threadData }) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel={"Character"}>
        {threadData.thread_id === "new" ? (
          <CharacterLayout />
        ) : (
          <CharacterLayout chatLog={threadData.chatLog?.chatLog} />
        )}
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
      {/* You can pass threadData to any child components as needed */}
      <pre>{JSON.stringify(threadData, null, 2)}</pre>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!; // threadId is extracted from the URL

  if (threadId === "new")
    return { props: { threadData: { thread_id: "new" } } };

  const res = await fetch(
    `https://prodapi.fabularius.ai/character?threadId=${threadId}`
  );

  if (!res.ok) {
    return { props: { threadData: { thread_id: "new" } } };
  }

  const threadData = await res.json();

  return {
    props: {
      threadData,
    },
  };
};

export default CharacterPage;
