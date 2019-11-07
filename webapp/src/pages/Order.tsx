import { useState } from 'react'
import * as React from 'react'
import axios from 'axios'
import { Field, Form, Formik, FormikState, FormikHelpers } from 'formik'
import LoggedIn from 'src/templates/LoggedIn'
import { Button, List, Spin } from 'antd'
import { CustomInput } from '../components/CustomField'
import { nullSubmit } from '../utils'
import ProductPreview from '../components/ProductPreview'
import { useAuth0 } from '../providers/react-auth0-spa'
import { IProductItem } from 'types/IProductItem'

interface IInitialValues {
  item: string
  [k: string]: any
}

export default () => {
  const [list, changeList] = useState<IProductItem[]>([])
  const [isFetching, changeFetch] = useState<boolean>(false)
  const initialValues: IInitialValues = {
    item: '',
    ...list.reduce((result, item) => ({ ...result, [item.id]: item.name }), {}),
  }
  const { user, isAuthenticated, loginWithRedirect, logout, loading } = useAuth0()
  const removeItem = (itemId: string | number) => changeList(list.filter(({ id }) => id !== itemId))
  const updateItem = (id: string | number, newItem: IProductItem) =>
    changeList(list.map(item => (id === item.id ? newItem : item)))
  const submitList = (listItems: IProductItem[]) => {
    try {
      changeFetch(true)
      const response = axios.post('htt[://localhost:3333/place-order', { list: listItems })
      console.log(response)
    } catch (e) {
      console.log('error')
    } finally {
      changeFetch(false)
    }
  }

  const handleSubmit = async ({ values, ...form }: FormikState<any> & FormikHelpers<{}>) => {
    if (values.item) {
      try {
        changeFetch(true)
        const {
          data: { name, image, sku, url },
        } = await axios.post('http://localhost:3333/', { url: values.item })
        changeList([
          ...list,
          {
            url,
            name,
            image,
            id: sku,
            amount: 1,
            edit: false,
          },
        ])
      } catch (e) {
        console.log('deu errado ', e)
        changeFetch(false)
      }

      changeFetch(false)
    }

    form.resetForm()
  }

  return (
    <LoggedIn>
      {!isAuthenticated && <p onClick={() => loginWithRedirect({})}>Login pay</p>}
      {isAuthenticated && (
        <div>
          <pre>{JSON.stringify(user, null, 2)}</pre>
          <p onClick={logout}>logot</p>
        </div>
      )}
      {loading && <Spin />}
      {process.env.REACT_APP_CLIENT_ID}
      {process.env.REACT_APP_DOMAIN}

      <Formik initialValues={initialValues} enableReinitialize onSubmit={nullSubmit}>
        {form => (
          <Form onSubmitCapture={handleSubmit.bind(null, form)}>
            <div className="page page-home">
              <List
                header={
                  <div className="search-wrapper">
                    <Field
                      disabled={isFetching}
                      placeholder="Paste your product link here"
                      type="text"
                      name="item"
                      component={CustomInput}
                    />
                    <Button type="primary" loading={isFetching} htmlType="submit">
                      Ok
                    </Button>
                  </div>
                }
                bordered
                dataSource={list}
                renderItem={listItem => (
                  <List.Item>
                    <div className="list-item-wrapper">
                      <ProductPreview
                        product={listItem}
                        form={form}
                        removeItem={removeItem}
                        isFetching={isFetching}
                        updateItem={updateItem}
                      />
                    </div>
                  </List.Item>
                )}
              />
              <Button
                size="large"
                type="primary"
                icon="upload"
                disabled={list.length === 0}
                className="submit-list"
                onClick={e => submitList(list)}
              >
                Submit your list
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </LoggedIn>
  )
}
