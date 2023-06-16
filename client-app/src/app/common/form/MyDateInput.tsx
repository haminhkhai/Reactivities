import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import DatePicker, {ReactDatePickerProps} from 'react-datepicker';

///////////////////////////////////////////Partial is like it's only inherit a partial of the interface
///////////////////////////////////////////which makes all the props optional
export default function MyDateInput(props: Partial<ReactDatePickerProps>) {
    const [field, meta, helpers] = useField(props.name!);
    return (
        /////////////////////////////////////cast an object to a bolean 
        <Form.Field error={meta.touched && !!meta.error}>
            <DatePicker
                {...field}
                {...props}
                ///////////if field.value != nullorempty selected = new Date(field.value) else selected = null
                selected={(field.value && new Date(field.value)) || null}
                onChange={value => helpers.setValue(value)}
            />
            {meta.touched && meta.error ? (
                <Label basic color='red'>{meta.error}</Label>
            ) : null}
        </Form.Field>
    )
}