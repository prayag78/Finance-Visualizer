"use client";

import Link from "next/link";
import { ArrowRightIcon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isDefaultPage = pathname === "/";

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <div className="flex flex-row justify-between">
          {!isDefaultPage ? (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 text-gray-900 text-sm sm:text-base"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Back
            </Button>
          ) : <div></div>}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Link href="/dashboard">
              <div className="text-sm sm:text-base text-gray-900 max-w-2xl mx-auto">
                Dashboard <ArrowRightIcon className="w-4 h-4 inline-block" />
              </div>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Personal Finance Visualizer
            </div>

            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Visualize your spending patterns and track your expenses
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
