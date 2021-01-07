import  { request } from '@/plugins/request'
// 发表文章
export const addArticle = data => {
  return request({
    method: 'POST',
    url: `/api/articles`,
    data
  })
}
// 编辑文章
export const editArticle = data => {
  return request({
    method: 'PUT',
    url: `/api/articles/${data.article.slug}`,
    data
  })
}
// 删除文章
export const deleteArticle = slug => {
  return request({
    method: 'DELETE',
    url: `/api/articles/${slug}`
  })
}