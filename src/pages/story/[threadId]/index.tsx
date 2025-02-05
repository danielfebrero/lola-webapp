import dynamic from "next/dynamic";

import PageLayout from "../../../components/Layouts/Page";
import { GetServerSideProps } from "next";
import Head from "next/head";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface StoryPageProps {
  data: Story;
  isOwner: boolean;
  threadId: string;
}

const StoryPage: React.FC<StoryPageProps> = ({ data, isOwner, threadId }) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          {data.title
            ? data.title +
              " - Story on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."
            : "New story on Fabularius AI - Choose your own adventure, storyteller, chatbot, character and image generator."}
        </title>
      </Head>
      <PageLayout headerDropdownLabel={"Story"}>{""}</PageLayout>
      {/* <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { threadId } = context.params!;
  const host = context.req.headers.host || "";
  const isDevDomain =
    host.includes("dev.fabularius.ai") || host.includes("localhost");

  if (threadId === "new")
    return { props: { data: { thread_id: "new" }, threadId } };

  const res = await fetch(
    isDevDomain
      ? `https://devapi.fabularius.ai/dev/story?threadId=${threadId}`
      : `https://prodapi.fabularius.ai/prod/story?threadId=${threadId}`
  );

  if (!res.ok) {
    return { props: { data: { thread_id: "new" }, threadId } };
  }

  const result = await res.json();

  return {
    props: {
      data: result.data,
      isOwner: result.isOwner,
      threadId,
    },
  };
};

export default StoryPage;
