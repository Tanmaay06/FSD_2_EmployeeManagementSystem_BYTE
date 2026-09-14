/**
 * Icons — Feather/Lucide-style SVG icon set (24×24, stroke-based).
 * Usage: <IconUsers size={18} />
 */
const defaultProps = { size: 16, strokeWidth: 2, color: 'currentColor' };

function Svg({ size, strokeWidth, color, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function IconUsers({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

export function IconUserCheck({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </Svg>
  );
}

export function IconUserMinus({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </Svg>
  );
}

export function IconBuilding({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <rect x="2" y="7" width="20" height="14" rx="1" />
      <path d="M16 21V3.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V21" />
      <line x1="9" y1="11" x2="9" y2="11.01" strokeWidth="3" strokeLinecap="round" />
      <line x1="15" y1="11" x2="15" y2="11.01" strokeWidth="3" strokeLinecap="round" />
      <line x1="9" y1="16" x2="9" y2="16.01" strokeWidth="3" strokeLinecap="round" />
      <line x1="15" y1="16" x2="15" y2="16.01" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconGrid({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </Svg>
  );
}

export function IconList({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="3" strokeLinecap="round" />
      <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="3" strokeLinecap="round" />
      <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconPlus({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function IconDatabase({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </Svg>
  );
}

export function IconSearch({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </Svg>
  );
}

export function IconRefresh({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </Svg>
  );
}

export function IconFolderOpen({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      <line x1="2" y1="13" x2="22" y2="13" />
    </Svg>
  );
}

export function IconLock({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function IconMail({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </Svg>
  );
}

export function IconEye({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </Svg>
  );
}

export function IconEyeOff({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </Svg>
  );
}

export function IconShield({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}

export function IconServer({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="3" strokeLinecap="round" />
      <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconSmartphone({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconZap({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}

export function IconBarChart({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </Svg>
  );
}

export function IconCheck({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function IconCheckCircle({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

export function IconArrowRight({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

export function IconChevronRight({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

export function IconLogOut({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </Svg>
  );
}

export function IconAlertTriangle({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconInfo({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

export function IconGlobe({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function IconGithub({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </Svg>
  );
}

export function IconLinkedin({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return (
    <Svg size={size} strokeWidth={strokeWidth} color={color} style={style}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </Svg>
  );
}

export function IconMail2({ size = defaultProps.size, strokeWidth = defaultProps.strokeWidth, color = defaultProps.color, style }) {
  return <IconMail size={size} strokeWidth={strokeWidth} color={color} style={style} />;
}
