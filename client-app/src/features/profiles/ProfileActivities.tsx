import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useEffect } from 'react';
import { useStore } from '../../app/stores/store';
import { Tab, TabProps } from 'semantic-ui-react';
import UserActivityCard from './UserActivityCard';

export default observer(function ProfileActivities() {
    const { profileStore: { loadingActivities, loadActivities, userActivities } } = useStore();

    function handleTabChange(e: SyntheticEvent, data: TabProps) {
        if (data.activeIndex == 0) loadActivities('future')
        else if (data.activeIndex == 1) loadActivities('past')
        else loadActivities('hosting')
    }

    const panes = [
        {
            menuItem: 'Future Events',
            render: () => <Tab.Pane basic loading={loadingActivities} attached={false}><UserActivityCard userActivities={userActivities} /></Tab.Pane>,
        },
        {
            loading: { loadingActivities },
            menuItem: 'Past Events',
            render: () => <Tab.Pane basic loading={loadingActivities} attached={false}><UserActivityCard userActivities={userActivities} /></Tab.Pane>,
        },
        {
            loading: { loadingActivities },
            menuItem: 'Hosting',
            render: () => <Tab.Pane basic loading={loadingActivities} attached={false}><UserActivityCard userActivities={userActivities} /></Tab.Pane>,
        },
    ]

    useEffect(() => {
        loadActivities('future');
    }, [loadActivities])

    return (
        <Tab.Pane>
            <Tab
                menu={{ secondary: true, pointing: true }}
                panes={panes}
                onTabChange={(e, data) => handleTabChange(e, data)}
            />
        </Tab.Pane>

    )
})

