import { heroAssets, site } from "~/content/site";
import "./hero-section.css";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <p className="hero__tagline display-title">{site.tagline}</p>

      <h1 id="hero-title" className="hero__title display-title">
        {site.name}
      </h1>

      <div className="hero__collage" aria-hidden="true">
        <div className="hero__grid">
          <img
            className="hero__item hero__item--circle"
            src={heroAssets.circle}
            alt=""
            width={274}
            height={274}
          />
          <img
            className="hero__item hero__item--photo"
            src={heroAssets.photo}
            alt=""
            width={327}
            height={435}
          />
          <img
            className="hero__item hero__item--laptop hero__item--animate"
            src={heroAssets.laptop}
            alt=""
            width={47}
            height={67}
          />
          <img
            className="hero__item hero__item--coffee-top hero__item--animate hero__item--animate-delay-1"
            src={heroAssets.coffee}
            alt=""
            width={56}
            height={51}
          />
          <img
            className="hero__item hero__item--folder hero__item--animate hero__item--animate-delay-2"
            src={heroAssets.folder}
            alt=""
            width={139}
            height={139}
          />
          <img
            className="hero__item hero__item--wrench hero__item--animate hero__item--animate-drift hero__item--animate-delay-3"
            src={heroAssets.wrench}
            alt=""
            width={92}
            height={130}
          />
          <img
            className="hero__item hero__item--scrunchie-left hero__item--animate hero__item--animate-delay-2"
            src={heroAssets.scrunchie}
            alt=""
            width={145}
            height={145}
          />
          <img
            className="hero__item hero__item--coffee-bottom hero__item--animate hero__item--animate-delay-4"
            src={heroAssets.coffee}
            alt=""
            width={56}
            height={51}
          />
          <img
            className="hero__item hero__item--scrunchie-right hero__item--animate hero__item--animate-delay-1"
            src={heroAssets.scrunchie}
            alt=""
            width={100}
            height={100}
          />
          <img
            className="hero__item hero__item--star hero__item--animate hero__item--animate-delay-3"
            src={heroAssets.star}
            alt=""
            width={56}
            height={51}
          />
          <p className="hero__note">laptop</p>
        </div>
      </div>

      <p className="hero__bio">{site.bio}</p>

      <a href={site.cta.href} className="hero__cta">
        {site.cta.label}
        <img
          className="hero__cta-arrow"
          src={heroAssets.ctaArrow}
          alt=""
          width={30}
          height={20}
        />
      </a>
    </section>
  );
}
