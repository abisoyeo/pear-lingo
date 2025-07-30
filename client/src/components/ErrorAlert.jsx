const ErrorAlert = ({ message }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error p-2">
      <ul className="list-none pl-0 list-inside text-sm">
        <li>
          <strong>{message}</strong>
        </li>
      </ul>
    </div>
  );
};

export default ErrorAlert;
