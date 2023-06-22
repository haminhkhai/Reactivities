import React, { useState } from 'react';
import { Button, Container, Grid, Header, Tab } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import { Profile } from '../../app/models/profile';
import { Form, Formik } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import MyTextArea from '../../app/common/form/MyTextArea';

export default function ProfileAbout() {
    const [editMode, setEditMode] = useState(false);
    const { profileStore: { isCurrentUser, editProfile, profile } } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display name is required')
    })

    function handleFormSubmit(profile: Partial<Profile>) {
        editProfile(profile).then(() => setEditMode(false));
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='user' content={`About ${profile?.displayName}`} />
                    {isCurrentUser &&
                        <Button
                            floated='right' basic
                            content={editMode ? 'Cancel' : 'Edit Profile'}
                            onClick={() => setEditMode(!editMode)}
                        />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ? (
                        <Formik
                            initialValues={{ displayName: profile?.displayName, bio: profile?.bio }}
                            onSubmit={values => handleFormSubmit(values)}
                            validationSchema={validationSchema}
                        >
                            {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                                <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                                    <MyTextInput name='displayName' placeholder='Display name' />
                                    <MyTextArea rows={5} name='bio' placeholder='Bio' />
                                    <Button
                                        disabled={isSubmitting || !dirty || !isValid}
                                        loading={isSubmitting} floated="right"
                                        positive type="submit" content="Update profile"
                                    />
                                </Form>
                            )}
                        </Formik>
                    ) : (
                        <Container>
                            <p style={{whiteSpace:'pre-line'}}>{profile?.bio}</p>
                        </Container>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}