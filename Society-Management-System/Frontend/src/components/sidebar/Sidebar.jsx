import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { sidebarItems } from "../../constantdata";
import { securityBar } from "../../constantdata";
import { residentItems } from "../../constantdata";
import Logo from "../Logo";
import logout from "../../assets/images/logout.png";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../services/AuthService";
import sidebaricon from "../../assets/images/sidebarmenuicon.png";
import downangle from "../../assets/images/downangle.svg";
import { LogoutUser } from "../../redux/features/AuthSlice";
const tabs = securityBar;

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState(null);
  const [openSubItems, setOpenSubItems] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tabs, setTabs] = useState([]);
  const { role } = useSelector((store) => store.auth.user);

  const handleItemClick = (item) => {
    if (item.subItems) {
      setOpenSubItems((prev) => {
        const newState = { [item.id]: !prev[item.id] };
        localStorage.setItem("openSubItems", JSON.stringify(newState));
        return newState;
      });
    } else {
      setOpenSubItems({});
      localStorage.removeItem("openSubItems");
      toggleSidebar();
    }
    setActiveItem(item.id);
    localStorage.setItem("activeItem", item.id);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      navigate("/");
      dispatch(LogoutUser());
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname;
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    const savedSubItems = localStorage.getItem("openSubItems");
    if (savedSubItems) {
      setOpenSubItems(JSON.parse(savedSubItems));
    }
    const activeParentItem = tabs.find(
      (item) =>
        item.subItems?.some((subItem) => subItem.path === currentPath) ||
        item.path === currentPath
    );

    if (activeParentItem) {
      setActiveItem(activeParentItem.id);
      if (activeParentItem.subItems) {
        setOpenSubItems((prev) => ({
          ...prev,
          [activeParentItem.id]: true,
        }));
      }
    }

    if (role === "admin") {
      setTabs(sidebarItems);
    } else if (role === "security") {
      setTabs(securityBar);
    } else if (role === "resident") {
      setTabs(residentItems);
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen, location.pathname, role, tabs]);

  return (
    <>
      <button
        className="lg:hidden fixed top-[26px] left-4 z-[9999] max-sm:block"
        onClick={toggleSidebar}
      >
        <img src={sidebaricon} alt="" />
      </button>

      <aside
        className={`fixed top-0 left-0 z-[9999] h-full w-[280px] bg-white dark:bg-[#111827] p-4 shadow-lg border border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:transition-none lg:relative lg:transform-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:w-[280px] lg:block z-[9999]`}
      >
        <div className="flex justify-between items-center mb-[30px] border-b border-slate-200 dark:border-slate-700 pb-[28px] pt-[15px]">
          <Logo sidebarlogo />
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-[12px] right-[8px]"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <nav>
          <ul>
            {tabs.map((item) => (
              <li key={item.id}>
                {item.name === "dashboard" &&
                location.pathname === "/dashboard" ? null : (
                  <div className="relative">
                    <NavLink
                      to={item.path || "#"}
                      className={`flex items-center mb-[10px] text-sm font-medium rounded-lg p-[14px] group text-gray-700 dark:text-gray-200 ${
                        activeItem === "dashboard" || activeItem === item.id
                          ? "bg-custom-gradient text-white border border-transparent shadow-sm"
                          : "hover:bg-custom-gradient hover:text-white "
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="mr-[10px]">
                        <img
                          src={item.icon}
                          alt=""
                          className={`transition duration-300 group-hover:brightness-0 group-hover:invert ${
                            activeItem === item.id
                              ? "filter brightness-0 invert"
                              : ""
                          }`}
                        />
                      </div>
                      <span className="lg:inline transition duration-0 group-hover:text-white font-medium leading-[19.5px] text-[13px]">
                        {item.label}
                      </span>
                      {item.subItems && (
                        <img
                          src={downangle}
                          className={`ml-auto transition-transform duration-300 ${
                            openSubItems[item.id] ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </NavLink>
                    {(activeItem === "dashboard" || activeItem === item.id) && (
                      <div className="sidebar-border sidebar-border-active text-gray-700 dark:text-gray-200"></div>
                    )}
                  </div>
                )}
                {item.subItems && openSubItems[item.id] && (
                  <ul className="ml-4 mt-2 mb-2">
                    {item.subItems.map((subItem) => (
                      <li
                        key={subItem.id}
                        className={`border-l-2 pl-2 ${
                          location.pathname === subItem.path && subItem.id
                            ? "border-cyan-400"
                            : "border-gray-300 hover:border-cyan-400"
                        }`}
                      >
                        <NavLink
                          to={subItem.path}
                          className={`flex items-center text-sm rounded-lg pt-[6px] pb-[5px] ${
                            location.pathname === subItem.path && subItem.id
                              ? "text-slate-900 dark:text-white font-medium"
                              : "hover:text-cyan-500 dark:hover:text-cyan-300 font-medium"
                          }`}
                          onClick={() => {
                            setActiveItem(subItem.id);
                            toggleSidebar();
                          }}
                        >
                          <span
                            className={`ml-2 transition duration-500 ${
                              location.pathname === subItem.path
                                ? "text-slate-900 dark:text-white"
                                : "text-gray-700 dark:text-gray-200 hover:text-cyan-500"
                            }`}
                          >
                            {subItem.label}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          {/* Logout */}
          <div className="w-full absolute bottom-0 left-0 p-4">
            <div className="border border-[#F4F4F4]"></div>
            <button
              onClick={handleLogout}
              className="flex items-center mb-[10px] text-[16px] font-medium rounded-lg p-[14px] text-[#E74C3C]"
            >
              <img src={logout} alt="Logout Icon" className="mr-[12px]" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Sidebar screen*/}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden z-50"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
}
