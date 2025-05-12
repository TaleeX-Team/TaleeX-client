export const formatJoinDate = (dateString) => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "Invalid date";

    // Format the date
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    return "Unknown";
  }
};

export const getDirection = (lng) => (lng === 'ar' ? 'rtl' : 'ltr');