import { useState } from 'react'
import * as React from 'react'
import { Field, Form, Formik, FormikState, FormikHelpers } from 'formik'
import LoggedIn from 'src/templates/LoggedIn'
import { Button, List } from 'antd'
import { CustomInput } from 'src/components/CustomField'
import { nullSubmit } from 'src/utils'

interface IList {
  item: string
  amount: number
  edit?: boolean
  id: string | number
}

interface IInitialValues {
  item: string
  [k: string]: any
}

export default () => {
  const [list, changeList] = useState<IList[]>([])

  const initialValues: IInitialValues = {
    item: '',
    ...list.reduce((result, item) => ({ ...result, [item.id]: item.item }), {}),
  }

  const removeItem = (itemId: string | number) => changeList(list.filter(({ id }) => id !== itemId))
  const updateItem = (id: string | number, newItem: IList) =>
    changeList(list.map(item => (id === item.id ? newItem : item)))
  const handleSubmit = ({ values, ...form }: FormikState<any> & FormikHelpers<{}>) => {
    if (values.item) {
      changeList([
        ...list,
        {
          item: values.item,
          amount: 1,
          edit: false,
          id: Date.now(),
        },
      ])
    }

    form.resetForm()
  }

  return (
    <LoggedIn>
      <Formik initialValues={initialValues} enableReinitialize onSubmit={nullSubmit}>
        {form => (
          <Form onSubmitCapture={handleSubmit.bind(null, form)}>
            <List
              header={
                <div style={{ display: 'grid', gridTemplate: 'auto / 1fr auto', gap: '1em' }}>
                  <Field
                    placeholder="Insert a new item"
                    type="text"
                    name="item"
                    component={CustomInput}
                  />
                  <Button type="primary" htmlType="submit">
                    Ok
                  </Button>
                </div>
              }
              bordered
              dataSource={list}
              renderItem={listItem => (
                <List.Item>
                  <div
                    style={{
                      width: '100%',
                      display: 'grid',
                      gridTemplate: 'auto / 1fr auto',
                      gap: '1em',
                      alignItems: 'center',
                    }}
                  >
                    {!listItem.edit && (
                      <>
                        <span
                          onClick={() => {
                            updateItem(listItem.id, { ...listItem, edit: true })
                            form.setFieldValue('item', '')
                            form.setFieldValue(`${listItem.id}`, listItem.item)
                          }}
                        >
                          {listItem.item}
                        </span>
                        <Button
                          type="primary"
                          shape="circle"
                          icon="delete"
                          onClick={removeItem.bind(null, listItem.id)}
                        />
                      </>
                    )}
                    {listItem.edit && (
                      <Field
                        placeholder="Type something and press enter. Erase the field to delete."
                        autoFocus
                        name={`${listItem.id}`}
                        component={CustomInput}
                        onKeyDown={(event: KeyboardEvent & InputEvent) => {
                          if (event.keyCode === 13) {
                            event.preventDefault()
                            if (`${form.values[`${listItem.id}`]}`.trim() === '') {
                              removeItem(listItem.id)
                            } else {
                              updateItem(listItem.id, {
                                ...listItem,
                                item: form.values[`${listItem.id}`],
                                edit: false,
                              })
                            }
                          }
                        }}
                        onBlur={() => {
                          if (`${form.values[`${listItem.id}`]}`.trim() === '') {
                            removeItem(listItem.id)
                          } else {
                            updateItem(listItem.id, { ...listItem, edit: false })
                          }
                        }}
                      />
                    )}
                  </div>
                </List.Item>
              )}
            />
          </Form>
        )}
      </Formik>
    </LoggedIn>
  )
}
