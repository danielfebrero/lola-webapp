import dynamic from "next/dynamic";
import Head from "next/head";

import PageLayout from "../../components/Layouts/Page";
import ExploreFeedLayout from "../../components/Layouts/ExploreFeed";
import { GetServerSideProps } from "next";
import { Character } from "../../types/characters";
import { getAPIUrlFromContext } from "../../utils/ssr";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

interface ExploreBestPageProps {
  data: {
    thread: ChatLog;
    character: Character;
    story: Story;
  }[];
}

const ExploreBestPage: React.FC<ExploreBestPageProps> = ({ data }) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Explore best content on Fabularius AI - Choose your own adventure,
          storyteller, chatbot, character and image generator.
        </title>
      </Head>
      <PageLayout headerDropdownLabel="Best Content">
        <ExploreFeedLayout data={data} />
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const adult = query.adult;
  const fetchQuery = adult === "1" ? "?mode=adult" : "?mode=minor";

  const res = await fetch(
    getAPIUrlFromContext(context) + "/explore/best" + fetchQuery
  );

  if (!res.ok) {
    return { props: { data: [] } };
  }

  const result = await res.json();

  return {
    props: {
      data: result,
    },
  };
};

export default ExploreBestPage;
