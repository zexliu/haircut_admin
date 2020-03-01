import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/rbac',
    component: Layout,
    redirect: '/rbac/users/index',
    alwaysShow: true, // will always show the root menu
    name: 'RBAC',
    meta: {
      title: '权限系统',
      icon: 'lock',
      roles: ['ADMIN'] // you can set roles in root nav
    },
    children: [
      {
        path: 'users/index',
        component: () => import('@/views/rbac/user/index'),
        name: 'Users',
        meta: {
          title: '用户管理',
          icon: 'user',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'users/add',
        component: () => import('@/views/rbac/user/add'),
        name: 'AddUsers',
        hidden: true,
        meta: {
          title: '添加用户',
          icon: 'people',
          roles: ['ADMIN']
        }
      },
      {
        path: 'users/update/:id(\\d+)',
        component: () => import('@/views/rbac/user/update'),
        name: 'UpdateUser',
        hidden: true,
        meta: {
          title: '修改用户',
          icon: 'people',
          roles: ['admin']
        }
      },
      {
        path: 'groups/index',
        component: () => import('@/views/rbac/user-group/index'),
        name: 'UserGroups',
        meta: {
          title: '用户组管理',
          icon: 'peoples',
          roles: ['ADMIN'] // or
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'groups/add',
        component: () => import('@/views/rbac/user-group/add'),
        name: 'AddGroups',
        hidden: true,
        meta: {
          title: '添加用户组',
          icon: 'people',
          roles: ['ADMIN']
        }
      },
      {
        path: 'groups/update/:id(\\d+)',
        component: () => import('@/views/rbac/user-group/update'),
        name: 'UpdateGroups',
        hidden: true,
        meta: {
          title: '修改用户组',
          icon: 'people',
          roles: ['ADMIN']
        }
      },
      {
        path: 'roles/index',
        component: () => import('@/views/rbac/role/index'),
        name: 'Roles',
        meta: {
          title: '角色管理',
          icon: 'people',
          roles: ['ADMIN']
        }
      },
      {
        path: 'roles/add',
        component: () => import('@/views/rbac/role/add'),
        name: 'AddRole',
        hidden: true,
        meta: {
          title: '添加角色',
          icon: 'people',
          roles: ['ADMIN']
        }
      },
      {
        path: 'roles/update/:id(\\d+)',
        component: () => import('@/views/rbac/role/update'),
        name: 'UpdateRole',
        hidden: true,
        meta: {
          title: '修改角色',
          icon: 'people',
          roles: ['ADMIN']
        }
      },
      {
        path: 'permissions/index',
        component: () => import('@/views/rbac/permission/index'),
        name: 'Permission',
        meta: {
          title: '权限管理',
          icon: 'permission',
          roles: ['ADMIN']
        }
      },
      {
        path: 'permissions/add',
        component: () => import('@/views/rbac/permission/add'),
        name: 'AddPermission',
        hidden: true,
        meta: {
          title: '新增权限',
          icon: 'permission',
          roles: ['ADMIN']
        }
      },
      {
        path: 'permissions/update/:id(\\d+)',
        component: () => import('@/views/rbac/permission/update'),
        name: 'UpdatePermission',
        hidden: true,
        meta: {
          title: '修改权限',
          icon: 'permission',
          roles: ['ADMIN']
        }
      },
      {
        path: 'modules/index',
        component: () => import('@/views/rbac/permission-module/index'),
        name: 'Module',
        meta: {
          icon: 'module',
          title: '权限模块管理',
          roles: ['ADMIN']
        }
      },
      {
        path: 'modules/add',
        component: () => import('@/views/rbac/permission-module/add'),
        name: 'AddModule',
        hidden: true,
        meta: {
          title: '新增权限模块',
          roles: ['ADMIN']
        }
      },
      {
        path: 'modules/update/:id(\\d+)',
        component: () => import('@/views/rbac/permission-module/update'),
        name: 'UpdateModule',
        hidden: true,
        meta: {
          title: '编辑模权限模块',
          roles: ['ADMIN']
        }
      }
    ]
  },
  {
    path: '/audit',
    component: Layout,
    redirect: '/audit/shop',
    alwaysShow: true, // will always show the root menu
    name: 'Audit',
    meta: {
      title: '审核系统',
      icon: 'audit',
      roles: ['ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'shop',
        component: () => import('@/views/audit/shop'),
        name: 'ShopList',
        meta: {
          icon: 'shop',
          title: '店铺入驻',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/order/index',
    alwaysShow: true, // will always show the root menu
    name: 'Comment',
    meta: {
      title: '评论管理',
      icon: 'comment',
      roles: ['ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'order/index',
        component: () => import('@/views/comment/order-index'),
        name: 'CommentOrderList',
        meta: {
          icon: 'star',
          title: '订单评价',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/pay/index',
    alwaysShow: true, // will always show the root menu
    name: 'Order',
    meta: {
      title: '订单管理',
      icon: 'order',
      roles: ['ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'order/pay/index',
        component: () => import('@/views/order/order-pay-index'),
        name: 'OrderList',
        meta: {
          icon: 'order-pay',
          title: '订单列表',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'order/service/index',
        component: () => import('@/views/order/order-service-index'),
        name: 'OrderServiceList',
        meta: {
          icon: 'order-service',
          title: '服务订单',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'order/group/index',
        component: () => import('@/views/order/order-group-index'),
        name: 'OrderGroupList',
        meta: {
          icon: 'order-group',
          title: '团购订单',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/shop',
    component: Layout,
    redirect: '/shop/index',
    alwaysShow: true, // will always show the root menu
    name: 'Shop',
    meta: {
      title: '店铺管理',
      icon: 'shop',
      roles: ['ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'index',
        component: () => import('@/views/shop/index'),
        name: 'ShopList',
        meta: {
          icon: 'list',
          title: '店铺列表',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'add',
        component: () => import('@/views/shop/add'),
        name: 'AddShpo',
        hidden: true,
        meta: {
          icon: 'list',
          title: '新增店铺',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'update/:id(\\d+)',
        component: () => import('@/views/shop/update'),
        name: 'UpdateShop',
        hidden: true,
        meta: {
          icon: 'list',
          title: '修改店铺',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/discount',
    component: Layout,
    redirect: '/discount/coupon/index',
    alwaysShow: false, // will always show the root menu
    name: 'Discount',
    meta: {
      title: '优惠管理',
      icon: 'discount',
      roles: ['SHOP_ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'coupon/index',
        component: () => import('@/views/coupon/index'),
        name: 'CouponList',
        meta: {
          icon: 'coupon',
          title: '优惠券管理',
          roles: ['SHOP_ADMIN'] // or you can only set roles in sub nav
        }
      },

      {
        path: 'coupon/add',
        component: () => import('@/views/coupon/add'),
        name: 'AddCoupon',
        hidden: true,
        meta: {
          title: '新增优惠券',
          roles: ['SHOP_ADMIN'] // or you can only set roles in sub nav
        }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/service/project/index',
    alwaysShow: false, // will always show the root menu
    name: 'Setting',
    meta: {
      title: '基础配置',
      icon: 'setting',
      roles: ['ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'service/project/index',
        component: () => import('@/views/setting/service-project-index'),
        name: 'ServiceProject',
        meta: {
          icon: 'project',
          title: '服务项目',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },

      {
        path: 'service/project/add',
        component: () => import('@/views/setting/service-project-add'),
        name: 'AddServiceProject',
        hidden: true,
        meta: {
          title: '新增服务项目',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'service/project/update/:id(\\d+)',
        component: () => import('@/views/setting/service-project-update'),
        name: 'UpdateServiceProject',
        hidden: true,
        meta: {
          title: '修改服务项目',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'shop/title/index',
        component: () => import('@/views/setting/shop-title-index'),
        name: 'ShopTitle',
        meta: {
          icon: 'component',
          title: '服务标准',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },

      {
        path: 'shop/title/add',
        component: () => import('@/views/setting/shop-title-add'),
        name: 'AddShopTitle',
        hidden: true,
        meta: {
          title: '新增服务标准',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'shop/title/update/:id(\\d+)',
        component: () => import('@/views/setting/shop-title-update'),
        name: 'UpdateShopTitle',
        hidden: true,
        meta: {
          title: '修改服务标准',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'job/title/index',
        component: () => import('@/views/setting/job-title-index'),
        name: 'JobTitle',
        meta: {
          icon: 'stylist-title',
          title: '发型师职称',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },

      {
        path: 'job/title/add',
        component: () => import('@/views/setting/job-title-add'),
        name: 'AddJobTitle',
        hidden: true,
        meta: {
          title: '新增发型师职称',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'job/title/update/:id(\\d+)',
        component: () => import('@/views/setting/job-title-update'),
        name: 'UpdateJobTitle',
        hidden: true,
        meta: {
          title: '修改发型师职称',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'stylist/domain/index',
        component: () => import('@/views/setting/stylist-domain-index'),
        name: 'StylistDomain',
        meta: {
          icon: 'cut',
          title: '擅长领域',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },

      {
        path: 'stylist/domain/add',
        component: () => import('@/views/setting/stylist-domain-add'),
        name: 'AddStylistDomain',
        hidden: true,
        meta: {
          title: '新增擅长领域',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'stylist/domain/update/:id(\\d+)',
        component: () => import('@/views/setting/stylist-domain-update'),
        name: 'UpdateStylistDomain',
        hidden: true,
        meta: {
          title: '修改擅长领域',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'commission/index',
        component: () => import('@/views/setting/commission-index'),
        name: 'Commission',
        meta: {
          icon: 'nested',
          title: '抽成设置',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }

    ]
  },

  {
    path: '/feedback',
    component: Layout,
    redirect: '/feedback/index',
    alwaysShow: true, // will always show the root menu
    name: 'Feedback',
    meta: {
      title: '意见反馈',
      icon: 'feedback',
      roles: ['ADMIN'] // you can set roles in root nav
    }, children: [
      {
        path: 'index',
        component: () => import('@/views/feedback/index'),
        name: 'Feedback',
        meta: {
          icon: 'feedback-list',
          title: '反馈列表',
          roles: ['ADMIN'] // or you can only set roles in sub nav
        }
      }]

  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
