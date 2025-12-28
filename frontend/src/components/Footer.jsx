const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white mt-20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 mb-2">
            Powered by AI Technology
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AI Product Recommendation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
