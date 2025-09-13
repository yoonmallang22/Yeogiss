export const GA_EVENTS = {
  PAGE_VIEW_CUSTOM: "page_view_custom",
  LOCATION_PERMISSION_REQUESTED: "location_permission_requested",
  LOCATION_PERMISSION_GRANTED: "location_permission_granted",
  LOCATION_PERMISSION_DENIED: "location_permission_denied",
  CURRENT_LOCATION_SELECTED: "current_location_selected",
  MAP_CENTER_MOVED: "map_center_moved",
  TRASH_BIN_MARKER_CLICKED: "trash_bin_marker_clicked",
  TRASH_BIN_DATA_REFRESHED: "trash_bin_data_refreshed",
  ROUTE_SEARCH_INITIATED: "route_search_initiated",
  ROUTE_SEARCH_COMPLETED: "route_search_completed",
  ERROR_OCCURRED: "error_occurred",
  TOAST_MESSAGE_DISPLAYED: "toast_message_displayed",
} as const;

export type GAEventKey = keyof typeof GA_EVENTS;
