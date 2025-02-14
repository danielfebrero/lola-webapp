import dynamic from "next/dynamic";
import Head from "next/head";
import { GetServerSideProps } from "next";

import PageLayout from "../../../components/Layouts/Page";
import ExploreFeedLayout from "../../../components/Layouts/ExploreFeed";
import { Character } from "../../../types/characters";
import { getAPIUrlFromContext } from "../../../utils/ssr";
import { Story } from "../../../types/stories";
import { ChatLog } from "../../../types/chat";

const App = dynamic(() => import("../../../App"), {
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
    <>
      <Head>
        <title>Explore latest stories on Fabularius AI</title>
      </Head>
      <div
        id="ssr-root"
        className="no-scrollbar overflow-hidden h-screen w-screen"
      >
        <PageLayout headerDropdownLabel="Latest">
          <ExploreFeedLayout data={data} />
        </PageLayout>
      </div>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  const adult = query.adult;
  let fetchQuery = adult === "1" ? "?mode=adult" : "?mode=minor";

  fetchQuery += "&type=stories";

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
