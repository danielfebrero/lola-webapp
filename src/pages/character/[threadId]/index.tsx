// src/pages/character/[threadId]/index.tsx

import dynamic from "next/dynamic";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next";

import CharacterLayout from "../../../components/Layouts/Character";
import PageLayout from "../../../components/Layouts/Page";
import { CharacterServerData } from "../../../types/characters";
import { getAPIUrlFromContext } from "../../../utils/ssr";
import { META_DESCRIPTION } from "../../../utils/constants";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface CharacterPageProps {
  serverData: CharacterServerData;
}

const CharacterPage: NextPage<CharacterPageProps> = ({ serverData }) => {
  const title = serverData?.data.json?.name
    ? serverData?.data.json?.name + " on Fabularius AI"
    : "New character on Fabularius AI";
  const description = serverData?.data?.summary ?? META_DESCRIPTION;
  const image =
    serverData?.data?.avatar?.original ??
    serverData?.data.imagesMultisize?.[0]?.original ??
    "";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta itemProp="name" content={title} />
        <meta itemProp="description" content={description} />
        <meta itemProp="image" content={image} />

        <meta
          property="og:url"
          content={`https://fabularius.ai/character/${serverData?.threadId}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
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
              thread={serverData?.thread}
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
