// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

const VerticalLayout = props => (
  <Layout navbar='I am in navbar, Everything else is removed'  menu={<CustomMenu />} footer={<CustomFooter />} {...props}>
    {props.children}
  </Layout>
)

export default VerticalLayout