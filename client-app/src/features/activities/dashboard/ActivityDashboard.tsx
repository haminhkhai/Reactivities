import React from 'react';
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivityDashBoard() {

    const {activityStore} = useStore();
    const {selectedActivity, editMode} = activityStore;

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
                {
                    selectedActivity && !editMode &&
                    <ActivityDetails />
                }
                {
                    editMode &&
                    <ActivityForm />
                }
            </Grid.Column>
        </Grid>
    )
})