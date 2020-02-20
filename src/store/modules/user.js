import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  routers: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTERS: (state, routers) => {
    state.routers = routers
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const routers = [
        //   {
        //     path: '/nested',
        //     component: 'Layout',
        //     name: 'Nested',
        //     meta: {
        //       title: 'Nested',
        //       icon: 'nested'
        //     },
        //     children: [
        //       {
        //         path: 'menu1',
        //         component: ('/nested/menu1/index'), // Parent router-view
        //         name: 'Menu1',
        //         meta: { title: 'Menu1' },
        //         children: [
        //           {
        //             path: 'menu1-1',
        //             component: ('/nested/menu1/menu1-1'),
        //             name: 'Menu1-1',
        //             meta: { title: 'Menu1-1' }
        //           },
        //           {
        //             path: 'menu1-2',
        //             component: ('menu1-2'),
        //             name: 'Menu1-2',
        //             meta: { title: 'Menu1-2' },
        //             children: [
        //               {
        //                 path: 'menu1-2-1',
        //                 component: ('/nested/menu1/menu1-2/menu1-2-1'),
        //                 name: 'Menu1-2-1',
        //                 meta: { title: 'Menu1-2-1' }
        //               },
        //               {
        //                 path: 'menu1-2-2',
        //                 component: ('/nested/menu1/menu1-2/menu1-2-2'),
        //                 name: 'Menu1-2-2',
        //                 meta: { title: 'Menu1-2-2' }
        //               }
        //             ]
        //           },
        //           {
        //             path: 'menu1-3',
        //             component: ('/nested/menu1/menu1-3'),
        //             name: 'Menu1-3',
        //             meta: { title: 'Menu1-3' }
        //           }
        //         ]
        //       },
        //       {
        //         path: 'menu2',
        //         component: ('/nested/menu2/index'),
        //         meta: { title: 'menu2' }
        //       }
        //     ]
        //   },
        //   // 404 page must be placed at the end !!!
        //   { path: '*', redirect: '/404', hidden: true }
        // ]
        const { roles, routers, name, avatar } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROUTERS', routers)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

