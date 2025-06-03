import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const userService = {
  async getAll() {
    await delay(300)
    return [...userData]
  },

  async getById(id) {
    await delay(200)
    const user = userData.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return { ...user }
  },

  async create(userData) {
    await delay(400)
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      followers: [],
      following: [],
      createdAt: new Date().toISOString()
    }
    return { ...newUser }
  },

  async update(id, data) {
    await delay(300)
    const user = userData.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    const updatedUser = { ...user, ...data }
    return { ...updatedUser }
  },

  async delete(id) {
    await delay(250)
    const user = userData.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return { success: true }
  }
}