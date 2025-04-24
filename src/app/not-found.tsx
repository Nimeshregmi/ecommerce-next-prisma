import Link from "next/link";
import React from "react";
import Image from "next/image";

interface Props {
  content?: string;
}

const NotFound = ({ content }: Props) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16 relative overflow-hidden">
      {/* Floating geometric shapes for modern aesthetic */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-destructive/3 rounded-full blur-3xl" style={{ animationDuration: '15s' }} />
      
      <div className="max-w-xl w-full text-center space-y-8 relative z-10 backdrop-blur-sm bg-background/30 p-8 rounded-xl border border-border/40">
        {/* 404 Number with animation */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-black text-primary/10 leading-none tracking-tighter">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Page Not Found
            </h2>
          </div>
        </div>

        {/* Animated illustration */}
        <div className="flex justify-center">
          <div className="relative  mb-6 transition-all hover:scale-105 duration-500">
            <Image 
              src="/file.svg"
              alt="404 illustration"
              height={100} width={100}
              className="object-contain opacity-80 hover:opacity-100"
              style={{ 
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))'
              }}
            />
          </div>
        </div>

        {/* Custom message if provided */}
        {content && (
          <p className="text-lg text-muted-foreground">{content}</p>
        )}

        {/* Default message if no content provided */}
        {!content && (
          <p className="text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        )}

        {/* Back to home button with hover effect */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="group px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 transform transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
        
        {/* Extra option to report broken link */}
        <div className="mt-4 text-sm text-muted-foreground/70">
          <span>Think this is a mistake? </span>
          <Link href="/contact" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Let us know
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
