import React, { useEffect } from 'react';
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';

export default observer(function ActivityDashBoard() {

    const { activityStore } = useStore();
    const { loadActivities, activityRegistry } = activityStore;

    useEffect(() => {
        if (activityRegistry.size <= 1)
            loadActivities();
    }, [activityRegistry.size, loadActivities])
    //  ↑ prevent the event from fire multiple times

    if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

    return (
        <Grid>
            <GridColumn width='10'>
                <ActivityList />
            </GridColumn>
            <Grid.Column width='6'>
                {/* double ampersands (&&) means anything to the right of it will be execute 
                so long as the left side is not null or undefined */}
                {/* why you need this operator is because while react is trying to display this component 
                but the Activity doesn't exist at this stage  */}
                {/* {
                    selectedActivity && !editMode &&
                    <ActivityDetails />
                }
                {
                    editMode &&
                    <ActivityForm />
                } */}
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    )
})