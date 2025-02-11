import dynamic from "next/dynamic";

import PageLayout from "../../../../components/Layouts/Page";

const App = dynamic(() => import("../../../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <>
      <div
        id="ssr-root"
        className="no-scrollbar overflow-hidden h-screen w-screen"
      >
        <PageLayout headerDropdownLabel="Order received">{""}</PageLayout>
      </div>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </>
  );
};

export default ExplorePage;
