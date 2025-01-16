import dynamic from "next/dynamic";

import LandingLayout from "../../components/Layouts/Landing";
import Head from "next/head";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const EighteenPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Lola for Adults</title>
      </Head>
      <div className="no-scrollbar overflow-hidden h-screen w-screen">
        <LandingLayout />
        <div className="fixed w-screen h-screen top-0 left-0 z-1">
          <App />
        </div>
      </div>
    </>
  );
};

export default EighteenPage;
