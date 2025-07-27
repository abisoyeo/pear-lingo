import SidebarContent from "./SidebarContent";
import { SidebarCloseIcon, XIcon } from "lucide-react";

const MobileDrawer = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-0 z-40 transition-transform duration-300 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    } bg-black/50 lg:hidden`}
    onClick={onClose}
  >
    <div
      className="relative w-64 h-full bg-base-200 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="btn btn-sm btn-circle absolute top-2 right-2 z-10"
      >
        <SidebarCloseIcon className="h-5 w-5" />
      </button>
      <SidebarContent />
    </div>
  </div>
);

export default MobileDrawer;
