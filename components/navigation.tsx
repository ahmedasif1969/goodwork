"use client";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./logo";
import { Icon } from "./icon";
export const navigation = [
  ["Home", "home"],
  ["Services", "services"],
  ["Work", "work"],
  ["About", "about"],
  ["Contact", "contact"],
] as const;
export function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const media = window.matchMedia("(min-width: 800px)");
    const onResize = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    media.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
      media.removeEventListener("change", onResize);
    };
  }, [open]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -65% 0px" },
    );
    navigation.forEach(([, id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <header className="site-header" ref={header}>
      <a
        className="logo-link"
        href="#home"
        aria-label="Goodwork Digital home"
        onClick={() => setOpen(false)}
      >
        <Logo />
      </a>
      <nav
        className={`navigation ${open ? "is-open" : ""}`}
        id="main-navigation"
        aria-label="Main navigation"
      >
        {navigation.map(([label, id]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
      <a
        className="button button-small button-violet header-cta"
        href="#contact"
      >
        Get in Touch <Icon name="external" />
      </a>
      <button
        className="menu-toggle"
        ref={toggle}
        aria-expanded={open}
        aria-controls="main-navigation"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen(!open)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
