import React from "react";

const ProfilePageContext = React.createContext({
  profileData: null,
  activities: null,
});

export default ProfilePageContext;

export const useProfilePageContext = () => React.useContext(ProfilePageContext);
