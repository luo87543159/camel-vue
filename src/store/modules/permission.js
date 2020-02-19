import { constantRoutes } from '@/router'
import Layout from '@/layout'
import store from '../index'

// const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 将后台返回的json权限数据格式化（递归遍历子节点）
 * 遍历后台传来的路由字符串，转换为组件对象
 * @param asyncRoutes
 */
export const formatAsyncRoutes = (asyncRoutes) => {
  const accessedRouters = []
  asyncRoutes.forEach(router => {
    const tmp = {
      path: router.path,
      component: router.component === 'Layout' ? Layout : resolve => require([`@/views${router.component}`], resolve),
      redirect: router.redirect,
      name: router.name,
      meta: router.meta,
      children: router.children && router.children.length ? formatAsyncRoutes(router.children) : []
    }
    accessedRouters.push(tmp)
  })

  return accessedRouters
}
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      // 从store/user 中的获取后台提供的路由数据
      const asyncRoutes = store.getters.routers
      console.log(JSON.stringify(asyncRoutes))
      let accessedRoutes

      if (roles.includes('admin')) {
        accessedRoutes = formatAsyncRoutes(asyncRoutes)
      } else {
        accessedRoutes = filterAsyncRoutes(formatAsyncRoutes(asyncRoutes), roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
