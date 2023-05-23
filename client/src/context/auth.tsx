import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { User } from '../types/types';
import axios from 'axios';
import { useRouter } from 'next/router';

interface State {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const initialData = { authenticated: false, user: null, loading: true };
const AuthContext = createContext<State>({ ...initialData });
const DispatchContext = createContext<any>(null);

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case 'LOGIN':
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case 'STOP_LOADING':
      return {
        ...state,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();
  const [state, defaultdispatch] = useReducer(reducer, { ...initialData });
  const isAuthPage = pathname === ('/login' || '/register');

  const dispatch = (type: string, payload?: any) => {
    defaultdispatch({ type, payload });
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await axios.get('/auth/me');

        dispatch('LOGIN', res.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch('STOP_LOADING');
      }
    };
    if (!isAuthPage) {
      loadUser();
    }
  }, [isAuthPage]);

  console.log(state);

  return (
    <DispatchContext.Provider value={dispatch}>
      <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
export const useAuthDispatch = () => useContext(DispatchContext);

export default AuthContextProvider;
