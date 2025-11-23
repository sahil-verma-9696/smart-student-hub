import { AuthContext } from '@/contexts/Auth'
import React, { useContext } from 'react'

const useAuthContext = () => {
    return useContext(AuthContext)
  
}

export default useAuthContext