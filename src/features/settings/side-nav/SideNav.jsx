import React from "react";

import { cn } from "@/lib/utils";
import { Link, useLocation, useParams } from "react-router-dom";

export function SidebarNav({ className, items, ...props }) {
  const { pathname } = useLocation();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center rounded-md px-3 py-2 text-md font-medium",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted hover:text-foreground",
            "transition-colors"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
