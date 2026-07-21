import { NavLink } from 'react-router-dom';

const DashboardSidebar = ({ links, title }) => {
  return (
    <aside className="w-full md:w-64 shrink-0">
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-4 sticky top-24">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400 px-3 mb-2">
          {title}
        </h3>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
