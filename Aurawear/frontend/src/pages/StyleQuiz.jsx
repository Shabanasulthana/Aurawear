import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function StyleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const questions = [
    {
      question: "What's your personal style?",
      answers: ["Classic", "Trendy", "Bohemian", "Edgy", "Minimalist"]
    },
    {
      question: "What's your lifestyle?",
      answers: ["Office Professional", "Creative", "Active/Sporty", "Social Butterfly", "Homebody"]
    },
    {
      question: "Favorite color palette?",
      answers: ["Neutrals (Black, White, Gray)", "Pastels", "Jewel Tones", "Warm Colors", "Bold & Bright"]
    },
    {
      question: "Preferred fit?",
      answers: ["Fitted", "Oversized", "Bodycon", "Flowy", "Mix of Both"]
    },
    {
      question: "Budget preference?",
      answers: ["Budget", "Mid-Range", "Premium", "Luxury", "No Preference"]
    },
    {
      question: "When do you shop?",
      answers: ["Everyday Basics", "Weekend Outings", "Party/Special Events", "Work Attire", "All Occasions"]
    }
  ];

  const styleRecommendations = {
    "Classic,Office Professional,Neutrals (Black, White, Gray),Fitted,Mid-Range,Work Attire": {
      style: "Professional Classic",
      description: "You prefer timeless, sophisticated pieces perfect for the office.",
      recommended_categories: ["Blouses", "Pencil Skirts", "Jeans", "Professional Dresses"]
    },
    "Trendy,Creative,Bold & Bright,Bodycon,Mid-Range,Party/Special Events": {
      style: "Trendy Party Girl",
      description: "You love staying current with fashion trends for night outs.",
      recommended_categories: ["Party Dresses", "Crop Tops", "Sequin Tops", "Leather Pants"]
    },
    "Bohemian,Creative,Warm Colors,Flowy,Mid-Range,All Occasions": {
      style: "Free Spirit Boho",
      description: "You embrace freedom and self-expression through fashion.",
      recommended_categories: ["Bohemian Maxi Dress", "Flowy Pants", "Silk Camisole"]
    },
    "Edgy,Creative,Bold & Bright,Fitted,Mid-Range,All Occasions": {
      style: "Bold & Edgy",
      description: "You make a statement with your fashion choices.",
      recommended_categories: ["Leather Jacket", "Leather Pants", "Sequin Top", "Bodycon Dress"]
    },
    "Minimalist,Homebody,Neutrals (Black, White, Gray),Oversized,Budget,Everyday Basics": {
      style: "Cozy Minimalist",
      description: "You prefer comfortable, simple pieces for everyday wear.",
      recommended_categories: ["T-Shirts", "Oversized Sweatshirt", "Jeans", "Flowy Pants"]
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    setLoading(true);
    
    // Get top 3 answers for personalization
    const answerString = Object.values(finalAnswers).slice(0, 5).join(",");
    
    // Find matching style
    const matchedStyle = Object.entries(styleRecommendations).find(([key]) => {
      const keyAnswers = key.split(",");
      const matchCount = keyAnswers.filter(answer => answerString.includes(answer)).length;
      return matchCount >= 3;
    });

    const styleResult = matchedStyle 
      ? styleRecommendations[matchedStyle[0]]
      : {
        style: "Versatile Explorer",
        description: "You appreciate diverse styles and aren't confined to one aesthetic.",
        recommended_categories: ["Dresses", "Tops", "Bottoms", "Outerwear"]
      };

    setTimeout(() => {
      setResults({
        style: styleResult.style,
        description: styleResult.description,
        categories: styleResult.recommended_categories,
        answers: finalAnswers
      });
      setLoading(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResults(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader size={40} className="animate-spin text-secondary mx-auto mb-4" />
          <p className="text-xl font-bold">Analyzing Your Style...</p>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-secondary to-yellow-500 text-primary rounded-lg p-12 text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Your Style Profile</h1>
            <h2 className="text-3xl font-bold mb-4">{results.style}</h2>
            <p className="text-lg mb-8">{results.description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Recommended For You</h3>
            <p className="text-gray-600 mb-6">
              Based on your answers, we recommend exploring these categories:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {results.categories.map((category, idx) => (
                <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-secondary">
                  <h4 className="font-bold text-lg text-primary mb-2">{category}</h4>
                  <button
                    onClick={() => navigate(`/products?category=${category}`)}
                    className="text-secondary font-bold hover:underline flex items-center space-x-2"
                  >
                    <span>Shop Now</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={resetQuiz}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
            >
              Retake Quiz
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold mb-4">💡 Style Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Mix and match recommended categories to create unique outfits</li>
              <li>• Try our Virtual Try-On feature to see items on yourself</li>
              <li>• Check the Lookbook for styling inspiration</li>
              <li>• Use the Outfit Builder to save your favorite combinations</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">Discover Your Style</h1>
          <p className="text-center text-gray-600 text-lg">
            Answer a few questions and get personalized fashion recommendations!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center text-primary">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(answer)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-left font-bold text-lg hover:border-secondary hover:bg-yellow-50 transition duration-200"
              >
                {answer}
              </button>
            ))}
          </div>

          <div className="mt-8 text-center text-gray-600 text-sm">
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="text-secondary hover:underline"
              >
                ← Previous Question
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
