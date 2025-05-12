import { useState, useEffect } from "react";
import {
  ChevronRight,
  Building2,
  Briefcase,
  Users,
  CheckCircle,
  Play,
  ChevronLeft,
  ArrowRight,
  Menu,
  X,
  Coins,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const screenshots = [
    {
      title: "Company Management",
      description: "Manage all your companies in one place",
      image: "/compny.png",
    },
    {
      title: "Jobs Management",
      description: "Manage your entire job directory in one place",
      image: "/Jobs.png",
    },
    {
      title: "Candidate Tracking",
      description: "Track all your candidates in one place",
      image: "/Candidate.jpeg",
    },
    {
      title: "AI Interview",
      description: "AI Interview",
      image: "/interview.png",
    },
  ];

  const productCards = [
    {
      id: 0,
      title: "Company Directory",
      description:
        "Organize and manage all your companies in one place with detailed profiles and tracking.",
      icon: Building2,
      color: "primary",
    },
    {
      id: 1,
      title: "Job Management",
      description:
        "Post and manage job openings with ease. Track applications and manage your hiring pipeline efficiently.",
      icon: Briefcase,
      color: "primary",
    },
    {
      id: 2,
      title: "Candidate Tracking",
      description:
        "Streamline your candidate management process. Organize profiles, schedule interviews, and collaborate with teams.",
      icon: Users,
      color: "primary",
    },
    {
      id: 3,
      title: "AI Interview",
      description:
        "Streamline your candidate management process. Organize profiles, schedule interviews, and collaborate with teams.",
      icon: Bot,
      color: "primary",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextScreenshot();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentScreenshot]);

  // Handle navigation
  const handlePrevScreenshot = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreenshot((prev) =>
        prev === 0 ? screenshots.length - 1 : prev - 1
      );
      setActiveCard((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
      setIsTransitioning(false);
    }, 300);
  };

  const handleNextScreenshot = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
      setActiveCard((prev) => (prev + 1) % screenshots.length);
      setIsTransitioning(false);
    }, 300);
  };

  // Handle card click
  const handleCardClick = (cardId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreenshot(cardId);
      setActiveCard(cardId);
      setIsTransitioning(false);
    }, 300);
  };

  // Scroll to section functionality
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b border-border py-4 sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <h1 className="text-lg font-bold tracking-tight">
                <span className="text-foreground">Talee</span>
                <span className="text-primary">X</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ThemeToggle />
            <button
              onClick={() => scrollToSection("products")}
              className="text-muted-foreground hover:text-foreground"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-muted-foreground hover:text-foreground"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground"
            >
              Pricing
            </button>
            <Link to={"/auth"}>
              <Button>Get Started</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background py-4 px-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("products")}
                className="text-muted-foreground hover:text-foreground py-2"
              >
                Products
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-muted-foreground hover:text-foreground py-2"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-muted-foreground hover:text-foreground py-2"
              >
                Pricing
              </button>
              <Button className="w-full">Get Started</Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm text-primary font-medium flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Discover TaleeX
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Streamline Your{" "}
                <span className="text-primary">Recruitment</span> Process
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Manage companies and jobs in one powerful platform designed for
                modern recruitment teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg flex items-center"
                  onClick={() => scrollToSection("demo-video")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-10">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="/statics.jpeg"
                  alt="TaleeX platform"
                  className="w-full h-auto rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Demo Video Section */}
      <section id="demo-video" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-sm text-primary font-medium">Demo</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">See TaleeX in Action</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Watch our demo to see how TaleeX can transform your recruitment
                process
              </p>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <div className="relative" style={{ paddingBottom: "56.25%" }}>
                {" "}
                {/* 16:9 Aspect Ratio */}
                <div className="absolute inset-0 bg-muted">
                  {/* Video placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-24 h-24 rounded-full bg-primary/80 flex items-center justify-center cursor-pointer hover:bg-primary transition-all hover:scale-105">
                      <Play className="h-10 w-10 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <img
                    src="/Untitled.png"
                    alt="TaleeX platform demo"
                    className="w-full h-full object-cover opacity-50"
                  />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-white text-xl font-bold">
                  See how TaleeX transforms your recruitment process
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Screenshots Combined Section */}
      <section id="products" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm text-primary font-medium">Products</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              All-in-One Recruitment Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your hiring process
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Side: Product Cards */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {productCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group ${
                      activeCard === card.id
                        ? `border-primary shadow-md scale-[1.02]`
                        : "border-border"
                    }`}
                  >
                    <div className="flex p-4">
                      <div
                        className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors mr-4`}
                      >
                        <card.icon className={`h-6 w-6 text-primary`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-card-foreground">
                            {card.title}
                          </h3>
                          <ArrowRight
                            className={`h-5 w-5 text-primary group-hover:translate-x-1 transition-transform duration-300 ${
                              activeCard === card.id ? "translate-x-1" : ""
                            }`}
                          />
                        </div>
                        <p className="text-muted-foreground text-sm mt-2">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Screenshot Carousel */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl overflow-hidden border border-border shadow-lg">
                {/* Top Navigation */}
                <div className="border-b border-border px-4 py-3 bg-muted flex items-center justify-between">
                  <div className="flex space-x-4 items-center">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      TaleeX - {screenshots[currentScreenshot].title}
                    </div>
                  </div>

                  {/* Progress Indicator */}
                  <div className="hidden md:flex items-center space-x-1">
                    {screenshots.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setCurrentScreenshot(index);
                            setActiveCard(index);
                            setIsTransitioning(false);
                          }, 300);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          currentScreenshot === index
                            ? "bg-primary w-8"
                            : "bg-muted-foreground/30 w-4"
                        }`}
                        aria-label={`View screenshot ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Screenshot Content */}
                <div className="relative">
                  <div
                    className={`transition-opacity duration-300 ${
                      isTransitioning ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ height: "500px", overflow: "hidden" }}
                  >
                    <img
                      src={
                        screenshots[currentScreenshot].image ||
                        "/placeholder.svg"
                      }
                      alt={screenshots[currentScreenshot].title}
                      className="w-full h-auto object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                      <h3 className="text-white text-xl font-bold">
                        {screenshots[currentScreenshot].title}
                      </h3>
                      <p className="text-white text-opacity-80">
                        {screenshots[currentScreenshot].description}
                      </p>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevScreenshot}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg transition-all hover:scale-110"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="h-6 w-6 text-foreground" />
                  </button>

                  <button
                    onClick={handleNextScreenshot}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-2 shadow-lg transition-all hover:scale-110"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="h-6 w-6 text-foreground" />
                  </button>
                </div>
              </div>

              {/* Mobile Progress Indicator */}
              <div className="flex justify-center mt-4 md:hidden space-x-1">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setCurrentScreenshot(index);
                        setActiveCard(index);
                        setIsTransitioning(false);
                      }, 300);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      currentScreenshot === index
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30 w-4"
                    }`}
                    aria-label={`View screenshot ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm text-primary font-medium">
                How It Works
              </span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Simple Process, Powerful Results
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started with TaleeX in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Create Your Account
              </h3>
              <p className="text-muted-foreground">
                Sign up for free and set up your organization profile
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Companies</h3>
              <p className="text-muted-foreground">
                Build your company directory with detailed profiles
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl shadow-md text-center border border-border hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Post Jobs</h3>
              <p className="text-muted-foreground">
                Create job listings and start managing applications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm text-primary font-medium">Pricing</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for your recruitment needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-xl border border-border shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">Basic Token Pack</h3>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">$9.99</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-md text-center mx-4 my-5">
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">10000</span>
                  <Coins className="h-5 w-5 ml-2 text-primary" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Use tokens for any service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>No expiration date</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border-2 border-primary shadow-lg relative hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 left-0">
                <div className="bg-primary text-primary-foreground text-xs font-medium py-1 text-center rounded-t-lg">
                  MOST POPULAR
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 pt-4">
                Advanced Token Pack
              </h3>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">$19.99</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-md text-center mx-4 my-5">
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">25000</span>
                  <Coins className="h-5 w-5 ml-2 text-primary" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Use tokens for any service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>No expiration date</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Priority support</span>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2">Premium Token Pack</h3>
              <div className="mt-4 mb-2">
                <span className="text-3xl font-bold">$29.99</span>
              </div>
              <div className="bg-primary/10 p-3 rounded-md text-center mx-4 my-5">
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">40000</span>
                  <Coins className="h-5 w-5 ml-2 text-primary" />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Use tokens for any service</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Advanced reporting</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span>Premium support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Usage Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">How Tokens Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Use tokens for various services across our platform
            </p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
              <div className="bg-card p-4 rounded-xl border border-border shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">CV Review</h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center">
                    <span className="text-sm font-medium mr-1">40</span>
                    <Coins className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Token cost for CV Review service.
                </p>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Final Evaluation</h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center">
                    <span className="text-sm font-medium mr-1">60</span>
                    <Coins className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Token cost for Final Evaluation service.
                </p>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">AI Interview</h3>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded flex items-center">
                    <span className="text-sm font-medium mr-1">100</span>
                    <Coins className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Token cost for AI Interview service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Transform Your Recruitment Process?
            </h2>
            <div className="p-4 mb-8 inline-block">
              <div className="flex items-center justify-center">
                <Coins className="h-6 w-6 mr-2 text-yellow-300" />
                <span className="text-xl font-bold text-white">
                  Join us now and get 1000 tokens for free!
                </span>
              </div>
            </div>
            <br />
            <Link to="/">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 text-lg py-6 px-8">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="mr-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center text-white font-bold">
                  T
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  <h1 className="text-lg font-bold tracking-tight">
                    <span className="text-foreground">Talee</span>
                    <span className="text-primary">X</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>Integrations</li>
                <li>Updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Partners</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Blog</li>
                <li>Help Center</li>
                <li>Guides</li>
                <li>Webinars</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy</li>
                <li>Terms</li>
                <li>Security</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} TaleeX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
