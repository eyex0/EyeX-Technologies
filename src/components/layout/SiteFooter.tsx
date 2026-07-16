import { Link } from "@tanstack/react-router";
import { BrandMark } from "./BrandMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-thin py-20 px-6 bg-eye-bg">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <BrandMark className="mb-6" />
            <p className="text-eye-text text-sm max-w-xs font-light leading-relaxed">
              The standard for enterprise intelligence. Architected for the most demanding
              environments on Earth.
            </p>
          </div>
          <div>
            <h6 className="text-eye-white text-[10px] font-bold uppercase tracking-widest mb-6">
              Product
            </h6>
            <ul className="flex flex-col gap-3 text-sm text-eye-text font-light">
              <li>
                <Link to="/" className="hover:text-eye-white transition-colors">
                  Platform
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-eye-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/ai-chat" className="hover:text-eye-white transition-colors">
                  AI Chat
                </Link>
              </li>
              <li>
                <Link to="/documents" className="hover:text-eye-white transition-colors">
                  Documents
                </Link>
              </li>
              <li>
                <Link to="/api" className="hover:text-eye-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-eye-white transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-eye-white text-[10px] font-bold uppercase tracking-widest mb-6">
              Company
            </h6>
            <ul className="flex flex-col gap-3 text-sm text-eye-text font-light">
              <li>
                <Link to="/about" className="hover:text-eye-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-eye-white transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-eye-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-eye-white transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-thin pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-eye-text">
          <p>© {new Date().getFullYear()} EyeX Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-eye-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-eye-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-eye-white transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
