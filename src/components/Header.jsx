import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-center px-4">
        <Link to="/" className="text-3xl text-noor-pink logo">
          Noor Stitching Institute
        </Link>
      </div>
    </header>
  );
}

export default Header;