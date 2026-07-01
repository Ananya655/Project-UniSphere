import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthModal() {
  const navigate = useNavigate();
  const { authModal, closeAuthModal, openAuthModal, isAuthenticated } = useAuth();
  const isOpen = authModal === 'login' || authModal === 'register';
  const isLogin = authModal === 'login';

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      closeAuthModal();
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isOpen, closeAuthModal, navigate]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogContent className="auth-modal-content" aria-describedby="auth-modal-description">
        <div className="auth-modal-inner">
          <span className="auth-modal-eyebrow">UniSphere account</span>

          <DialogHeader className="auth-modal-header">
            <DialogTitle>{isLogin ? 'Welcome back' : 'Join your campus'}</DialogTitle>
            <DialogDescription id="auth-modal-description">
              {isLogin
                ? 'Log in to access your notes, uploads, and community discussions.'
                : 'Create a free account with your college details to start sharing and searching resources.'}
            </DialogDescription>
          </DialogHeader>

          <div className="auth-modal-tabs">
            <button
              type="button"
              className={`auth-modal-tab ${isLogin ? 'active' : ''}`}
              onClick={() => openAuthModal('login')}
            >
              Log in
            </button>
            <button
              type="button"
              className={`auth-modal-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => openAuthModal('register')}
            >
              Register
            </button>
          </div>

          {isLogin ? (
            <LoginForm onSwitchToRegister={() => openAuthModal('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => openAuthModal('login')} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
