import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';

function App() {
  const location = useLocation();
  return (
    //we not allowed to return 2 different elements 
    //which have the same level inside a react component so wrap it with <></>
    <>
    <ToastContainer position='bottom-right' theme='colored' />
      {
        location.pathname === '/' ? <HomePage /> :
          (<>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              {/* react-route package */}
              <Outlet />
            </Container>
          </>)
      }
    </>
  );
}
export default observer(App);
