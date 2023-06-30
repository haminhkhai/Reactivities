import React, { useEffect, useState } from 'react';
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import ActivityList from './ActivityList';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityFilters from './ActivityFilters';
import { PagingParams } from '../../../app/models/pagination';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityListItemPlaceholder from './ActivityListItemPlaceHolder';

export default observer(function ActivityDashBoard() {

    const { activityStore, userStore } = useStore();
    const { loadActivities, activityRegistry, setPagingParams, pagination } = activityStore;
    const [loadingNext, setLoadingNext] = useState(false);

    function handleGetNext() {
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage + 1));
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
        if (activityRegistry.size <= 1 && userStore.user) {
            loadActivities();
        }
    }, [loadActivities, activityRegistry.size, userStore.user])
    //  ↑ prevent the event from fire multiple times

    return (
        <Grid>
            <GridColumn width='10'>
                {
                    activityStore.loadingInitial && !loadingNext ? 
                    (<>
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                        <ActivityListItemPlaceholder />
                    </>) : 
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                    <ActivityList />
                    </InfiniteScroll>
                }

            </GridColumn>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext} />
            </Grid.Column>
        </Grid>
    )
})