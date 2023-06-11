import React, { SyntheticEvent, useState } from 'react';

import { Segment, Button, Item, Label } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivityList() {
    const {activityStore} = useStore();
    const {deleteActivity, activityByDate, loading} = activityStore;

    const [target, setTarget] = useState('');

    function handleActivityDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
            <Item.Group divided>
                {activityByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => activityStore.selectActivity(activity.id)}
                                    floated="right" content="View" color="blue" />
                                <Button
                                    name={activity.id} floated="right"
                                    loading={loading && target === activity.id}
                                    // onclickevent will pass event(e) as an argument to the callbackfunction
                                    // and from there we can get button's name of clicked button 
                                    // and compare with the activity id of the item being delete 
                                    // to know what button to show loading indicator
                                    onClick={(e) => handleActivityDelete(e, activity.id)}
                                    content="Delete" color="red" />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})