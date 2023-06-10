import React from 'react';
import { Grid, GridColumn } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';


interface Props {
    activities: Activity[];
    selectedActivity: Activity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    editMode: boolean;
    openForm: (id: string) => void;
    closeForm: () => void;
    createOrEdit: (activity: Activity) => void;
    deleteActivity: (id: string) => void;
    submitting: boolean;
}

export default function ActivityDashBoard({ activities, selectedActivity, deleteActivity, submitting,
    selectActivity, cancelSelectActivity, openForm, closeForm, editMode, createOrEdit}: Props) {
    return (
        <Grid>
            <GridColumn width='10'>
                <ActivityList 
                    deleteActivity={deleteActivity} 
                    activities={activities} 
                    selectActivity={selectActivity} 
                    submitting={submitting}
                />
            </GridColumn>
            <Grid.Column width='6'>
                {/* double ampersands (&&) means anything to the right of it will be execute 
                so long as the left side is not null or undefined */}
                {/* why you need this operator is because while react is trying to display this component 
                but the Activity doesn't exist at this stage  */}
                {
                    selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />
                }
                {
                    editMode &&
                    <ActivityForm 
                        closeForm={closeForm} 
                        activity={selectedActivity} 
                        createOrEdit={createOrEdit} 
                        submitting={submitting}
                    />
                }
            </Grid.Column>
        </Grid>
    )
}