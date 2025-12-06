import NotificationContext from "@/contexts/notification-context";

const NotificationContextProvider = ({ children }) => {

  // connect with socket here
  // write logic for notification 
  return <NotificationContext.Provider value={{}}>{children}</NotificationContext.Provider>;
};

export default NotificationContextProvider;
