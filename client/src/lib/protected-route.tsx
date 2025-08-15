import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  requiredPermission,
}: {
  path: string;
  component: () => React.JSX.Element;
  requiredPermission?: string;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Загрузка...</p>
          </div>
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/admin/login" />
      </Route>
    );
  }

  // Check permission if required
  if (requiredPermission && user.permissions && !user.permissions.includes(requiredPermission)) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="bg-red-100 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-red-800 mb-2">Доступ запрещен</h2>
              <p className="text-red-600">У вас нет прав для просмотра этой страницы.</p>
            </div>
          </div>
        </div>
      </Route>
    );
  }

  return <Route path={path}><Component /></Route>;
}