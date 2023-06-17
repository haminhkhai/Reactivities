import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import { useStore } from '../stores/store';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modal/ModalContainer';

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    //we not allowed to return 2 different elements 
    //which have the same level inside a react component so wrap it with <></>
    <>
      <ToastContainer position='bottom-right' theme='colored' />
      <ModalContainer />
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
