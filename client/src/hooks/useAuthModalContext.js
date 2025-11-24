import AuthModalContext from "@/contexts/authmodel-context";
import { useContext } from "react";

export const useAuthModal = () => useContext(AuthModalContext);
