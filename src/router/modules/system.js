import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  redirect: 'system/user',
  name: 'system',
  meta: { title: '系统设置', icon: '系统设置' },
  children: [
    {
      path: 'group',
      component: () => import('@/views/system/group/index'), // Parent router-view
      name: 'Group',
      meta: { title: '组织配置' }
    },
    {
      path: 'user',
      component: () => import('@/views/system/user/index'), // Parent router-view
      name: 'User',
      meta: { title: '用户配置' }
    },
    {
      path: 'role',
      component: () => import('@/views/system/role/index'), // Parent router-view
      name: 'Role',
      meta: { title: '角色配置' }
    },
    {
      path: 'router',
      component: () => import('@/views/system/router/index'), // Parent router-view
      name: 'Router',
      meta: { title: '路由配置' }
    },
    {
      path: 'gateway',
      component: () => import('@/views/system/gateway/index'), // Parent router-view
      name: 'Gateway',
      meta: { title: '网关配置' }
    }
  ]
}
export default systemRouter
