import React, { useState, useContext } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Button, Dropdown, Avatar } from "antd";
import {
  User,
  LogOut,
  ShoppingBag,
  Settings,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import Logo from "../assets/logo.jpg";
import CartIcon from "./CartIcon";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/#about" },
  { label: "Services", path: "/#services" },

];

export default function NavbarSection() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useContext(AuthContext);
  const toggleDrawer = (state) => () => setOpen(state);

  // 🔹 Dropdown menu items (Lucide icons)
  const userMenuItems = [
    {
      key: "account",
      label: (
        <div className="flex items-center gap-2">
          <Settings size={16} />
          My Account
        </div>
      ),
      onClick: () => navigate("/account"),
    },
    {
      key: "favorite",
      label: (
        <div className="flex items-center gap-2">
          <Heart size={16} />
          My Favorites
        </div>
      ),
      onClick: () => navigate("/favorites"),
    },
    {
      key: "orders",
      label: (
        <div className="flex items-center gap-2">
          <ShoppingBag size={16} />
          My Orders
        </div>
      ),
      onClick: () => navigate("/orders"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center gap-2 text-red-600">
          <LogOut size={16} />
          Logout
        </div>
      ),
      onClick: logout,
    },
  ];

  return (
    <nav className="w-full fixed top-0 z-50 bg-[#672674] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <img
          src={Logo}
          alt="Logo"
          className="h-20 cursor-pointer"
          onClick={() => navigate("/")}
        />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-white">
          {navLinks.map((link) => (
            <a key={link.label} href={link.path} className="hover:underline">
              {link.label}
            </a>
          ))}
          {/* 🛒 CART ICON */}
          <CartIcon />

          {/* 🔐 AUTH SECTION */}
          {loading ? null : !user ? (
            // NOT logged in
            <Button
              type="primary"
              size="large"
              className="rounded-full font-semibold shadow-md"
              style={{ backgroundColor: "#fff", color: "#9c0202" }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            // Logged in
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar icon={<User size={18} />} />
                <span>{user.username || user.email}</span>
              </div>
            </Dropdown>
          )}

        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon className="text-white" />
          </IconButton>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
        <div className="w-64 p-4 h-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Menu</h2>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </div>

          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                button
                onClick={() => {
                  navigate(link.path);
                  setOpen(false);
                }}
              >
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
          {/* 🛒 CART ICON */}
          <CartIcon />

          {!user ? (
            <Button
              type="primary"
              block
              size="large"
              onClick={() => {
                navigate("/login");
                setOpen(false);
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              danger
              block
              size="large"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Drawer>
    </nav>
  );
}
