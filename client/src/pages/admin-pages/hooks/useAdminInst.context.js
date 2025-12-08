import React from 'react'
import AdminInstPageContext from '../context/admin-inst.context';

export default function useAdminInstPageContext() {
  return React.useContext(AdminInstPageContext);
}
