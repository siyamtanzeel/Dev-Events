"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const currentPath = usePathname();
  const isActive = (href: string) => currentPath == href;
  return (
    <div className="navbar bg-zinc-900/30 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
            <li>
              <Link href={"/"} className={`${isActive("/") && "text-accent"}`}>
                Home
              </Link>
            </li>
            <li>
              <a>Events</a>
            </li>
            <li>
              <a>Create Events</a>
            </li>
          </ul>
        </div>
        <Link className="flex items-center space-x-1" href={"/"}>
          <Image src={"/logo.png"} height={32} width={32} alt="logo"></Image>{" "}
          <span className="font-extrabold italic">DevEvents</span>
        </Link>
      </div>
      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/"} className={`${isActive("/") && "text-accent"}`}>
              Home
            </Link>
          </li>
          <li>
            <a>Events</a>
          </li>
          <li>
            <a>Create Events</a>
          </li>
        </ul>
      </div>
      {/* <div className="navbar-end">
        <a className="btn">Button</a>
      </div> */}
    </div>
  );
};

export default Navbar;
