import React from 'react'
import AuthProvider from './contexts/Auth'
import { GlobalContextProvider } from './contexts/Global'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'

const App = () => {
  return (
    <>
      <AuthProvider>
        <GlobalContextProvider>
          <RouterProvider router={routes} />
        </GlobalContextProvider>
      </AuthProvider>
    </>
  )
}

export default App;