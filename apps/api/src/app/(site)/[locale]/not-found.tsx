import Link from "next/link";

export default function SiteNotFound() {
  return (
    <section className="section" aria-labelledby="not-found-heading">
      <div className="container dn-container--narrow">
        <p className="dn-section-kicker">404</p>
        <h1 id="not-found-heading">Page not found · पृष्ठ भेटिएन</h1>
        <p className="hero__lead">
          That address does not exist on this portal, or the profile is not public.
          <br />
          यो ठेगाना यो पोर्टलमा छैन, वा प्रोफाइल सार्वजनिक छैन।
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" href="/en">
            Home · गृहपृष्ठ
          </Link>
          <Link className="btn" href="/en/members">
            Members · सदस्यहरू
          </Link>
        </div>
      </div>
    </section>
  );
}
