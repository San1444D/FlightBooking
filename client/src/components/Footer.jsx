const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4 w-full">
        <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Flight Booking. All rights reserved.
        </div>
      </footer>
    </>
  );
};


export default Footer;