import dynamic from "next/dynamic";
import Head from "next/head";

import PageLayout from "../../components/Layouts/Page";
import { META_DESCRIPTION } from "../../utils/constants";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const NewLolaPage: React.FC = () => {
  const title = "Lola chatbot on Fabularius AI";
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
        <meta property="og:url" content={`https://fabularius.ai/lola/new`} />
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
        <PageLayout headerDropdownLabel="Lola">{""}</PageLayout>
      </div>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </>
  );
};

export default NewLolaPage;
