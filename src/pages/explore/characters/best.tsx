import dynamic from "next/dynamic";
import Head from "next/head";

import PageLayout from "../../../components/Layouts/Page";
import ExploreFeedLayout from "../../../components/Layouts/ExploreFeed";
import { GetServerSideProps } from "next";
import { Character } from "../../../types/characters";
import { getAPIUrlFromContext } from "../../../utils/ssr";
import { Story } from "../../../types/stories";
import { ChatLog } from "../../../types/chat";
import { META_DESCRIPTION } from "../../../utils/constants";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

interface ExploreBestCharactersPageProps {
  data: {
    thread: ChatLog;
    character?: Character;
    story?: Story;
  }[];
}

const ExploreBestCharactersPage: React.FC<ExploreBestCharactersPageProps> = ({
  data,
}) => {
  const title = "Explore best characters on Fabularius AI";
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
          content={`https://fabularius.ai/explore/characters/best`}
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
        <PageLayout headerDropdownLabel="Characters">
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
  fetchQuery += "&exploreMode=best&exploreType=characters";

  const res = await fetch(
    getAPIUrlFromContext(context) + "/explore" + fetchQuery
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

export default ExploreBestCharactersPage;
