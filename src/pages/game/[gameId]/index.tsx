import dynamic from "next/dynamic";

import PageLayout from "../../../components/Layouts/Page";
import Head from "next/head";

const App = dynamic(() => import("../../../App"), {
  ssr: false,
});

const GamePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>New game on Fabularius AI</title>
      </Head>
      <div
        id="ssr-root"
        className="no-scrollbar overflow-hidden h-screen w-screen"
      >
        <PageLayout headerDropdownLabel={"Choose your own adventure"}>
          {""}
        </PageLayout>
      </div>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </>
  );
};

export default GamePage;
