import storageKeys from "@/common/storage-keys";
import React from "react";
import useAuthContext from "./useAuthContext";
import useGlobalContext from "./useGlobalContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function useAuthantication() {
  /******************************************
   * variables
   ********************************************/
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  /******************************************
   * hooks invokation
   ********************************************/
  const navigate = useNavigate();

  /******************************************
   * Custom hooks invokation
   ********************************************/
  const { setIsUserAuthenticated, setUserRole } = useAuthContext();
  const { setUser } = useGlobalContext();

  /******************************************
   * Functions
   ********************************************/
  async function login() {}

  /***************** logout *************************/
  async function logout() {
    // const res = await fetch(`${BASE_URL}/user/logout`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem(
    //       storageKeys.accessToken
    //     )}`,
    //   },
    // });
    // if (res.ok) {
    //   navigate("/");
    //   setUser(null);
    // }

    localStorage.removeItem(storageKeys.accessToken);
    localStorage.removeItem(storageKeys.userRole);
    localStorage.removeItem(storageKeys.userDetails);
    localStorage.removeItem(storageKeys.instituteDetails);
    localStorage.removeItem(storageKeys.userRole);
    localStorage.removeItem(storageKeys.expiresAt);
    setIsUserAuthenticated(false);
    setUserRole("");
    setUser(null);
    navigate("/");
    toast.success("Logout successful");
  }
  return {
    login,
    logout,
  };
}
