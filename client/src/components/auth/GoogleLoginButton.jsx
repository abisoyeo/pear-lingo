export default function GoogleLoginButton({ text = "Continue with Google" }) {
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const handleClick = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-full bg-white text-gray-700 text-sm font-medium px-4 hover:bg-gray-50 transition"
      style={{ fontFamily: "Roboto, sans-serif", height: "40px" }}
    >
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
      >
        <path
          fill="#4285F4"
          d="M24 9.5c3.54 0 6.36 1.45 8.31 2.67l6.16-6.16C34.43 3.05 29.64 1 24 1 14.62 1 6.45 6.74 2.81 14.98l7.43 5.77C12.33 14.28 17.67 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.15 24.5c0-1.27-.12-2.5-.34-3.68H24v7.05h12.5c-.54 2.83-2.19 5.22-4.64 6.82l7.36 5.72C43.68 36.2 46.15 30.76 46.15 24.5z"
        />
        <path
          fill="#FBBC05"
          d="M10.24 28.75c-1.24-2.11-1.94-4.56-1.94-7.25s.7-5.14 1.94-7.25l-7.43-5.77C1.47 13.45 0 18.53 0 24c0 5.47 1.47 10.55 4.81 15.27l7.43-5.77z"
        />
        <path
          fill="#EA4335"
          d="M24 48c6.48 0 11.91-2.14 15.88-5.8l-7.36-5.72c-2.05 1.39-4.68 2.21-8.52 2.21-6.33 0-11.67-4.78-13.76-11.25l-7.43 5.77C6.45 41.26 14.62 48 24 48z"
        />
      </svg>
      <span>{text}</span>
    </button>
  );
}
