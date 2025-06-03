import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { postService, userService, commentService } from '../services'

export default function MainFeature() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newPost, setNewPost] = useState('')
  const [showComments, setShowComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [likedPosts, setLikedPosts] = useState(new Set())
  const [users, setUsers] = useState([])

  useEffect(() => {
    loadPosts()
    loadUsers()
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    try {
      const result = await postService.getAll()
      setPosts(result || [])
    } catch (err) {
      setError(err.message)
      toast.error("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const result = await userService.getAll()
      setUsers(result || [])
    } catch (err) {
      console.error('Failed to load users:', err)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPost.trim()) return

    try {
      const postData = {
        userId: users[0]?.id || 'user1',
        content: newPost,
        mediaUrls: [],
        likes: [],
        comments: [],
        shares: 0
      }

      const createdPost = await postService.create(postData)
      setPosts(prev => [createdPost, ...(prev || [])])
      setNewPost('')
      toast.success("Post shared successfully!")
    } catch (err) {
      toast.error("Failed to create post")
    }
  }

  const handleLike = async (postId) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return

      const isLiked = likedPosts.has(postId)
      const updatedLikes = isLiked 
        ? (post.likes || []).filter(id => id !== 'current-user')
        : [...(post.likes || []), 'current-user']

      await postService.update(postId, { 
        ...post, 
        likes: updatedLikes 
      })

      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: updatedLikes } : p
      ))

      const newLikedPosts = new Set(likedPosts)
      if (isLiked) {
        newLikedPosts.delete(postId)
      } else {
        newLikedPosts.add(postId)
        toast.success("❤️ Liked!")
      }
      setLikedPosts(newLikedPosts)
    } catch (err) {
      toast.error("Failed to update like")
    }
  }

  const handleComment = async (postId) => {
    const commentText = newComment[postId]
    if (!commentText?.trim()) return

    try {
      const commentData = {
        postId,
        userId: users[0]?.id || 'user1',
        content: commentText,
        likes: []
      }

      const createdComment = await commentService.create(commentData)
      
      const post = posts.find(p => p.id === postId)
      const updatedComments = [...(post.comments || []), createdComment.id]
      
      await postService.update(postId, {
        ...post,
        comments: updatedComments
      })

      setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, comments: updatedComments } : p
      ))

      setNewComment(prev => ({ ...prev, [postId]: '' }))
      toast.success("Comment added!")
    } catch (err) {
      toast.error("Failed to add comment")
    }
  }

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const getUserById = (userId) => {
    return users.find(u => u.id === userId) || { 
      username: 'Anonymous', 
      profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face' 
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="post-card p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-surface-200 rounded w-24"></div>
                <div className="h-3 bg-surface-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-surface-200 rounded"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
            </div>
            <div className="h-48 bg-surface-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="post-card p-6 text-center">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-accent mx-auto mb-4" />
        <h3 className="font-heading font-semibold text-lg mb-2">Oops! Something went wrong</h3>
        <p className="text-surface-600 mb-4">{error}</p>
        <button 
          onClick={loadPosts}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="post-card p-6"
      >
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <ApperIcon name="User" className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in your world? Share your thoughts..."
                className="w-full p-4 border border-surface-200 rounded-xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                maxLength={500}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-3">
                  <button 
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                  >
                    <ApperIcon name="Image" className="h-5 w-5" />
                    <span className="text-sm font-medium">Photo</span>
                  </button>
                  <button 
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 text-surface-600 hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-300"
                  >
                    <ApperIcon name="Video" className="h-5 w-5" />
                    <span className="text-sm font-medium">Video</span>
                  </button>
                  <button 
                    type="button"
                    className="flex items-center space-x-2 px-3 py-2 text-surface-600 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300"
                  >
                    <ApperIcon name="MapPin" className="h-5 w-5" />
                    <span className="text-sm hidden sm:block font-medium">Location</span>
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-surface-500">{newPost.length}/500</span>
                  <button 
                    type="submit"
                    disabled={!newPost.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ApperIcon name="Send" className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Posts Feed */}
      <AnimatePresence>
        {(posts || []).map((post, index) => {
          const user = getUserById(post.userId)
          const isLiked = likedPosts.has(post.id)
          
          return (
            <motion.article
              key={post.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="post-card overflow-hidden group"
            >
              {/* Post Header */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-100"
                    />
                    <div>
                      <h4 className="font-semibold text-surface-900">{user.username}</h4>
                      <p className="text-sm text-surface-500">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-surface-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <ApperIcon name="MoreHorizontal" className="h-5 w-5 text-surface-500" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                <p className="text-surface-800 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Media */}
              {post.mediaUrls && post.mediaUrls.length > 0 && (
                <div className="px-6 pb-4">
                  <div className="grid grid-cols-1 gap-2 rounded-xl overflow-hidden">
                    {post.mediaUrls.map((url, idx) => (
                      <img 
                        key={idx}
                        src={url}
                        alt={`Post media ${idx + 1}`}
                        className="w-full h-64 sm:h-80 object-cover hover:scale-105 transition-transform duration-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Post Stats */}
              <div className="px-6 py-2 border-t border-surface-100">
                <div className="flex items-center justify-between text-sm text-surface-500">
                  <div className="flex items-center space-x-4">
                    <span>{(post.likes || []).length} likes</span>
                    <span>{(post.comments || []).length} comments</span>
                    <span>{post.shares || 0} shares</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-1">
                      {(post.likes || []).slice(0, 3).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="w-5 h-5 bg-gradient-to-br from-primary to-secondary rounded-full border border-white"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="px-6 py-4 border-t border-surface-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <motion.button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                        isLiked 
                          ? 'text-secondary bg-secondary/10' 
                          : 'text-surface-600 hover:text-secondary hover:bg-secondary/10'
                      }`}
                      whileTap={{ scale: 0.95 }}
                      animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                    >
                      <ApperIcon 
                        name={isLiked ? "Heart" : "Heart"} 
                        className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} 
                      />
                      <span className="text-sm font-medium">Like</span>
                    </motion.button>

                    <button 
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center space-x-2 px-3 py-2 text-surface-600 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                    >
                      <ApperIcon name="MessageCircle" className="h-5 w-5" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 px-3 py-2 text-surface-600 hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-300">
                      <ApperIcon name="Share" className="h-5 w-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>

                  <button className="p-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
                    <ApperIcon name="Bookmark" className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <AnimatePresence>
                {showComments[post.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-surface-100 bg-surface-50/50"
                  >
                    <div className="p-6 space-y-4">
                      {/* Add Comment */}
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                          <ApperIcon name="User" className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 flex space-x-2">
                          <input
                            type="text"
                            value={newComment[post.id] || ''}
                            onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder="Write a comment..."
                            className="flex-1 px-4 py-2 bg-white border border-surface-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <button
                            onClick={() => handleComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ApperIcon name="Send" className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      {(post.comments || []).length > 0 && (
                        <div className="space-y-3 pt-2">
                          {(post.comments || []).slice(0, 3).map((commentId, idx) => (
                            <div key={commentId || idx} className="flex items-start space-x-3">
                              <img 
                                src={`https://images.unsplash.com/photo-${1600000000000 + idx}?w=32&h=32&fit=crop&crop=face`}
                                alt="Commenter"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex-1 bg-white p-3 rounded-xl">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">user{idx + 1}</span>
                                  <span className="text-xs text-surface-500">2m ago</span>
                                </div>
                                <p className="text-sm text-surface-700">Great post! Thanks for sharing.</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </AnimatePresence>

      {(posts || []).length === 0 && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="post-card p-12 text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
            <ApperIcon name="PlusCircle" className="h-12 w-12 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-xl mb-2">No posts yet</h3>
          <p className="text-surface-600 mb-6">Be the first to share something amazing with the community!</p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="btn-primary"
          >
            Create Your First Post
          </button>
        </motion.div>
      )}
    </div>
  )
}