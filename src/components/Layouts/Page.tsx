import LeftPanelLayout from "./LeftPanel";
import HeaderLayout from "./Header";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  headerDropdownLabel: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  headerDropdownLabel,
}) => {
  return (
    <div className="text-textPrimary dark:text-darkTextPrimary h-screen w-screen flex flex-row">
      <LeftPanelLayout />
      <div className="flex flex-col h-screen overflow-y-scroll w-full bg-white dark:bg-darkMainSurfacePrimary no-scrollbar w-full">
        <div className="flex flex-col grow overflow-y-scroll no-scrollbar">
          <HeaderLayout dropdownLabel={headerDropdownLabel} />
          {children}
        </div>
        <div className="flex w-full">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
