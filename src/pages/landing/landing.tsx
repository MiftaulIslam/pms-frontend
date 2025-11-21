// import { dummyUser } from '@/dummy-data/models/dummy-user-model';
import Features from '@/pages/landing/components/features';
import Footer from '@/pages/landing/components/footer';
import Header from '@/pages/landing/components/header';
import Hero from '@/pages/landing/components/hero';
import { useEffect } from 'react';
import * as lucide from "lucide-react"
console.log(lucide.icons.Caravan.displayName)

const dummyUser = {
    id: '3f29b8a2-6c1d-4d9b-bf4c-9a2f1d5c7e3a',
    new: true,
    profile: {
        name: 'John Doe',
        email: 'EMAIL',
        phone: '1234567890',
        address: '123 Main St',
        image: 'https://biographybd.com/wp-content/uploads/2015/11/Anisur-Rahman-Milon.gif',
        gender: 'male'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}
const Landing = () => {
    useEffect(() => {
        const existingUser = localStorage.getItem('user')
        if (!existingUser) {
            localStorage.setItem('user', JSON.stringify(dummyUser))
        }
    }, [])
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
