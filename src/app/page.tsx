import HeroSplit from "@/components/hero-split";
import ProjectCarousel from "@/components/project-carousel";
import { fetchFeaturedRepos } from "@/lib/github";
import ContactForm from "@/components/contact-form";
import PageBg from "@/components/page-bg";
import Reveal from "@/components/reveal";
import AboutCard from "@/components/about-card";
import Link from "next/link";

export default async function HomePage() {  
  const featured = await fetchFeaturedRepos("jan-elia-24");  

  return (
    <>
      <PageBg src="/bg/home.jpg" dim={0.55} />
      
      <main id="main"> 
        <HeroSplit />

        <section className="mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <h2 className="text-2xl font-semibold mb-6">Featured Projects</h2>
          </Reveal>
          <Reveal>
            <ProjectCarousel items={featured} />
          </Reveal>
          <Reveal>
            <div className="flex justify-center mt-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/15 text-sm font-medium text-neutral-300 transition-all duration-200 hover:border-white/40 hover:bg-white/5 hover:text-white active:scale-95"
              >
                View all projects →
              </Link>
            </div>
          </Reveal>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p className="mt-2 text-neutral-300">
            Want to collaborate or have a question? Send me a message.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </main>
    </>
  );
}