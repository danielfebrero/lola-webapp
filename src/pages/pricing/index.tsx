import dynamic from "next/dynamic";

import PageLayout from "../../components/Layouts/Page";
import PricingLayout from "../../components/Layouts/Pricing";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const ExplorePage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <PageLayout headerDropdownLabel="Pricing">
        <PricingLayout />
      </PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default ExplorePage;
