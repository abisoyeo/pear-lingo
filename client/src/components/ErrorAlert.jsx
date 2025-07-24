const ErrorAlert = ({ error }) => {
  if (!error) return null;

  const responseData = error.response?.data;

  const isValidationError = Array.isArray(responseData?.error);
  const fallbackMessage = responseData?.message || "An error occurred.";

  return (
    <div className="alert alert-error mb-4">
      <ul className="list-none pl-0 list-inside text-sm">
        {isValidationError ? (
          responseData.error.map((err, index) => (
            <li key={index}>
              <strong>{err.issue}</strong>
            </li>
          ))
        ) : (
          <li>
            <strong>{fallbackMessage}</strong>
          </li>
        )}
      </ul>
    </div>
  );
};

export default ErrorAlert;
