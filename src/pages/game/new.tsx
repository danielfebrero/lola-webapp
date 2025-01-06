import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import Loading from "../../components/Loading";

import "../../index.css";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const NewGamePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel={"Choose your own adventure"}>
        <Loading />
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default NewGamePage;
