// src/pages/character/[threadId]/index.tsx

import dynamic from "next/dynamic";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";

import CharacterLayout from "../../../components/Layouts/Character";
import PageLayout from "../../../components/Layouts/Page";
import { CharacterServerData } from "../../../types/characters";
import { getAPIUrlFromContext } from "../../../utils/ssr";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface CharacterPageProps {
  serverData: CharacterServerData;
}

const CharacterPage: NextPage<CharacterPageProps> = ({ serverData }) => {
  return (
    <>
      <Head>
        <title>
          {serverData?.data.json?.name
            ? serverData?.data.json?.name + " on Fabularius AI"
            : "New character on Fabularius AI"}
        </title>
      </Head>
      <div
        id="ssr-root"
        className="no-scrollbar overflow-hidden h-screen w-screen"
      >
        <PageLayout headerDropdownLabel={"Character"}>
          {serverData?.threadId === "new" ? (
            <CharacterLayout />
          ) : (
            <CharacterLayout
              character={serverData?.data}
              chatLog={serverData?.data.chatLog}
              isOwner={serverData?.isOwner}
              threadId={serverData?.threadId}
            />
          )}
        </PageLayout>
      </div>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App characterServerData={serverData} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!;

  if (threadId === "new")
    return { props: { data: { thread_id: "new" }, threadId } };

  const res = await fetch(
    getAPIUrlFromContext(context) + "/character?threadId=" + threadId
  );

  if (!res.ok) {
    return { props: { data: { thread_id: "new" }, threadId } };
  }

  const result = await res.json();

  return {
    props: {
      serverData: { ...result, threadId },
    },
  };
};

export default CharacterPage;
