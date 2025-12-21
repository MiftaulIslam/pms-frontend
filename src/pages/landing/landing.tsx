import Features from '@/pages/landing/components/features';
import Footer from '@/pages/landing/components/footer';
import Header from '@/pages/landing/components/header';
import Hero from '@/pages/landing/components/hero';

const Landing = () => {
    return (
        <div className="bg-background min-h-screen">
            <Header />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}

export default Landing
