import LeftPanelLayout from "../../components/Layouts/LeftPanel";

const CharacterPage: React.FC = () => {
  setTimeout(() => {
    typeof window !== "undefined" &&
      window.history.pushState(null, "", "/character/new");
  }, 1000);

  return (
    <>
      <LeftPanelLayout />
    </>
  );
};

export default CharacterPage;
