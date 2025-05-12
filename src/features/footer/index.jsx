import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-8 pt-8 pb-6 border-t border-border">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaleeX. All rights reserved.
          </div>
          <nav className="flex space-x-6 mt-4 sm:mt-0">
            <Link
              to="/about-us"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About Me
            </Link>
            <Link
              to="/landing-page"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Landing Page
            </Link>
            <Link
              to="/contact-us"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
