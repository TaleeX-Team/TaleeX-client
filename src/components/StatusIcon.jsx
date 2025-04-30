// Status icons
export const StatusIcon = (status) => {
  switch (status) {
    case "verified":
      return <CheckCircle className="h-4 w-4 mr-1" />;
    case "pending":
      return <Clock className="h-4 w-4 mr-1" />;
    case "rejected":
      return <AlertTriangle className="h-4 w-4 mr-1" />;
  }
};
