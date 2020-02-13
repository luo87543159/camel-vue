import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/oauth/token',
    method: 'post',
    params: {
      username: data.username,
      password: data.password,
      grant_type: 'password',
      client_id: 'client',
      client_secret: 'secret'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/auth/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/auth/user/logout',
    method: 'post'
  })
}
