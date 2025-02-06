import dynamic from "next/dynamic";
import Head from "next/head";

import PageLayout from "../../components/Layouts/Page";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>Explore images on Fabularius AI</title>
      </Head>
      <PageLayout headerDropdownLabel="Images">{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;
