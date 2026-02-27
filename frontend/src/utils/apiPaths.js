export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
    UPLOAD_IMAGE: "/auth/upload-image",
  },

  TASKS: {
    BASE: "/task",
    DASHBOARD_DATA: "/task/dashboard-data",
    USER_DASHBOARD_DATA: "/task/user-dashboard-data",
    BY_ID: (id) => `/task/${id}`,
    STATUS: (id) => `/task/${id}/status`,
    TODO: (id) => `/task/${id}/todo`,
    DELETE: (id) => `/task/${id}`,
  },

  USERS: {
    BASE: "/user",
    BY_ID: (id) => `/user/${id}`,
  },
};
