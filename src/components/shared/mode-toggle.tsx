"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

export function ModeToggle({variant="outline"}: {variant?: "outline" | "ghost"}) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger asChild >
        <Button variant={variant} size="icon" onClick={toggleTheme} >
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all " />
          ) : (
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 transition-all" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent >
        {
          theme=="light" ? "Dark Mode" : "Light Mode"
        }
      </HoverCardContent>
    </HoverCard>
  );
}
