import React, { useContext, useState } from "react";
import { Layout, Menu, Button, theme, Drawer, Grid } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  UserCircle,
  Menu as MenuIcon,
  LogOut,
  Star,
  Images,
  Settings,
  ShoppingBag,
} from "lucide-react";

import adminLogo from "../assets/admin-logo.png";
import AuthContext from "../context/AuthContext";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

// --- CONSTANTS ---
const HEADER_HEIGHT = 64;
const SIDEBAR_WIDTH_EXPANDED = 260;
const SIDEBAR_WIDTH_COLLAPSED = 80;
const SIDEBAR_COLOR = "#672674"; // Defined color variable

// Menu helper
const getItem = (label, key, icon, children) => ({
  key,
  icon,
  children,
  label,
});

const AdminLayout = () => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const items = [
    getItem(<NavLink to="/admin">Dashboard</NavLink>, "/admin", <LayoutDashboard size={18} />),
    getItem(<NavLink to="/admin/users">Users</NavLink>, "/admin/users", <Users size={18} />),
    getItem(<NavLink to="/admin/product">Products</NavLink>, "/admin/product", <Package size={18} />),
    getItem(<NavLink to="/admin/admin-orders">My Orders</NavLink>, "/admin/admin-orders", <ShoppingBag size={18} />),
    getItem(<NavLink to="/admin/account">Account Detail</NavLink>, "/admin/account", <UserCircle size={18} />),
    getItem(<NavLink to="/admin/banner">Banner Page</NavLink>, "/admin/banner", <Images size={18} />),
    getItem(<NavLink to="/admin/reviews">Reviews</NavLink>, "/admin/reviews", <Star size={18} />),
    getItem(<NavLink to="/admin/account-info">Settings</NavLink>, "/admin/account-info", <Settings size={18} />),
  ];

  /* Shared Menu Component */
  const SidebarMenu = (
    <Menu
      theme="dark" // Sets text color to white
      mode="inline"
      items={items}
      selectedKeys={[location.pathname]}
      onClick={() => isMobile && setCollapsed(true)}
      // Force background color to match sidebar
      style={{
        backgroundColor: SIDEBAR_COLOR,
        height: "100%",
        borderRight: 0,
      }}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "0 16px" : "0 24px",
          background: colorBgContainer,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          height: HEADER_HEIGHT,
          lineHeight: `${HEADER_HEIGHT}px`,
        }}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            type="text"
            className="flex items-center justify-center bg-gray-100 rounded-full w-10 h-10"
            icon={<MenuIcon size={20} />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <img src={adminLogo} alt="logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <div className="hidden sm:block font-bold text-[#672674] text-xl">
            Moon light briyani
          </div>
        </div>
        <Button
          type="primary"
          icon={<LogOut size={16} />}
          onClick={logout}
          className="bg-[#672674] flex items-center"
        >
          <span className={isMobile ? "hidden" : "inline"}>Logout</span>
        </Button>
      </Header>

      <Layout>
        {/* DESKTOP SIDEBAR */}
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            width={SIDEBAR_WIDTH_EXPANDED}
            collapsedWidth={SIDEBAR_WIDTH_COLLAPSED}
            trigger={null}
            style={{
              overflowY: "auto",
              height: `calc(100vh - ${HEADER_HEIGHT}px)`,
              position: "fixed",
              left: 0,
              top: HEADER_HEIGHT,
              bottom: 0,
              zIndex: 10,
              background: SIDEBAR_COLOR, // Set Background Here
            }}
          >
            {SidebarMenu}
          </Sider>
        )}

        {/* MOBILE DRAWER */}
        {isMobile && (
          <Drawer
            placement="left"
            open={!collapsed}
            onClose={() => setCollapsed(true)}
            width={260}
            bodyStyle={{ padding: 0, backgroundColor: SIDEBAR_COLOR }} // Set Background Here
            headerStyle={{ display: "none" }}
            styles={{ mask: { backdropFilter: "blur(2px)" } }}
          >
            {SidebarMenu}
          </Drawer>
        )}

        {/* MAIN CONTENT */}
        <Layout
          style={{
            marginLeft: !isMobile
              ? collapsed
                ? SIDEBAR_WIDTH_COLLAPSED
                : SIDEBAR_WIDTH_EXPANDED
              : 0,
            transition: "all 0.2s",
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
          }}
        >
          <Content
            style={{
              padding: 16,
              background: "#f5f5f5",
              minHeight: "100%",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
