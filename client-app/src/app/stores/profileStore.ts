import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import UserStore from "./userStore";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

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


}