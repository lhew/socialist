import { Button } from 'antd'
import * as React from 'react'
import { FormikHelpers } from 'formik'
import { IList } from 'src/pages/Home'

interface IProductReview {
  form: FormikHelpers<any>
  product: IList
  isFetching: boolean
  removeItem(id: string | number): void
  updateItem(id: string | number, newItem: IList): void
}

const ProductPreview = ({ product, form, updateItem, removeItem, isFetching }: IProductReview) => {
  return (
    <div className="product-review">
      {product.image && <img src={product.image} alt={product.name} width="120" height="auto" />}
      <span
        onClick={() => {
          updateItem(product.id, { ...product, edit: true })
          form.setFieldValue('item', '')
          form.setFieldValue(`${product.id}`, product.name)
        }}
      >
        {product.name}
      </span>
      <Button
        loading={isFetching}
        type="primary"
        shape="circle"
        icon="delete"
        onClick={removeItem.bind(null, product.id)}
      />
    </div>
  )
}

export default ProductPreview
