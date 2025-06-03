import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="SearchX" className="h-16 w-16 text-primary" />
        </motion.div>
        
        <h1 className="text-6xl font-heading font-bold text-gradient mb-4">404</h1>
        <h2 className="text-2xl font-heading font-semibold text-surface-800 mb-4">Page Not Found</h2>
        <p className="text-surface-600 mb-8 leading-relaxed">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness. 
          Let's get you back to your feed where all the action is happening.
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link 
            to="/" 
            className="btn-primary inline-flex items-center justify-center w-full sm:w-auto"
          >
            <ApperIcon name="Home" className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="btn-secondary inline-flex items-center justify-center w-full sm:w-auto"
          >
            <ApperIcon name="ArrowLeft" className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
        
        <motion.div 
          className="mt-12 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}