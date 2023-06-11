import React, { useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {
  const {activityStore} = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])
  //  ↑ prevent the event from fire multiple times

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading app' />

  return (
    //we not allowed to return 2 different elements 
    //which have the same level inside a react component so wrap it with <></>
    <>
      {/* {console.log(activityStore.activities)} */}
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashBoard />
      </Container>
    </>
  );
}

export default observer(App);
