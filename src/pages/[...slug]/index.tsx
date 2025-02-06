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

interface ExploreLatestPageProps {
  data: {
    thread: ChatLog;
    character: Character;
    story: Story;
  }[];
}

const ExploreLatestPage: React.FC<ExploreLatestPageProps> = ({ data }) => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>Explore latest content on Fabularius AI</title>
      </Head>
      <PageLayout headerDropdownLabel="Latest">
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
    getAPIUrlFromContext(context) + "/explore/latest" + fetchQuery
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

export default ExploreLatestPage;
