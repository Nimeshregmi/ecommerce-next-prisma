import React from 'react';
import { Metadata } from "next";
import { PasswordForm } from "@/components/account/password-form";
import { LockKeyhole } from "lucide-react";

export const metadata: Metadata = {
  title: "Change Password | Your Account",
  description: "Update your password to keep your account secure",
};

const ChangePasswordPage = () => {
  return (
    <div className="bg-background min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-lg mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <LockKeyhole className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Change Your Password</h1>
          <p className="text-muted-foreground">
            Keep your account secure with a strong password
          </p>
        </div>
        
        {/* Divider with gradient */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"></div>
          </div>
        </div>
        
        {/* Password Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <PasswordForm />
        </div>
        
        {/* Security Tips */}
        <div className="mt-8 bg-muted/40 rounded-lg p-5 border border-border">
          <h3 className="text-foreground font-medium mb-3">Password Security Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              Use a unique password that you don't use elsewhere
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              Include uppercase and lowercase letters, numbers, and symbols
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              Avoid using easily guessable information like your name or birthdate
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-primary">•</span>
              Consider using a password manager to generate and store strong passwords
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;