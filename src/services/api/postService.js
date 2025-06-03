import postData from '../mockData/posts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const postService = {
  async getAll() {
    await delay(400)
    return [...postData]
  },

  async getById(id) {
    await delay(200)
    const post = postData.find(p => p.id === id)
    if (!post) throw new Error('Post not found')
    return { ...post }
  },

  async create(postData) {
    await delay(500)
    const newPost = {
      id: Date.now().toString(),
      ...postData,
      likes: postData.likes || [],
      comments: postData.comments || [],
      shares: postData.shares || 0,
      createdAt: new Date().toISOString()
    }
    return { ...newPost }
  },

  async update(id, data) {
    await delay(300)
    const post = postData.find(p => p.id === id)
    if (!post) throw new Error('Post not found')
    const updatedPost = { ...post, ...data }
    return { ...updatedPost }
  },

  async delete(id) {
    await delay(250)
    const post = postData.find(p => p.id === id)
    if (!post) throw new Error('Post not found')
    return { success: true }
  }
}