import axios from "axios";
//=======Registration=====

export const registerAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8000/api/users/register",
    {
      email: userData?.email,
      password: userData?.password,
      username: userData?.username,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//=======Login=====

export const loginAPI = async (userData) => {
  const response = await axios.post(
    "http://localhost:8000/api/users/login",
    {
      email: userData?.email,
      password: userData?.password,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//=======Check auth=====

export const checkUserAuthStatusAPI = async () => {
  const response = await axios.get(
    "http://localhost:8000/api/users/auth/check",
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//=======Logout =====

export const logoutAPI = async () => {
  const response = await axios.post(
    "http://localhost:8000/api/users/logout",
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//=======Logout =====

export const getUserProfileAPI = async () => {
  const response = await axios.get(
    "http://localhost:8000/api/users/profile",

    {
      withCredentials: true,
    }
  );
  return response?.data;
};
