import { GoldButton } from "@/components/ui/button"
import { useState } from "react";

interface HeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Header({ isMenuOpen, toggleMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 px-16 py-0 bg-white border-b border-solid border-b-blue-50">
      <nav className="flex justify-between items-center mx-auto my-0 h-20 max-w-[1627px]">
        <div className="flex items-center">
          <span className="ml-3 text-2xl font-bold text-gray-800">GoDex</span>
        </div>
        <div className="flex gap-3.5 items-center max-md:hidden">
          <a
            href="#"
            className="text-base font-medium no-underline text-neutral-600"
          >
            Home
          </a>
          <a
            href="#"
            className="text-base font-medium no-underline text-neutral-600"
          >
            Sales
          </a>
          <a
            href="#"
            className="text-base font-medium no-underline text-neutral-600"
          >
            Support&nbsp;
          </a>
          <a
            href="#"
            className="text-base font-medium no-underline text-neutral-600"
          >
            Contact
          </a>
          <a
            href="#"
            className="text-base font-medium no-underline text-neutral-600"
          />
        </div>
        <div className="flex gap-6 items-center max-md:hidden">
          <a href="#" className="text-base no-underline text-neutral-600">
            Sign in
          </a>
          <GoldButton>
  &nbsp;Learn More
</GoldButton>

        </div>
        <button
          className="text-2xl text-gray-800 cursor-pointer border-[none] md:hidden"
          onClick={toggleMenu}
        >
          ☰
        </button>
      </nav>
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-full z-40 px-16 py-5 border-t border-solid bg-[white] border-t-blue-50 shadow-[0_4px_6px_rgba(0,0,0,0.1)] md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#"
              className="px-0 py-2 text-base font-medium no-underline text-neutral-600"
            >
              Solutions
            </a>
            <a
              href="#"
              className="px-0 py-2 text-base font-medium no-underline text-neutral-600"
            >
              Platform
            </a>
            <a
              href="#"
              className="px-0 py-2 text-base font-medium no-underline text-neutral-600"
            >
              Clients
            </a>
            <a
              href="#"
              className="px-0 py-2 text-base font-medium no-underline text-neutral-600"
            >
              Resources
            </a>
            <a
              href="#"
              className="px-0 py-2 text-base font-medium no-underline text-neutral-600"
            >
              Company
            </a>
            <div className="pt-4 mt-4 border-t border-solid border-t-blue-50">
              <a
                href="#"
                className="mb-4 text-base no-underline text-neutral-600"
              >
                Sign in
              </a>
              <button className="px-6 py-3 w-full text-base font-medium bg-teal-700 rounded-lg cursor-pointer border-[none] duration-[0.2s] text-[white] transition-[background-color]">
                Learn more
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
