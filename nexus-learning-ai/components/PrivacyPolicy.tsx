import React from 'react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-white rounded-2xl shadow-sm border border-slate-100 my-8 animate-fade-in-up">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="prose prose-slate max-w-none">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy & Terms</h1>
        <p className="text-slate-500 mb-8 font-mono text-sm">Last Updated: 5-Jan-2026</p>

        <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">1. Privacy Policy</h2>
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed">
                At <strong>Nexus Learning Architect</strong>, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mb-3">1. Information We Collect</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-blue-500">
                <li><strong>Account Information:</strong> When you sign in via Google or Email, we collect your name, email address, and profile picture.</li>
                <li><strong>Usage Data:</strong> We collect information on how you interact with the AI tools, including prompt history and educational materials generated.</li>
                <li><strong>Technical Data:</strong> We automatically collect log data such as your IP address, browser type, and device information to ensure the app functions correctly.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-blue-500">
                <li>To provide and maintain the service.</li>
                <li>To personalize your learning experience using AI.</li>
                <li>To communicate with you regarding updates or support.</li>
                <li>To prevent fraud and ensure account security.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mb-3">3. Data Storage & Security</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-blue-500">
                <li><strong>Authentication & Database:</strong> We use Supabase to securely store user data and authentication credentials.</li>
                <li><strong>Hosting:</strong> Our application is hosted by Vercel.</li>
                <li><strong>AI Processing:</strong> Data may be processed through third-party AI models (e.g., Google Gemini) to generate learning content. We do not sell your personal data to these providers.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mb-3">4. Your Rights</h3>
            <p className="text-slate-600 mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-blue-500">
                <li>Access the personal data we hold about you.</li>
                <li>Request the deletion of your account and associated data.</li>
                <li>Opt-out of non-essential data collection.</li>
            </ul>
        </section>

        <section className="pt-8 border-t border-slate-200">
             <div className="flex items-center gap-3 mb-6 p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                    <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 m-0">2. Terms of Service</h2>
            </div>
            
            <p className="text-slate-500 mb-4 font-mono text-sm">Last Updated: 5-Jan-2026</p>
            <p className="text-slate-600 mb-6">By accessing Nexus Learning Architect, you agree to be bound by these Terms of Service.</p>

            <h3 className="text-lg font-bold text-slate-900 mb-3">1. Use of Service</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-purple-500">
                <li>You must be at least 13 years old (or the minimum age of digital consent in your country) to use this platform.</li>
                <li>You are responsible for maintaining the confidentiality of your account.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mb-3">2. AI-Generated Content</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-purple-500">
                <li><strong>Accuracy:</strong> The content generated by our AI is for educational purposes. While we strive for accuracy, AI can produce "hallucinations" or incorrect information. Always verify critical facts.</li>
                <li><strong>Ownership:</strong> You retain ownership of the prompts you provide. We grant you a non-exclusive right to use the AI-generated output for personal or educational use.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mb-3">3. Prohibited Conduct</h3>
            <p className="text-slate-600 mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6 marker:text-purple-500">
                <li>Use the app for any illegal purposes or to generate harmful/hateful content.</li>
                <li>Attempt to reverse-engineer or "jailbreak" the AI systems.</li>
                <li>Scrape data from the platform without authorization.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 mb-3">4. Limitation of Liability</h3>
            <p className="text-slate-600 mb-6">
                Nexus Learning Architect is provided "as is" without warranties of any kind. We are not liable for any damages resulting from your use of the app, including errors in AI-generated content or service interruptions.
            </p>

            <h3 className="text-lg font-bold text-slate-900 mb-3">5. Termination</h3>
            <p className="text-slate-600 mb-6">
                We reserve the right to suspend or terminate your access to the service at our discretion, without notice, for conduct that violates these Terms.
            </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
