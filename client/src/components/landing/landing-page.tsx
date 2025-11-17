import React from 'react'
import HomeNavbar from '@/components/landing/home-navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Zap, Shield, Sparkles, Brain, Lock } from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HomeNavbar />

      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles size={16} />
              <span>Powered by Gemini API and Vercel AI SDK</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Your Intelligent
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the power of conversational AI. Get instant answers, creative solutions, 
              and intelligent assistance for all your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Lynx AI?
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need for intelligent conversations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="text-blue-600" size={24} />
                </div>
                <CardTitle>Natural Conversations</CardTitle>
                <CardDescription>
                  Chat naturally with our AI that understands context and provides meaningful responses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="text-purple-600" size={24} />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Get instant responses powered by cutting-edge AI technology for seamless interactions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-green-600" size={24} />
                </div>
                <CardTitle>Smart Memory</CardTitle>
                <CardDescription>
                  Our AI remembers your conversation history for more personalized and contextual assistance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-orange-600" size={24} />
                </div>
                <CardTitle>Reliable & Accurate</CardTitle>
                <CardDescription>
                  Trust in responses backed by advanced models trained on vast knowledge bases
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-indigo-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="text-indigo-600" size={24} />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your conversations are encrypted and protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="text-pink-600" size={24} />
                </div>
                <CardTitle>Multi-Purpose</CardTitle>
                <CardDescription>
                  From coding help to creative writing, get assistance with any task or question
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-blue-50 max-w-2xl mx-auto">
                Join thousands of users who are already experiencing the future of AI-powered conversations.
              </p>
              <Link href="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                  Start Chatting Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Lynx AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;