import { useState } from "react";
import { createContext } from "react";

export const AuthContext = createContext({
    isUserAuthenticated: false,
    userRole: "",
});

const AuthProvider = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const contextValue = { isUserAuthenticated}

    return <AuthContext.Provider value={contextValue}>
        {children}
    </AuthContext.Provider>

}
export default AuthProvider;