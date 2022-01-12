// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appName: 'Supervisor',
    appLogoImage: require('@src/assets/images/logo/supervisor.svg').default
  },
  layout: {
    isRTL: false,
    skin: 'light', // light, dark, bordered, semi-dark
    routerTransition: 'fadeIn', // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: 'vertical', // vertical, horizontal
    contentWidth: 'full', // full, boxed
    menu: {
      isHidden: true, //Con esto se quita o pone el menu
      isCollapsed: false
    },
    navbar: {//Con type se controla la barra superior
      // ? For horizontal menu, navbar type will work for navMenu type
      type: 'hidden', // static (original), sticky , floating, hidden
      backgroundColor: 'primary' // BS color options [primary, success, etc]
    },
    footer: {
      type: 'static' // static, sticky, hidden
    },
    customizer: true,
    scrollTop: true // Enable scroll to top button
  }
}

export default themeConfig
