import { useTranslation } from "react-i18next";

import Meta from "../../components/Meta";

interface ExplorePageProps {
  type: string;
}

const ExplorePage: React.FC<ExplorePageProps> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Meta title={t(props.type === "best" ? "Best content" : "Latest")} />
      <div className="grow pl-5 pr-5 pt-2.5 pb-5 flex flex-row">
        <div className="grow flex flex-col h-[calc(100vh-110px)]"></div>
      </div>
    </>
  );
};

export default ExplorePage;
