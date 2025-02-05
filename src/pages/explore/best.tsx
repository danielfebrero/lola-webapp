import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import Head from "next/head";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Explore best content on Fabularius AI - Choose your own adventure,
          storyteller, chatbot, character and image generator.
        </title>
      </Head>
      <PageLayout headerDropdownLabel="Best Content">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;
