// src/pages/character/[threadId]/index.tsx

import dynamic from "next/dynamic";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";
import CharacterLayout from "../../../components/Layouts/Character";
import PageLayout from "../../../components/Layouts/Page";
import { Character } from "../../../types/characters";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface CharacterPageProps {
  data: Character;
}

const CharacterPage: NextPage<CharacterPageProps> = ({ data }) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          {data.json?.name
            ? data.json?.name +
              " on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."
            : "New character on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."}
        </title>
      </Head>
      <PageLayout headerDropdownLabel={"Character"}>
        {data.thread_id === "new" ? (
          <CharacterLayout />
        ) : (
          <CharacterLayout chatLog={data.chatLog} report={data.json} />
        )}
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!;

  if (threadId === "new") return { props: { data: { thread_id: "new" } } };

  const res = await fetch(
    `https://devapi.fabularius.ai/dev/character?threadId=${threadId}`
  );

  if (!res.ok) {
    return { props: { data: { thread_id: "new" } } };
  }

  const result = await res.json();

  return {
    props: {
      data: result.data,
    },
  };
};

export default CharacterPage;
