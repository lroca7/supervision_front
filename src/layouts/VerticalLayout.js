// !Do not remove the Layout import
import Layout from '@layouts/VerticalLayout'

// const VerticalLayout = props => <Layout {...props}>{props.children}</Layout>

// const VerticalLayout = props => (
//   <Layout navbar='I am in navbar, Everything else is removed' {...props}>
//     {props.children}
//   </Layout>
// )

// const Menu = () => {
//   return (
//     <ul className='pl-2'>
//       <li>Menu Item 1</li>
//       <li>Menu Item 2</li>
//     </ul>
//   )
// }

const VerticalLayout = props => (
  <Layout 
    // menu={<Menu />}  
    // navbar='I am in navbar, Everything else is removed'
    footer='@Supervisor 2021'
    {...props}>
    {props.children}
  </Layout>
)

export default VerticalLayout
