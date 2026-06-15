// Minimal stroke icon set — original, all lucide-style 24x24 with currentColor
const Icon = ({ name, size = 20, strokeWidth = 1.6, ...rest }) => {
  const common = {
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...rest,
  };
  switch (name) {
    case "home":
      return <svg {...common}><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg>;
    case "stetho":
      return <svg {...common}><path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M6 3H4.5"/><path d="M14 3h1.5"/><path d="M10 12v3a5 5 0 0 0 10 0v-1"/><circle cx="20" cy="13" r="1.6"/></svg>;
    case "report":
      return <svg {...common}><path d="M7 3h8l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M15 3v4h4"/><path d="M9 12h7"/><path d="M9 16h5"/></svg>;
    case "star":
      return <svg {...common}><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6L12 17l-5.4 2.8 1-6L3.2 9.5l6.1-.9L12 3z"/></svg>;
    case "grid":
      return <svg {...common}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>;
    case "bell":
      return <svg {...common}><path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case "accessibility":
      return <svg {...common}><circle cx="12" cy="5" r="1.6"/><path d="M7 9l5 1 5-1"/><path d="M12 10v4l-2 6"/><path d="M12 14l3 6"/></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
    case "chev-right":
      return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
    case "chev-left":
      return <svg {...common}><path d="m15 6-6 6 6 6"/></svg>;
    case "info":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.8" fill="currentColor"/></svg>;
    case "heart":
      return <svg {...common}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case "heart-fill":
      return <svg {...common} fill="currentColor" stroke="currentColor" strokeWidth="1.2"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>;
    case "sliders":
      return <svg {...common}><path d="M4 7h10"/><circle cx="17" cy="7" r="2"/><path d="M19 7h1"/><path d="M4 17h4"/><circle cx="11" cy="17" r="2"/><path d="M13 17h7"/></svg>;
    case "switch":
      return <svg {...common}><path d="M4 7h14"/><path d="m15 4 3 3-3 3"/><path d="M20 17H6"/><path d="m9 14-3 3 3 3"/></svg>;
    case "calendar":
      return <svg {...common}><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17"/><path d="M8 3v4"/><path d="M16 3v4"/></svg>;
    case "pill":
      return <svg {...common}><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)"/><path d="M8.5 7.5 15 14" transform="rotate(-35 12 12)"/></svg>;
    case "scissors":
      return <svg {...common}><circle cx="6" cy="7" r="2.5"/><circle cx="6" cy="17" r="2.5"/><path d="M8.5 8.5 20 20"/><path d="M8.5 15.5 20 4"/><path d="M12.5 12.5 14 14"/></svg>;
    case "bed":
      return <svg {...common}><path d="M3 19V8"/><path d="M3 13h18v6"/><path d="M3 13v-2a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v2"/><circle cx="7" cy="11.5" r="1.5"/></svg>;
    case "flask":
      return <svg {...common}><path d="M9 3h6"/><path d="M10 3v5L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18L14 8V3"/><path d="M7.5 14h9"/></svg>;
    case "tube":
      return <svg {...common}><path d="M9 3h6v14a3 3 0 0 1-6 0V3z"/><path d="M9 3h6"/><path d="M9 10h6"/></svg>;
    case "syringe":
      return <svg {...common}><path d="m18 2 4 4"/><path d="m16 4 4 4"/><path d="M14 6 3 17v4h4L18 10"/><path d="m9 11 4 4"/></svg>;
    case "shield":
      return <svg {...common}><path d="M12 3 4 6v6c0 4.5 3 8 8 9 5-1 8-4.5 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/></svg>;
    case "pulse":
      return <svg {...common}><path d="M3 12h4l2-5 4 10 2-5h6"/></svg>;
    case "phone":
      return <svg {...common}><path d="M5 4h3l2 5-2 1a10 10 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>;
    case "search":
      return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4"/></svg>;
    case "edit":
      return <svg {...common}><path d="M4 20h4l11-11-4-4L4 16z"/><path d="m13 6 4 4"/></svg>;
    case "refresh":
      return <svg {...common}><path d="M4 12a8 8 0 0 1 14-5.3L20 8"/><path d="M20 4v4h-4"/><path d="M20 12a8 8 0 0 1-14 5.3L4 16"/><path d="M4 20v-4h4"/></svg>;
    case "trash":
      return <svg {...common}><path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6M14 11v6"/></svg>;
    case "save":
      return <svg {...common}><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7V4"/><path d="M8 14h8v6H8z"/></svg>;
    case "external":
      return <svg {...common}><path d="M14 4h6v6"/><path d="M10 14 20 4"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg>;
    case "plus":
      return <svg {...common}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case "image":
      return <svg {...common}><rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg>;
    case "box":
      return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="m4 7.5 8 4.5 8-4.5"/><path d="M12 12v9"/></svg>;
    case "sort":
      return <svg {...common}><path d="M7 4v16"/><path d="m4 7 3-3 3 3"/><path d="M17 20V4"/><path d="m20 17-3 3-3-3"/></svg>;
    case "compass":
      return <svg {...common}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none"/></svg>;
    case "scale":
      return <svg {...common}><rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 8.5a4 4 0 0 1 8 0"/><path d="m12 8.5-1.6 2.2"/></svg>;
    case "ruler":
      return <svg {...common}><rect x="2.5" y="7.5" width="19" height="9" rx="1.5" transform="rotate(0 12 12)"/><path d="M6.5 7.5v3M10 7.5v4M13.5 7.5v3M17 7.5v4"/></svg>;
    case "drop":
      return <svg {...common}><path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z"/></svg>;
    case "lungs":
      return <svg {...common}><path d="M12 4v8"/><path d="M9 8c0 4-1 5-1 8a2 2 0 0 1-4 0c0-3 1-6 3-8 1-1 2-1 2 0z"/><path d="M15 8c0 4 1 5 1 8a2 2 0 0 0 4 0c0-3-1-6-3-8-1-1-2-1-2 0z"/></svg>;
    case "thermometer":
      return <svg {...common}><path d="M12 4a2 2 0 0 1 2 2v8.5a3.5 3.5 0 1 1-4 0V6a2 2 0 0 1 2-2z"/><path d="M12 11v4"/></svg>;
    case "moon":
      return <svg {...common}><path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"/></svg>;
    case "flame":
      return <svg {...common}><path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1.5.5-2.5 1-3 .5 1 1.5 1.5 2 1.5C11 8 11 5 12 3z"/></svg>;
    case "footprints":
      return <svg {...common}><path d="M5 13c-1 0-2-1-2-3s1-4 2-4 2 1 2 3-1 4-2 4z"/><path d="M5 13v3a2 2 0 0 0 4 0v-1"/><path d="M17 9c1 0 2 1 2 3s-1 4-2 4-2-1-2-3 1-4 2-4z"/><path d="M17 9V6a2 2 0 0 0-4 0v1"/></svg>;
    case "utensils":
      return <svg {...common}><path d="M7 3v8"/><path d="M5 3v4a2 2 0 0 0 4 0V3"/><path d="M7 11v10"/><path d="M16 3c-1.5 0-3 2-3 5s1 4 2 4h1v9"/></svg>;
    case "activity":
      return <svg {...common}><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>;
    case "dumbbell":
      return <svg {...common}><path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12"/></svg>;
    case "pin":
      return <svg {...common}><path d="M12 17v5"/><path d="M9 3h6l-1 6 3 3v1H7v-1l3-3-1-6z"/></svg>;
    case "pin-fill":
      return <svg {...common} fill="currentColor" stroke="currentColor" strokeWidth="1.2"><path d="M9 3h6l-1 6 3 3v1H7v-1l3-3-1-6z"/><path d="M12 17v5" stroke="currentColor" strokeWidth="1.6"/></svg>;
    case "info-circle":
      return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.8" fill="currentColor"/></svg>;
    case "grip":
      return <svg {...common}><circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg>;
    default:
      return <svg {...common}><rect x="4" y="4" width="16" height="16" rx="2"/></svg>;
  }
};

window.Icon = Icon;
