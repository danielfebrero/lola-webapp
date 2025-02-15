import dynamic from "next/dynamic";

import PageLayout from "../../../components/Layouts/Page";
import { GetServerSideProps } from "next";
import Head from "next/head";
import StoryLayout from "../../../components/Layouts/Story";
import NewStoryLayout from "../../../components/Layouts/NewStory";
import { getAPIUrlFromContext } from "../../../utils/ssr";
import { StoryServerData } from "../../../types/stories";
import { META_DESCRIPTION } from "../../../utils/constants";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface StoryPageProps {
  serverData: StoryServerData;
}

const StoryPage: React.FC<StoryPageProps> = ({ serverData }) => {
  const title = serverData?.title
    ? serverData?.title + " - Story on Fabularius AI"
    : "New story on Fabularius AI";
  const description = META_DESCRIPTION;
  const image = "/logo512.png";
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
          content={`https://fabularius.ai/story/${serverData?.threadId}`}
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
        <PageLayout headerDropdownLabel={"Story"}>
          {serverData?.threadId === "new" ? (
            <NewStoryLayout />
          ) : (
            <StoryLayout chatLog={serverData?.data.chatLog} />
          )}
        </PageLayout>
      </div>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App storyServerData={serverData} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!;

  if (threadId === "new")
    return { props: { data: { thread_id: "new" }, threadId } };

  const res = await fetch(
    getAPIUrlFromContext(context) + "/story?threadId=" + threadId
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

export default StoryPage;
