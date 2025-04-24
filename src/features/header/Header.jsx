import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import UserAvatar from "@/features/header/user-avatar/UserAvatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
      <div className="flex items-center gap-2 px-4 w-full">
        {/* Hamburger Menu for Smaller Screens */}
        <div className="md:hidden flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <Menu className="h-6 w-6 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem asChild>
                <Link
                  to="/companies"
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Companies
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/jobs"
                  className="text-sm font-medium text-gray-700 hover:text-primary"
                >
                  Jobs
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Separator orientation="vertical" className="ml-2 h-4" />
        </div>

        {/* Project Name */}
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-primary">Hirex</h1>
        </div>

        {/* Header Links for Larger Screens */}
        <nav className="hidden md:flex ml-8 gap-4">
          <Link
            to="/companies"
            className="text-sm font-medium text-gray-700 hover:text-primary"
          >
            Companies
          </Link>
          <Link
            to="/jobs"
            className="text-sm font-medium text-gray-700 hover:text-primary"
          >
            Jobs
          </Link>
        </nav>

        {/* Right Section */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
