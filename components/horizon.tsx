import { useId } from "react";

export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <div className="ambient-reveal">
        <div className="ambient-layer ambient-layer-violet">
          <div className="ambient-field ambient-field-violet" />
        </div>
        <div className="ambient-layer ambient-layer-plum">
          <div className="ambient-field ambient-field-plum" />
        </div>
        <div className="ambient-layer ambient-layer-lilac">
          <div className="ambient-field ambient-field-lilac" />
        </div>
      </div>
      <div className="hero-grain" />
    </div>
  );
}

export function Horizon() {
  const id = useId().replace(/:/g, "");
  const arc = "M60 274 C260 58 740 58 940 274";
  return (
    <div className="horizon" aria-hidden="true">
      <div className="horizon-motion">
        <div className="horizon-reveal">
          <div className="horizon-atmosphere" />
          <svg className="horizon-light" viewBox="0 0 1000 360" preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient
                id={`${id}-violet`}
                x1="60"
                y1="0"
                x2="940"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#7137ff" stopOpacity="0" />
                <stop offset=".16" stopColor="#7137ff" stopOpacity=".85" />
                <stop offset=".36" stopColor="#9d74ff" />
                <stop offset=".5" stopColor="#bc9dff" />
                <stop offset=".64" stopColor="#9d74ff" />
                <stop offset=".84" stopColor="#7137ff" stopOpacity=".85" />
                <stop offset="1" stopColor="#7137ff" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id={`${id}-core`}
                x1="120"
                y1="0"
                x2="880"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#a68aff" stopOpacity="0" />
                <stop offset=".3" stopColor="#c9b5ff" stopOpacity=".6" />
                <stop offset=".5" stopColor="#e1d6ff" stopOpacity=".95" />
                <stop offset=".7" stopColor="#c9b5ff" stopOpacity=".6" />
                <stop offset="1" stopColor="#a68aff" stopOpacity="0" />
              </linearGradient>
              <filter
                id={`${id}-haze`}
                x="-30%"
                y="-100%"
                width="160%"
                height="300%"
              >
                <feGaussianBlur stdDeviation="29" />
              </filter>
              <filter
                id={`${id}-bloom`}
                x="-20%"
                y="-80%"
                width="140%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="14" />
              </filter>
              <filter
                id={`${id}-light`}
                x="-20%"
                y="-80%"
                width="140%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>
            <path
              d={arc}
              stroke="#6428ed"
              strokeWidth="108"
              opacity=".66"
              filter={`url(#${id}-haze)`}
            />
            <path
              d={arc}
              stroke={`url(#${id}-violet)`}
              strokeWidth="55"
              filter={`url(#${id}-bloom)`}
            />
            <path
              d={arc}
              stroke={`url(#${id}-core)`}
              strokeWidth="17"
              filter={`url(#${id}-light)`}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
