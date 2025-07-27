import SidebarContent from "./SidebarContent";


const Sidebar = () => {
  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col lg:h-screen lg:sticky lg:top-0">
      <SidebarContent />
    </aside>
  );
};

export default Sidebar;
