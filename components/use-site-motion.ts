"use client";

import { useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useSiteMotion(root: RefObject<HTMLDivElement | null>) {
  const [ambientPaused, setAmbientPaused] = useState(false);
  const paused = useRef(false);
  const liveSync = useRef<(() => void) | null>(null);
  useGSAP(
    () => {
      const scope = root.current;
      if (!scope) return;
      const hero = scope.querySelector<HTMLElement>(".hero");
      if (!hero) return;
      const select = gsap.utils.selector(scope);
      const media = gsap.matchMedia();
      let alive = true;

      ScrollTrigger.create({
        start: 24,
        end: "max",
        toggleClass: {
          targets: select(".site-header"),
          className: "is-scrolled",
        },
      });

      media.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 800px) and (pointer: fine)",
        },
        (context) => {
          if (!context.conditions?.motion) return;
          const fullMotion =
            context.conditions.desktop && navigator.hardwareConcurrency > 4;
          const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
          if (window.scrollY < hero.offsetHeight) {
            intro
              .from(
                select(
                  ".site-header > .logo-link, .site-header > nav, .header-cta, .menu-toggle",
                ),
                {
                  y: -8,
                  opacity: 0,
                  duration: 0.6,
                  stagger: 0.045,
                  clearProps: "transform,opacity",
                },
                0,
              )
              .from(
                select(".hero-badge"),
                {
                  y: 10,
                  opacity: 0,
                  duration: 0.65,
                  clearProps: "transform,opacity",
                },
                0.12,
              )
              .from(
                select(".hero h1"),
                {
                  y: 24,
                  opacity: 0,
                  duration: 0.95,
                  clearProps: "transform,opacity",
                },
                0.2,
              )
              .from(
                select(".service-line"),
                {
                  y: 14,
                  opacity: 0,
                  duration: 0.75,
                  clearProps: "transform,opacity",
                },
                0.34,
              )
              .from(
                select(".hero-copy"),
                {
                  y: 12,
                  opacity: 0,
                  duration: 0.75,
                  clearProps: "transform,opacity",
                },
                0.44,
              )
              .from(
                select(".hero-actions > a"),
                {
                  y: 12,
                  opacity: 0,
                  duration: 0.65,
                  stagger: 0.075,
                  clearProps: "transform,opacity",
                },
                0.54,
              )
              .from(
                select(".horizon-reveal"),
                {
                  scale: 0.93,
                  opacity: 0.2,
                  duration: 1.7,
                  ease: "sine.out",
                  clearProps: "transform,opacity",
                },
                0.1,
              )
              .from(
                select(".ambient-reveal"),
                {
                  opacity: 0.15,
                  duration: 1.8,
                  ease: "sine.out",
                  clearProps: "opacity",
                },
                0,
              )
              .from(
                select(".hero-bottom"),
                { opacity: 0, duration: 0.7, clearProps: "opacity" },
                0.75,
              );
          }

          const fields = select(
            fullMotion ? ".ambient-layer" : ".ambient-layer-violet",
          ) as HTMLElement[];
          const drift = fields.map((field, index) =>
            gsap.to(field, {
              x: fullMotion ? [24, -32, 18][index] : 10,
              y: fullMotion ? [-18, 14, -12][index] : -8,
              scale: fullMotion ? [1.06, 1.09, 1.04][index] : 1.035,
              duration: [23, 31, 37][index],
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              paused: true,
            }),
          );
          const auroraDrift = gsap.to(select(".aurora-idle"), {
            xPercent: 1,
            yPercent: -0.8,
            scale: 1.025,
            duration: 34,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            paused: true,
          });
          const aurora = gsap.timeline({
            scrollTrigger: {
              start: 0,
              end: "max",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
          aurora.fromTo(
            select(".aurora-scroll"),
            { opacity: 0.08 },
            { opacity: 0.6, duration: 0.16, ease: "none" },
            0,
          );
          // Shared desktop/mobile choreography: transform cached artwork rather
          // than mutating SVG geometry and re-rasterizing its blur every frame.
          const turns = [
            { xPercent: -17, yPercent: -2, rotation: 5 },
            { xPercent: 9, yPercent: -5, rotation: -7 },
            { xPercent: -14, yPercent: -2, rotation: 4 },
            { xPercent: 7, yPercent: -4, rotation: -5 },
            { xPercent: -8, yPercent: -6, rotation: 2 },
          ];
          turns.forEach((turn, index) => {
            aurora.to(
              select(".aurora-scroll"),
              { ...turn, force3D: true, duration: 0.2, ease: "sine.inOut" },
              index * 0.2,
            );
          });
          aurora.to(
            select(".aurora-scroll"),
            { opacity: 0.38, duration: 0.2, ease: "none" },
            0.8,
          );
          let heroVisible = true;
          hero.classList.add("ambient-ready");
          const syncAmbient = () => {
            const allowed = !document.hidden && !paused.current;
            scope.classList.toggle("aurora-running", allowed);
            if (allowed) auroraDrift.play();
            else auroraDrift.pause();
            const playing = heroVisible && !document.hidden && !paused.current;
            hero.classList.toggle("ambient-running", playing);
            drift.forEach((tween) => {
              if (playing) tween.play();
              else tween.pause();
            });
          };
          liveSync.current = syncAmbient;
          const visibility = ScrollTrigger.create({
            trigger: hero,
            start: "top bottom",
            end: "bottom top",
            onToggle: (self) => {
              heroVisible = self.isActive;
              syncAmbient();
            },
          });
          heroVisible = visibility.isActive;
          syncAmbient();
          document.addEventListener("visibilitychange", syncAmbient);

          // Entrance and scroll use different wrappers, so their transforms never compete.
          gsap.to(select(".horizon-motion"), {
            y: fullMotion ? 44 : 12,
            scale: fullMotion ? 1.06 : 1.02,
            opacity: 0.7,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: fullMotion ? 0.9 : true,
            },
          });

          select("[data-reveal]").forEach((element: HTMLElement) => {
            gsap.from(element, {
              y: fullMotion ? 24 : 14,
              opacity: 0.45,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 91%",
                toggleActions: "play none none reverse",
              },
            });
          });
          select(".project-card").forEach(
            (element: HTMLElement, index: number) => {
              gsap.from(element, {
                y: fullMotion ? 38 : 18,
                opacity: 0.45,
                duration: 0.9,
                delay: fullMotion ? (index % 2) * 0.06 : 0,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 92%",
                  toggleActions: "play none none reverse",
                },
              });
            },
          );
          gsap.from(select(".service-card"), {
            y: 22,
            opacity: 0.55,
            duration: 0.8,
            stagger: fullMotion ? 0.1 : 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: select(".services-grid")[0],
              start: "top 89%",
              toggleActions: "play none none reverse",
            },
          });
          gsap.from(select(".approach-grid > li"), {
            y: 16,
            opacity: 0.55,
            duration: 0.7,
            stagger: 0.07,
            scrollTrigger: {
              trigger: select(".approach-grid")[0],
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
          gsap.from(select(".footer-wordmark"), {
            y: 24,
            opacity: 0.3,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: select(".footer-wordmark")[0],
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          });
          if (fullMotion) {
            select(".project-display").forEach((element: HTMLElement) => {
              gsap.fromTo(
                element,
                { y: 10 },
                {
                  y: -10,
                  ease: "none",
                  scrollTrigger: {
                    trigger: element.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.8,
                  },
                },
              );
            });
            gsap.from(select(".step-rule"), {
              scaleX: 0,
              transformOrigin: "left center",
              stagger: 0.12,
              ease: "none",
              scrollTrigger: {
                trigger: select(".approach-grid")[0],
                start: "top 80%",
                end: "bottom 55%",
                scrub: 0.7,
              },
            });
          }
          return () => {
            document.removeEventListener("visibilitychange", syncAmbient);
            hero.classList.remove("ambient-running", "ambient-ready");
            scope.classList.remove("aurora-running");
            liveSync.current = null;
          };
        },
      );
      document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
      return () => {
        alive = false;
        media.revert();
      };
    },
    { scope: root },
  );
  const toggleAmbient = () => {
    paused.current = !paused.current;
    setAmbientPaused(paused.current);
    liveSync.current?.();
  };
  return { ambientPaused, toggleAmbient };
}
