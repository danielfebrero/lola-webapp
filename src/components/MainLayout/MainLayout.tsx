// src/components/MainLayout.tsx
import React from "react";
import { Outlet } from "react-router";
import Header from "../Header";
import LeftPanel from "../LeftPanel";
import Overlay from "../Overlay";
import Settings from "../Settings";
import LoginModal from "../LoginModal";
import Footer from "../Footer";

const MainLayout: React.FC = () => {
  return (
    <div className="app text-textPrimary dark:text-darkTextPrimary flex flex-row no-scrollbar overflow-hidden">
      <Overlay>
        <Settings />
        <LoginModal />
      </Overlay>
      <LeftPanel />
      <div className="flex flex-col h-screen overflow-y-scroll w-full z-10 bg-white dark:bg-darkMainSurfacePrimary no-scrollbar">
        <Header />
        <Outlet /> {/* This will render the nested routes */}
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
