import { Envelope, MapPin, Phone } from "@phosphor-icons/react";
import { cn } from "cn";

export type FooterLink = {
  label: string;
  href?: string;
  /** Renders a small "New" tag beside the link. */
  isNew?: boolean;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export type FooterProps = {
  platformName?: string;
  tagline?: string;
  sections?: FooterSection[];
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
    altEmail?: string;
  };
  copyright?: string;
  lastUpdated?: string;
  bottomLinks?: FooterLink[];
  className?: string;
};

const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: "About us",
    links: [
      { label: "About platform", isNew: true },
      { label: "Departments" },
      { label: "Who's who" },
      { label: "Directorates/Commissionerates" },
      { label: "State Award" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Service 1" },
      { label: "Service 2" },
      { label: "Service 3" },
      { label: "Service 4" },
      { label: "Service 5" },
    ],
  },
  {
    title: "Schemes",
    links: [
      { label: "Scheme 1" },
      { label: "Scheme 2" },
      { label: "Scheme 3" },
      { label: "Scheme 4" },
      { label: "Scheme 5" },
    ],
  },
  {
    title: "Useful links",
    links: [
      { label: "RTI" },
      { label: "MOM & Guidelines" },
      { label: "SC/ST Cell" },
      { label: "Monthly Achievement" },
      { label: "Guidelines" },
    ],
  },
  {
    title: "Company Info",
    links: [
      { label: "Brand Guidelines" },
      { label: "Careers" },
      { label: "Investors" },
      { label: "About Us" },
      { label: "Community" },
    ],
  },
];

const DEFAULT_BOTTOM_LINKS: FooterLink[] = [
  { label: "Feedback" },
  { label: "FAQs" },
  { label: "Terms & Conditions" },
  { label: "Privacy policy" },
];

/** Pill-shaped link used inside the footer's link columns. */
function FooterLinkItem({ link }: { link: FooterLink }) {
  return (
    <li>
      <a
        href={link.href ?? "#"}
        className={cn(
          "group inline-flex items-center gap-2",
          "font-[Raleway,var(--font-family-sans)] text-[13px] text-(--color-brand-primary) leading-6 tracking-[0.5px]",
          "underline-offset-2 hover:underline",
          "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
        )}
      >
        {link.label}
        {link.isNew ? (
          <span className="rounded-[4px] border border-(--color-border-accent) px-2 py-[4px] font-medium text-[12px] leading-4">
            New
          </span>
        ) : null}
      </a>
    </li>
  );
}

export function Footer({
  platformName = "Title",
  tagline = "Description or tagline about the department, platform or organization",
  sections = DEFAULT_SECTIONS,
  contact = {
    address: "Write address here",
    phone: "00000-00000",
    email: "support@department.com",
    altEmail: "support-fpi@nic.in",
  },
  copyright = "© 2022 - Copyright UX4G. All rights reserved. Powered by NeGD | MeitY Government of India®2022 UX4G",
  lastUpdated = "Last updated: 12-09-23",
  bottomLinks = DEFAULT_BOTTOM_LINKS,
  className,
}: FooterProps) {
  return (
    <footer className={cn("w-full bg-(--color-surface-default)", className)}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-8 pt-16 max-lg:pt-10 max-sm:px-4">
        {/* Brand + contact */}
        <div className="flex flex-col gap-8">
          <div className="flex gap-6 max-lg:flex-col">
            <div className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-bold text-[16px] text-(--color-text-primary) leading-[22px]">
                  {platformName}
                </span>
                <p className="max-w-[540px] text-[12px] text-(--color-text-secondary) leading-[18px]">
                  {tagline}
                </p>
              </div>

              <span className="w-fit rounded-full bg-(--color-brand-primary-surface) px-4 py-2 font-medium text-[11px] text-(--color-text-secondary) leading-[14px]">
                {lastUpdated}
              </span>
            </div>

            <address className="flex w-[375px] flex-col gap-4 not-italic max-lg:w-full">
              <span className="font-bold text-[16px] text-(--color-text-primary) leading-5">
                Contact Us
              </span>

              <div className="flex items-start gap-2 text-[12px] text-(--color-text-secondary) leading-[18px]">
                <MapPin
                  aria-hidden
                  className="mt-0.5 shrink-0 text-(--color-text-muted)"
                  size={16}
                />
                {contact.address}
              </div>

              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 text-[12px] text-(--color-text-secondary) leading-[18px] hover:underline"
              >
                <Phone aria-hidden className="shrink-0 text-(--color-text-muted)" size={16} />
                {contact.phone}
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 text-[12px] text-(--color-text-secondary) leading-[18px] hover:underline"
              >
                <Envelope aria-hidden className="shrink-0 text-(--color-text-muted)" size={16} />
                {contact.email}
              </a>
            </address>
          </div>

          <div aria-hidden className="h-px w-full bg-(--color-border-default)" />
        </div>

        {/* Link columns */}
        <nav
          aria-label="Footer"
          className="grid grid-cols-5 gap-8 max-[1100px]:grid-cols-3 max-sm:grid-cols-2"
        >
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h2 className="font-bold text-[14px] text-(--color-text-primary) leading-[18px]">
                {section.title}
              </h2>
              <ul className="flex list-none flex-col gap-4 p-0">
                {section.links.map((link) => (
                  <FooterLinkItem key={link.label} link={link} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom strip */}
      <div className="mt-16 w-full bg-(--color-surface-inverse) max-lg:mt-10">
        <div
          className={cn(
            "mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-8 py-4",
            "max-lg:flex-col max-lg:items-start max-lg:px-8 max-sm:px-4",
          )}
        >
          <p className="m-0 text-[11px] text-(--color-text-on-dark-subtle) leading-[14px]">
            {copyright}
          </p>

          <ul className="flex list-none items-center gap-8 p-0 max-sm:flex-wrap max-sm:gap-4">
            {bottomLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href ?? "#"}
                  className="text-[11px] text-(--color-text-on-dark-subtle) leading-[14px] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
