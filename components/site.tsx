"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import {
  approach,
  principles,
  projects,
  services,
  workflows,
} from "@/lib/content";
import { Icon } from "./icon";
import { Logo } from "./logo";
import { Navigation, navigation } from "./navigation";
import { ContactForm } from "./contact-form";
import { HeroAtmosphere, Horizon } from "./horizon";
import { useSiteMotion } from "./use-site-motion";

function ProjectPreview({ project }: { project: (typeof projects)[number] }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`project-preview preview-${project.tone}`}>
      <div className="project-display">
        <div className="project-browser">
          <div className="project-browser-bar" aria-hidden="true">
            <span className="browser-controls">
              <i />
              <i />
              <i />
            </span>
            <span className="browser-address">
              {new URL(project.url).hostname}
            </span>
            <span className="browser-lock">
              <Icon
                name={
                  project.category.includes("Application") ? "code" : "window"
                }
              />
            </span>
          </div>
          <div className="project-browser-body">
            {project.image && !failed ? (
              <Image
                src={project.image}
                alt={`Homepage of ${project.name}`}
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 600px"
                onError={() => setFailed(true)}
              />
            ) : (
              <div className="project-fallback">
                <span className="fallback-caption">PROJECT COLLECTION</span>
                <span className="fallback-title">{project.name}</span>
                <span className="fallback-url">
                  {new URL(project.url).hostname}
                </span>
                <span className="fallback-note">
                  Visit the live project <Icon name="external" />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <span className="project-visit">
        <Icon name="external" />
      </span>
    </div>
  );
}
function Heading({
  label,
  title,
  copy,
  centered = false,
}: {
  label: string;
  title: React.ReactNode;
  copy?: string;
  centered?: boolean;
}) {
  return (
    <div
      className={`section-heading ${centered ? "centered" : ""}`}
      data-reveal
    >
      <span className="eyebrow">
        <span />
        {label}
      </span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}
export function Site() {
  const root = useRef<HTMLDivElement>(null);
  const { ambientPaused, toggleAmbient } = useSiteMotion(root);
  return (
    <div className="site-shell" ref={root}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" className="overflow-x-hidden w-full max-w-full">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <HeroAtmosphere />
          <div className="hero-content">
            <div className="hero-badge" data-hero>
              <span className="status-dot" />
              Digital solutions for modern businesses
            </div>
            <h1 id="hero-title" className="max-w-6xl" data-hero>
              Goodwork<span>.</span>
            </h1>
            <p className="service-line" data-hero>
              Websites <span>·</span> Software <span>·</span> AI Automation
            </p>
            <p className="hero-copy" data-hero>
              We build modern websites, custom web applications, and AI-powered
              automations that help businesses work smarter, move faster, and
              grow.
            </p>
            <div className="hero-actions" data-hero>
              <a className="button button-light" href="#contact">
                Start Your Project <Icon name="external" />
              </a>
              <a className="button button-outline" href="#work">
                Explore Our Work <Icon name="arrow" />
              </a>
            </div>
          </div>
          <Horizon />
          <div className="hero-bottom">
            <a
              href="#work"
              className="scroll-cue"
              aria-label="Scroll to featured work"
            >
              <span>Discover the work</span>
              <Icon name="down" />
            </a>
            <button
              className="motion-control"
              type="button"
              onClick={toggleAmbient}
              aria-pressed={ambientPaused}
              aria-label={
                ambientPaused
                  ? "Resume background motion"
                  : "Pause background motion"
              }
              title={
                ambientPaused
                  ? "Resume background motion"
                  : "Pause background motion"
              }
            >
              <Icon name={ambientPaused ? "play" : "pause"} />
            </button>
          </div>
        </section>

        <section
          className="section work-section"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-top">
            <Heading
              label="Featured Work"
              title={
                <>
                  <span id="work-title">Real Projects.</span>
                  <br />
                  <span className="muted-title">Thoughtful Solutions.</span>
                </>
              }
              copy="A selection of websites and applications built for different business needs."
            />
            <span className="section-aside">
              An idea, made real.
              <Icon name="external" />
            </span>
          </div>
          <div
            className="work-disciplines"
            aria-label="Portfolio disciplines"
            data-reveal
          >
            <span>
              <Icon name="window" />
              Websites
            </span>
            <span>
              <Icon name="code" />
              Web Applications
            </span>
            <a href="#automation">
              <Icon name="flow" />
              AI Automation
              <Icon name="arrow" />
            </a>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <a
                className={`project-card ${index < 2 ? "project-large" : ""}`}
                href={project.url}
                key={project.id}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.name} project (opens in a new tab)`}
              >
                <ProjectPreview project={project} />
                <div className="project-info">
                  <div className="project-category-row">
                    <span className="project-category">{project.category}</span>
                    <span className="project-kind">
                      {project.category.includes("Application")
                        ? "Web App"
                        : "Website"}
                    </span>
                  </div>
                  <div className="project-title-row">
                    <h3>{project.name}</h3>
                    <Icon name="external" />
                  </div>
                  <p>{project.description}</p>
                  <span className="project-link">
                    View Project <Icon name="arrow" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section
          className="section services-section"
          id="services"
          aria-labelledby="services-title"
        >
          <Heading
            label="What We Do"
            title={
              <span id="services-title">
                Digital solutions built
                <br />
                <span className="muted-title">around your business.</span>
              </span>
            }
            centered
          />
          <div className="services-grid">
            {services.map((service) => (
              <article className="service-card" key={service.name}>
                <div className="service-icon">
                  <Icon name={service.icon} />
                </div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <details className="service-details">
                  <summary>
                    {service.cta}
                    <Icon name="plus" />
                  </summary>
                  <ul>
                    {service.examples.map((example) => (
                      <li key={example}>
                        <Icon name="check" />
                        {example}
                      </li>
                    ))}
                  </ul>
                  <a href="#contact" className="text-link">
                    Let’s talk about your project
                    <Icon name="arrow" />
                  </a>
                </details>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section automation-section"
          id="automation"
          aria-labelledby="automation-title"
        >
          <div className="section-top">
            <Heading
              label="Practical AI"
              title={
                <span id="automation-title">
                  Automation
                  <br />
                  <span className="muted-title">in Practice.</span>
                </span>
              }
              copy="Exploring practical ways to reduce repetitive work and make business processes more efficient."
            />
            <p className="automation-note">
              A look at the thinking.
              <br />
              The possibilities. The next steps.
            </p>
          </div>
          <div className="automation-grid">
            {workflows.map((workflow) => (
              <article
                className="automation-card"
                key={workflow.name}
                data-reveal
              >
                <div className="automation-card-top">
                  <Icon name={workflow.icon} />
                  <span className="concept-tag">Workflow concept</span>
                </div>
                <h3>{workflow.name}</h3>
                <p>{workflow.description}</p>
                <div
                  className="workflow"
                  aria-label={`Intended workflow for ${workflow.name}`}
                >
                  <span className="workflow-label">Intended workflow</span>
                  <ol>
                    {workflow.steps.map((step, index) => (
                      <li key={step}>
                        <span className="workflow-node">
                          {index === 3 ? <Icon name="check" /> : <span />}
                        </span>
                        <span>{step}</span>
                        {index < 3 && (
                          <span
                            className="workflow-connector"
                            aria-hidden="true"
                          />
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="concept-note">
                  Concept only · Implementation and deployment unconfirmed
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section approach-section"
          aria-labelledby="approach-title"
        >
          <Heading
            label="Our Approach"
            title={
              <span id="approach-title">
                From business problem
                <br />
                <span className="muted-title">to working solution.</span>
              </span>
            }
            centered
          />
          <ol className="approach-grid">
            {approach.map(([title, copy], index) => (
              <li key={title}>
                <div className="step-line">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span className="step-rule" />
                </div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          className="section about-section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="about-intro" data-reveal>
            <span className="eyebrow">
              <span />
              Why Goodwork Digital
            </span>
            <h2 id="about-title">
              Built with purpose.
              <br />
              <span className="muted-title">Focused on results.</span>
            </h2>
            <p>
              We build digital solutions that help businesses work smarter, move
              faster, and grow.
            </p>
            <a className="text-link" href="#contact">
              Let’s build something useful
              <Icon name="arrow" />
            </a>
          </div>
          <div className="principles-grid">
            {principles.map(([title, copy]) => (
              <article className="principle" key={title} data-reveal>
                <Icon name="check" />
                <div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section contact-section"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="contact-intro" data-reveal>
            <span className="eyebrow">
              <span />
              Let’s Talk
            </span>
            <h2 id="contact-title">
              Have a project
              <br />
              <span className="muted-title">in mind?</span>
            </h2>
            <p>
              Tell us what you’re building, what you’d like to improve, or what
              you’d like to automate.
            </p>
            <span className="contact-detail">
              <span className="status-dot" />
              Your next good idea starts here.
            </span>
          </div>
          <div className="contact-panel" data-reveal>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="footer section">
        <div className="footer-top">
          <div>
            <a
              href="#home"
              className="logo-link"
              aria-label="Goodwork Digital home"
            >
              <Logo />
            </a>
            <p>Websites · Software · AI Automation</p>
          </div>
          <nav aria-label="Footer navigation">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="footer-projects">
            <span>Selected work</span>
            {projects.map((project) => (
              <a
                href={project.url}
                key={project.id}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.name}
                <Icon name="external" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          GOODWORK<span>.</span>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Goodwork Digital. All rights reserved.
          </span>
          <a href="#home">
            Back to top
            <Icon name="down" />
          </a>
        </div>
      </footer>
    </div>
  );
}
