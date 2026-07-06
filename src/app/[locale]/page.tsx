import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/i18n/dictionaries";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Journey from "@/components/Journey";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <main className="flex-1">
      <Nav locale={locale} dict={dict} />
      <Hero locale={locale} dict={dict} />
      <About dict={dict} />
      <Projects dict={dict} />
      <Skills dict={dict} />
      <Journey dict={dict} />
      <Contact dict={dict} />
      <Footer dict={dict} />
    </main>
  );
}
