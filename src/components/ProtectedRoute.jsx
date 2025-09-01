import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requiredPermission, requiredGroup, fallback }) => {
  const { user, hasPermission, canAccessGroup } = useAuth()

  // Check if user has required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔒</span>
          <div>
            <h3 className="font-semibold text-yellow-800">Access Restricted</h3>
            <p className="text-sm text-yellow-700">
              {user?.role === 'investor' 
                ? 'This feature requires premium access. Please contact us for full access.'
                : 'You don\'t have permission to access this content.'
              }
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Check if user can access specific group content
  if (requiredGroup && !canAccessGroup(requiredGroup)) {
    return fallback || (
      <div className="p-6 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h3 className="font-semibold text-orange-800">Group Access Restricted</h3>
            <p className="text-sm text-orange-700">
              You don't have access to content for the {requiredGroup} group.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return children
}

export default ProtectedRoute
