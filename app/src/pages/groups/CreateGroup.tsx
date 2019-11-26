import { useState } from 'react'
import * as React from 'react'
import LoggedIn from '../../templates/LoggedIn'
import {Card, Icon, Input, Form as AntdForm, Button, Divider} from 'antd'
import { Formik, Field, Form } from 'formik'

interface IInitialValues {
  item: string
  [k: string]: any
}

const CreateGroup:React.FunctionComponent<any> = () => {
    
    return (
        <LoggedIn subtitle="Groups / Create">
            <div className="groups-create inner-content">
            <h3>Create new group</h3>
            <Formik initialValues={{
                name: "",
                users: []
            }} 
                onSubmit={(e) => {console.log(e)}}
            >
                <Form>
                <AntdForm.Item label="Group name">
                    <Field name="name"  type="text" component={Input} />
                </AntdForm.Item>

                <Divider />

                <h4>Invite people to your list</h4>
                <br />
                <AntdForm.Item>
                    <Field name="name" type="email" placeholder="Type an email and press enter" component={Input} />
                </AntdForm.Item>


                <Button htmlType="submit">Submit</Button>
                </Form>
            </Formik>
            </div>
        </LoggedIn>
    )
}

export default CreateGroup