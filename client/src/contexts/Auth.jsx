import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext({
    isUserAuthenticated: false,
    userRole: "",
    setIsUserAuthenticated:()=>{},
    setUserRole:()=>{}
});

const AuthProvider = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const[userRole,setUserRole] = useState("")
    const contextValue = { isUserAuthenticated,userRole,setIsUserAuthenticated,setUserRole}

    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>

}
export default AuthProvider;