import React from 'react';
import { format } from "date-fns"
import { Card, Grid, GridColumn, Image } from "semantic-ui-react"
import { UserActivity } from "../../app/models/profile"
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

interface Props {
    userActivities: UserActivity[];
}

export default observer(function UserActivityCard({ userActivities }: Props) {
    return (
        <Grid doubling stackable>
            {userActivities?.map((userActivity) => (
                <Grid.Column width={4}>
                    <Card as={Link} to={`/activities/${userActivity.id}`} key={userActivity.id}>
                        <Image src={`/assets/categoryImages/${userActivity.category}.jpg`} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header>{userActivity.title}</Card.Header>
                            <Card.Meta>
                                <span className='date'>{format(userActivity.date!, 'd MMM h:mm aa')}</span>
                                {/* <span className='date'>{userActivity.date.toString()}</span> */}
                            </Card.Meta>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            ))}
        </Grid>
    )
})

