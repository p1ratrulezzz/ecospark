import Navigation from "@/components/navigation";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <Hero />
      <Mission />
      <ContactForm />
      <Footer />
    </div>
  );
}
