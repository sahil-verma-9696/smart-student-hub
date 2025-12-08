import React from "react";
import ProfilePageContext from "../contexts/profile-page-context";
import Profile from "../Profile";
import useProfilePageLogic from "../hooks/useProfilePageLogic";

export default function ProfilePageProvider() {
  const contextValue = useProfilePageLogic();
  return (
    <ProfilePageContext.Provider value={contextValue}>
      <Profile />
    </ProfilePageContext.Provider>
  );
}
