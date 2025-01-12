import dynamic from "next/dynamic";

const App = dynamic(() => import("../../App"), {
  ssr: false,
});

const CharacterPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-darkMainSurfacePrimary no-scrollbar overflow-hidden h-screen w-screen">
      <div className="fixed w-screen h-screen top-0 left-0 z-1">
        <App />
      </div>
    </div>
  );
};

export default CharacterPage;
