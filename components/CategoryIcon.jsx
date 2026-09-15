export default function CategoryIcon({ icon, className = 'w-10 h-10' }) {
  const props = {
    className,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  switch (icon) {
    case 'helmet':
      return (
        <svg {...props}>
          <path d="M8 30c0-10 7-18 16-18s16 8 16 18" />
          <rect x="6" y="30" width="36" height="6" rx="2" />
          <path d="M24 12v-4" />
        </svg>
      );
    case 'boot':
      return (
        <svg {...props}>
          <path d="M14 8v18l-8 6v6h30c2-4-1-8-6-9l-6-2V8z" />
          <path d="M14 20h12" />
        </svg>
      );
    case 'gumboot':
      return (
        <svg {...props}>
          <path d="M18 6v20l-9 8v6h27c2-5-2-9-8-10l-4-1V6z" />
          <path d="M18 16h10" />
        </svg>
      );
    case 'worksuit':
      return (
        <svg {...props}>
          <path d="M16 6h16l3 8-6 2v6l4 16H15l4-16v-6l-6-2z" />
          <path d="M20 6v6M28 6v6" />
        </svg>
      );
    case 'jacket':
      return (
        <svg {...props}>
          <path d="M16 6h16l6 6-4 4-2-2v22H14V14l-2 2-4-4z" />
          <path d="M20 6v34M28 6v34" strokeDasharray="2 3" />
        </svg>
      );
    case 'glove':
      return (
        <svg {...props}>
          <path d="M14 22V10a3 3 0 016 0v8m4-8a3 3 0 016 0v8m4-6a3 3 0 016 0v14" />
          <path d="M34 24v-4a3 3 0 016 0v10c0 7-6 12-13 12h-3c-6 0-9-4-9-9V22a3 3 0 016 0" />
        </svg>
      );
    case 'vest':
      return (
        <svg {...props}>
          <path d="M15 8l9 4 9-4 5 6-5 4v22H15V18l-5-4z" />
          <path d="M20 12v26M28 12v26" strokeDasharray="2 3" />
        </svg>
      );
    case 'goggles':
      return (
        <svg {...props}>
          <circle cx="15" cy="24" r="8" />
          <circle cx="33" cy="24" r="8" />
          <path d="M23 24h2M7 20l-3-2M41 20l3-2" />
        </svg>
      );
    case 'earmuffs':
      return (
        <svg {...props}>
          <path d="M10 26v-4a14 14 0 0128 0v4" />
          <rect x="6" y="24" width="8" height="12" rx="3" />
          <rect x="34" y="24" width="8" height="12" rx="3" />
        </svg>
      );
    case 'respirator':
      return (
        <svg {...props}>
          <path d="M10 22c0-6 6-10 14-10s14 4 14 10-4 12-14 12-14-6-14-12z" />
          <path d="M14 22h20M10 18l-4-2M38 18l4-2" />
        </svg>
      );
    case 'firstaid':
      return (
        <svg {...props}>
          <rect x="7" y="14" width="34" height="24" rx="3" />
          <path d="M17 14v-3a3 3 0 013-3h8a3 3 0 013 3v3" />
          <path d="M24 21v10M19 26h10" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="24" cy="24" r="16" />
        </svg>
      );
  }
}
