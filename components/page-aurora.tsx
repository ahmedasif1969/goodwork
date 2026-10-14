import { useId } from "react";

// One shared path keeps the halo and luminous filament connected as it bends.
export function PageAurora() {
  const id = useId().replace(/:/g, "");
  return (
    <div className="page-aurora" aria-hidden="true">
      <div className="aurora-scroll">
        <div className="aurora-idle">
          <svg
            className="aurora-svg"
            viewBox="0 0 1000 1000"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <path
                id={`${id}-path`}
                className="aurora-path"
                d="M1080 -120 C1000 180 780 180 860 400 S140 700 200 1120"
              />
              <linearGradient
                id={`${id}-light`}
                x1="0"
                y1="0"
                x2="0"
                y2="1000"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7954b7" stopOpacity="0" />
                <stop offset=".16" stopColor="#7954b7" stopOpacity=".45" />
                <stop offset=".42" stopColor="#b48ce3" stopOpacity=".85" />
                <stop offset=".66" stopColor="#8152bb" stopOpacity=".7" />
                <stop offset=".86" stopColor="#683a9f" stopOpacity=".35" />
                <stop offset="1" stopColor="#683a9f" stopOpacity="0" />
              </linearGradient>
              <filter
                id={`${id}-halo`}
                filterUnits="userSpaceOnUse"
                x="-250"
                y="-250"
                width="1500"
                height="1500"
              >
                <feGaussianBlur stdDeviation="25" />
              </filter>
              <filter
                id={`${id}-mist`}
                filterUnits="userSpaceOnUse"
                x="-250"
                y="-250"
                width="1500"
                height="1500"
              >
                <feGaussianBlur stdDeviation="10" />
              </filter>
              <filter
                id={`${id}-filament`}
                filterUnits="userSpaceOnUse"
                x="-250"
                y="-250"
                width="1500"
                height="1500"
              >
                <feGaussianBlur stdDeviation="2.3" />
              </filter>
            </defs>
            <use
              href={`#${id}-path`}
              stroke={`url(#${id}-light)`}
              strokeWidth="135"
              opacity=".6"
              filter={`url(#${id}-halo)`}
            />
            <use
              href={`#${id}-path`}
              stroke={`url(#${id}-light)`}
              strokeWidth="34"
              opacity=".32"
              filter={`url(#${id}-mist)`}
            />
            <use
              href={`#${id}-path`}
              stroke={`url(#${id}-light)`}
              strokeWidth="3"
              opacity=".42"
              filter={`url(#${id}-filament)`}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
