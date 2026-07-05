import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">
              AuraWear X
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Enterprise Fashion Commerce Platform with Virtual Try-On Experience
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-secondary text-primary px-6 py-3 rounded-lg font-bold hover:bg-yellow-500 transition flex items-center space-x-2"
              >
                <span>Shop Now</span>
                <ArrowRight size={20} />
              </Link>
              <Link
                to="/style-quiz"
                className="border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-bold hover:bg-secondary hover:text-primary transition"
              >
                Take Style Quiz
              </Link>
              <Link
                to="/lookbook"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition"
              >
                View Lookbook
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Featured Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
              <Sparkles className="text-secondary mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Virtual Try-On</h3>
              <p className="text-gray-600">
                Experience clothes with our 2D AR technology
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
              <span className="text-3xl">🎯</span>
              <h3 className="text-xl font-bold mb-2 mt-4">Style Quiz</h3>
              <p className="text-gray-600">
                Get personalized style recommendations
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
              <span className="text-3xl">👗</span>
              <h3 className="text-xl font-bold mb-2 mt-4">Outfit Builder</h3>
              <p className="text-gray-600">
                Create and save complete outfits
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition">
              <span className="text-3xl">📸</span>
              <h3 className="text-xl font-bold mb-2 mt-4">Lookbook</h3>
              <p className="text-gray-600">
                Get fashion inspiration from curated looks
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose AuraWear X?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Curated Collections</h3>
                <p className="text-gray-600">Hand-picked fashion from top designers</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Easy Returns</h3>
                <p className="text-gray-600">Hassle-free returns within 30 days</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Expert Support</h3>
                <p className="text-gray-600">24/7 customer support team</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Exclusive Deals</h3>
                <p className="text-gray-600">Member-only discounts and early access</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
