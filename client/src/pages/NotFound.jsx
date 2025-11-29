import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[83.5vh] text-center">
      <h1 className="text-6xl my-20">404 - Page Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link to="/" className="hover:underline hover:text-blue-500 active:scale-101"
      >Go to Home</Link>
    </div>
  );
};

export default NotFound;
