// Re-export all API functions from the individual modules
export * from "./posts";
export {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./notifications";
export * from "./courses";
export * from "./events";
export * from "./resources";
export * from "./discussions";
export { uploadFile } from "./uploads";
