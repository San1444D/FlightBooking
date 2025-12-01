const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4 w-full">
        {/* <div className="container mx-auto text-center">
          &copy; {new Date().getFullYear()} Flight Booking. All rights reserved.
        </div> */}
        <section id="about" className="section-about  p-4">
          <div className="container">
            <h2 className="section-title text-2xl font-bold">About Us</h2>
            <p className="section-description text-left mb-2">
              &nbsp; &nbsp;&nbsp; &nbsp; Welcome to our Flight ticket booking
              app, where we are dedicated to providing you with an exceptional
              travel experience from start to finish. Whether you're embarking
              on a daily commute, planning an exciting cross-country adventure,
              or seeking a leisurely scenic route, our app offers an extensive
              selection of Flight options to cater to your unique travel
              preferences.
            </p>
            <p className="section-description text-left mb-2">
              &nbsp; &nbsp;&nbsp; &nbsp; We understand the importance of
              convenience and efficiency in your travel plans. Our user-friendly
              interface allows you to effortlessly browse through a wide range
              of Flight schedules, compare fares, and choose the most suitable
              seating options. With just a few taps, you can secure your Flight
              tickets and be one step closer to your desired destination. Our
              intuitive booking process enables you to customize your travel
              preferences, such as selecting specific departure times, opting
              for a window seat, or accommodating any special requirements.
            </p>
            <p className="section-description text-left mb-2">
              &nbsp; &nbsp;&nbsp; &nbsp; With our Flight ticket booking app, you
              can embrace the joy of exploring new destinations, immerse
              yourself in breathtaking scenery, and create cherished memories
              along the way. Start your journey today and let us be your trusted
              companion in making your Flight travel dreams a reality.
              Experience the convenience, reliability, and comfort that our app
              offers, and embark on unforgettable Flight adventures with
              confidence.
            </p>

            <span>
              <h5 className="text-center">2023 SB FlightConnect - &copy; All rights reserved</h5>
            </span>
          </div>
        </section>
      </footer>
    </>
  );
};

export default Footer;
