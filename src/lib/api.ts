// Re-export all API functions from the individual modules
export * from "./api/posts";
export {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./api/notifications";
export * from "./api/courses";
export * from "./api/events";
export * from "./api/resources";
export * from "./api/discussions";
export { uploadFile } from "./api/uploads";
