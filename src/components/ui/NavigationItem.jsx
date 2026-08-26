import { NavLink } from 'react-router-dom'

export function NavigationItem({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `fd-ui relative px-1 py-1 transition ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-signal" />}
        </>
      )}
    </NavLink>
  )
}
