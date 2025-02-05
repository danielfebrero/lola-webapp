import { Head } from "next/document";
import dynamic from "next/dynamic";
import PageLayout from "../components/Layouts/Page";

const App = dynamic(() => import("../App"), {
  ssr: false,
});

const CharacterPage: React.FC = () => {
  return (
    <div className="no-scrollbar overflow-hidden h-screen w-screen">
      <Head>
        <title>
          Fabularius AI - Choose your own adventure, storyteller, chatbot,
          character and image generator.
        </title>
      </Head>
      <PageLayout>{""}</PageLayout>
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default CharacterPage;
