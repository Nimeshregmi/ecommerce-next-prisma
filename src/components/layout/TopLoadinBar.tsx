"use client";
import React from "react";
import NextTopLoader from "nextjs-toploader";

const TopLoadingBar = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NextTopLoader
        color="#008000"
        initialPosition={0.08}
        crawlSpeed={200}
        height={5}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={500}
      />
      {children}
    </>
  );
};

export default TopLoadingBar;