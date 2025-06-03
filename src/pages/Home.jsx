import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { userService } from '../services'

export default function Home() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeStory, setActiveStory] = useState(null)
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      try {
        const result = await userService.getAll()
        setUsers(result || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  const handleStoryClick = (userId) => {
    setActiveStory(userId)
    setTimeout(() => setActiveStory(null), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      {/* Navigation Header */}
      <motion.header 
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 glass-effect h-16 border-b border-surface-200/50"
      >
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-heading font-bold text-gradient">PulseConnect</h1>
            
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex items-center bg-surface-100/80 rounded-full px-4 py-2 w-80">
              <ApperIcon name="Search" className="h-5 w-5 text-surface-500 mr-3" />
              <input 
                type="text" 
                placeholder="Search for friends, posts, and more..."
                className="bg-transparent border-none outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Mobile search */}
            <button className="md:hidden p-2 hover:bg-surface-100 rounded-xl transition-colors">
              <ApperIcon name="Search" className="h-5 w-5 text-surface-600" />
            </button>
            
            <button className="relative p-2 hover:bg-surface-100 rounded-xl transition-colors">
              <ApperIcon name="Bell" className="h-5 w-5 text-surface-600" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary rounded-full animate-pulse"></span>
            </button>
            
            <button className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
              <ApperIcon name="MessageCircle" className="h-5 w-5 text-surface-600" />
            </button>
            
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Hidden on mobile */}
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block lg:col-span-3"
          >
            <div className="sticky top-24 space-y-6">
              <div className="post-card p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Following</span>
                    <span className="font-semibold text-primary">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Followers</span>
                    <span className="font-semibold text-secondary">834</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-600">Posts</span>
                    <span className="font-semibold text-accent">52</span>
                  </div>
                </div>
              </div>

              <div className="post-card p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Trending</h3>
                <div className="space-y-3">
                  {['#TechTuesday', '#Photography', '#Travel', '#FoodieLife'].map((tag, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-surface-700 hover:text-primary cursor-pointer transition-colors">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="lg:col-span-6">
            {/* Stories Section */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="post-card p-4 mb-6"
            >
              <h3 className="font-heading font-semibold text-lg mb-4 px-2">Stories</h3>
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
                {/* Add Story */}
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="flex-shrink-0 flex flex-col items-center space-y-2 group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-surface-200 to-surface-300 rounded-full flex items-center justify-center border-2 border-dashed border-surface-400 group-hover:border-primary transition-colors">
                    <ApperIcon name="Plus" className="h-6 w-6 text-surface-600 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-xs text-surface-600 font-medium">Add Story</span>
                </button>

                {/* User Stories */}
                {(users?.slice(0, 8) || []).map((user, idx) => (
                  <button 
                    key={user.id || idx}
                    onClick={() => handleStoryClick(user.id)}
                    className="flex-shrink-0 flex flex-col items-center space-y-2 group"
                  >
                    <div className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary via-secondary to-accent ${activeStory === user.id ? 'animate-pulse' : ''}`}>
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        <img 
                          src={user.profilePicture || `https://images.unsplash.com/photo-${1500000000000 + idx}?w=80&h=80&fit=crop&crop=face`}
                          alt={user.username || `User ${idx + 1}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-xs text-surface-600 font-medium truncate w-16 text-center">
                      {user.username || `user${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Main Feature Component */}
            <MainFeature />
          </main>

          {/* Right Sidebar - Hidden on mobile and tablet */}
          <motion.aside 
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden xl:block lg:col-span-3"
          >
            <div className="sticky top-24 space-y-6">
              <div className="post-card p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Suggested for You</h3>
                <div className="space-y-4">
                  {(users?.slice(0, 3) || []).map((user, idx) => (
                    <div key={user.id || idx} className="flex items-center space-x-3">
                      <img 
                        src={user.profilePicture || `https://images.unsplash.com/photo-${1600000000000 + idx}?w=40&h=40&fit=crop&crop=face`}
                        alt={user.username || `User ${idx + 1}`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.username || `user${idx + 1}`}</p>
                        <p className="text-xs text-surface-500 truncate">{user.bio || "New to PulseConnect"}</p>
                      </div>
                      <button className="btn-primary text-xs px-3 py-1">Follow</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="post-card p-6">
                <h3 className="font-heading font-semibold text-lg mb-4">Active Now</h3>
                <div className="space-y-3">
                  {(users?.slice(3, 6) || []).map((user, idx) => (
                    <div key={user.id || idx} className="flex items-center space-x-3">
                      <div className="relative">
                        <img 
                          src={user.profilePicture || `https://images.unsplash.com/photo-${1700000000000 + idx}?w=32&h=32&fit=crop&crop=face`}
                          alt={user.username || `User ${idx + 1}`}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                      </div>
                      <span className="text-sm font-medium flex-1 truncate">{user.username || `user${idx + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setShowCreatePost(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg flex items-center justify-center z-30 lg:hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ 
          boxShadow: ["0 0 0 0 rgba(99, 102, 241, 0.4)", "0 0 0 20px rgba(99, 102, 241, 0)"],
        }}
        transition={{ 
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <ApperIcon name="Plus" className="h-6 w-6 text-white" />
      </motion.button>

      {/* Mobile Bottom Navigation */}
      <motion.nav 
        initial={{ y: 56 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 glass-effect border-t border-surface-200/50 h-14 flex items-center justify-around lg:hidden z-40"
      >
        {[
          { icon: 'Home', active: true },
          { icon: 'Search' },
          { icon: 'PlusSquare' },
          { icon: 'Heart' },
          { icon: 'User' }
        ].map((item, idx) => (
          <button 
            key={idx}
            className={`p-2 rounded-xl transition-colors ${
              item.active ? 'text-primary bg-primary/10' : 'text-surface-600 hover:text-surface-900'
            }`}
          >
            <ApperIcon name={item.icon} className="h-6 w-6" />
          </button>
        ))}
      </motion.nav>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-lg">Create Post</h3>
                <button 
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-surface-100 rounded-xl transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <textarea
                  placeholder="What's on your mind?"
                  className="w-full p-3 border border-surface-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
                      <ApperIcon name="Image" className="h-5 w-5 text-surface-600" />
                    </button>
                    <button className="p-2 hover:bg-surface-100 rounded-xl transition-colors">
                      <ApperIcon name="Video" className="h-5 w-5 text-surface-600" />
                    </button>
                  </div>
                  <button className="btn-primary text-sm">Post</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}