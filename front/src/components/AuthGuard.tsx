import { FC, ReactNode } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  useAuth,
  useSMS,
  useChangePassword,
  useSMSPassword
} from 'src/hooks/useAuth';
import SMS from 'src/pages/auth/VerifySms';

interface AuthGuardProps {
  children?: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { authTokens } = useAuth();
  const { smsTokens } = useSMS();
  const { changePasswordTokens } = useChangePassword();
  const { smsPasswordTokens } = useSMSPassword();

  if (!authTokens) {
    return <Redirect to="/signin" />;
  } else if (authTokens && !smsTokens) {
    return <SMS />;
  } else if (changePasswordTokens && !smsPasswordTokens) {
    return <Redirect to="/change-password-sms" />;
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};

export default AuthGuard;
