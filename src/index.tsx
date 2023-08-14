import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { theme, Loader, Title } from '@gnosis.pm/safe-react-components'
import { SafeProvider } from '@safe-global/safe-apps-react-sdk';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CarDetailPage from './components/CarDetail';

import GlobalStyle from './GlobalStyle'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <SafeProvider
        loader={
          <>
            <Title size="md">Waiting for Safe...</Title>
            <Loader size="md" />
          </>
        }
      ><Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/car/:carUniqueId" element={<CarDetailPage />} />
          </Routes>
        </Router>
      </SafeProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
