import { createContext, ReactNode, useState } from "react";
import axios from "axios";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextType {
  userName: string;
  userId: string;
  userEmail: string;
  userPassword: string;
  setUserName: (name: string) => void;
  setUserId: (id: string) => void;
  setUserEmail: (email: string) => void;
  setUserPassword: (password: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  login: (userName: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    userName: string,
    email: string,
    password: string
  ) => Promise<void>;
}

interface UserData {
  userName: string;
  userId: string;
  userEmail: string;
}

interface LoginError {
  message: string;
  status?: number;
  data?: string;
}

interface RegisterError {
  message: string;
  status?: number;
  data?: string;
}

interface UserResponse {
  userId: string;
  userName: string;
  email: string;
  password: string;
  createdAt: string;
  files: [];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: AuthProviderProps) => {
  // const [authObject, setAuthObject] = useState<AuthContextType>()
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (userName: string, password: string): Promise<void> => {
    try {
      const response = await axios
        .post<UserResponse>(
          `http://localhost:8080/api/users/login`,
          new URLSearchParams({
            userName: userName,
            password: password,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => res.data);

      console.log("login response: ", response);
      console.log("response data: ", response);
      console.log("userId: ", response.userId);

      setUserName(response.userName);
      setUserId(response.userId);
      setUserEmail(response.email);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.userId);
      localStorage.setItem("username", response.userName);
      // localStorage.setItem("authenticated", true);

      return Promise.resolve();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const loginError: LoginError = {
          message: error.response?.data?.message || "Login failed",
          status: error.response?.status,
          data: error.response?.data,
        };
        return Promise.reject(loginError);
      }

      return Promise.reject({
        message: "An unexpected error occurred",
        status: 500,
      });
    }
  };

  const logout = async () => {
    setUserName("");
    setUserId("");
    setUserEmail("");
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
  };

  const register = async (
    userName: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const response = await axios.post<UserData>(
        `http://localhost:8080/api/users/create`,
        { userName: userName, email: email, password: password },
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      ).then(res => res.data);
      setUserName(response.userName);
      setUserId(response.userId);
      setUserEmail(response.userEmail);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.userId);
      localStorage.setItem('username', response.userName);

      return Promise.resolve();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const registerError: RegisterError = {
          message: error.response?.data?.message || "Register failed",
          status: error.response?.status,
          data: error.response?.data,
        };
        console.log(registerError);
        return Promise.reject(registerError);
      }

      return Promise.reject({
        message: "An unexpected error occurred",
        status: 500,
      });
    }
  };
  // const value = {
  //   userName,
  //   userId,
  //   userEmail,
  //   userPassword,
  //   setUserName,
  //   setUserId,
  //   setUserEmail,
  //   setUserPassword,
  //   isAuthenticated,
  //   setIsAuthenticated,
  //   login,
  //   logout,
  //   register
  // };

  return (
    <AuthContext.Provider
      value={{
        userName,
        setUserName,
        userId,
        setUserId,
        userEmail,
        setUserEmail,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
