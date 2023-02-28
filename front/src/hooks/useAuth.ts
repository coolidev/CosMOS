import { createContext, useContext } from 'react';

export const AuthContext = createContext(undefined);
export const SMSContext = createContext(undefined);
export const ChangePasswordContext = createContext(undefined);
export const ChangePasswordSMSContext = createContext(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

export function useSMS() {
  return useContext(SMSContext);
}

export function useChangePassword() {
  return useContext(ChangePasswordContext);
}

export function useSMSPassword() {
  return useContext(ChangePasswordSMSContext);
}
