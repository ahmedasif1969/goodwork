import Image from "next/image";

// Keep the filtered artwork immutable. Scroll only transforms its cached image.
export function PageAurora() {
  return (
    <div className="page-aurora" aria-hidden="true">
      <div className="aurora-scroll">
        <div className="aurora-idle">
          <Image
            className="aurora-svg"
            src="/aurora.svg"
            alt=""
            width={1000}
            height={1000}
            unoptimized
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
