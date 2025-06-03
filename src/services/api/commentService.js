import commentData from '../mockData/comments.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const commentService = {
  async getAll() {
    await delay(300)
    return [...commentData]
  },

  async getById(id) {
    await delay(200)
    const comment = commentData.find(c => c.id === id)
    if (!comment) throw new Error('Comment not found')
    return { ...comment }
  },

  async create(commentData) {
    await delay(400)
    const newComment = {
      id: Date.now().toString(),
      ...commentData,
      likes: commentData.likes || [],
      createdAt: new Date().toISOString()
    }
    return { ...newComment }
  },

  async update(id, data) {
    await delay(300)
    const comment = commentData.find(c => c.id === id)
    if (!comment) throw new Error('Comment not found')
    const updatedComment = { ...comment, ...data }
    return { ...updatedComment }
  },

  async delete(id) {
    await delay(250)
    const comment = commentData.find(c => c.id === id)
    if (!comment) throw new Error('Comment not found')
    return { success: true }
  }
}