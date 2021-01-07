import  { request } from '@/plugins/request'

// 获取作者信息
export const getProfile = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`
  })
}

// 关注作者
export const follow = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

// 取消关注
export const unFollow = username => {
  return request({
    method: 'DELETE ',
    url: `/api/profiles/${username}/follow`
  })
}

export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/api/articles',
    params
  })
}