import React from 'react'
import HomeNavbar from '@/components/home/home-navbar';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavbar />

      <div className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-center mb-8">
            Welcome to SaaS

          </h1>
          <p className="text-center text-gray-600 mb-8">
            Your SaaS platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;