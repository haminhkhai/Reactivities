import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate)
                } else {
                    this.followings = [];
                }
            }
        )
    }

    setActiveTab = (activeTab: any) => this.activeTab = activeTab;

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            // this will return true if these two username match
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            //post to endpoint
            await agent.Profiles.setMainPhoto(photo.id);
            //change component state to re-render react component
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    //find current main photo and set isMain to false
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    //find selected photo and set isMain to true
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    //set profile image to selected photo
                    this.profile.image = photo.url;
                    //reload activity dashboard
                    store.activityStore.loadActivities();
                    this.loading = false;
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (id: string) => {
        this.loading = true;
        try {
            //post to endpoint
            await agent.Profiles.deletePhoto(id);
            //change component state to re-render react component
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(p => p.id !== id);
                    this.loading = false;
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    editProfile = async (profile: Partial<Profile>) => {
        try {
            await agent.Profiles.edit(profile)
            runInAction(() => {
                if (profile.displayName
                    && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName!)
                }
                this.profile = { ...this.profile, ...profile as Profile }
                //reload activity dashboard
                store.activityStore.loadActivities();
            });
        } catch (error) {
            console.log(error);
        }
    }
    /////////following parameter is whether we follow this target user or not
    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                console.log(this.profile?.username + ' ' + username)
                //currenly logged in user view other user's profile and 
                //follow/unfollow that user 
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }

                //currently logged in user watching his own profile and
                //follow or unfollow another user
                if (this.profile && this.profile.username === store.userStore.user?.username) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }

                //update state of following/followers tab
                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        //this profile.following means that wheter currently logged in user
                        //is follow this target user
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}