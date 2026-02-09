import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0f1012] text-gray-300 font-sans selection:bg-blurple selection:text-white">
            <div className="container mx-auto px-6 py-24 max-w-4xl">
                <Link href="/" className="inline-flex items-center text-blurple hover:text-white transition-colors mb-8">
                    ← Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-8">Terms of Service</h1>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By installing and using the Disvoice library, you agree to comply with and be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use the library.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. License</h2>
                        <p>
                            Disvoice is open-source software licensed under the MIT License. You are free to use, modify, and distribute the software
                            in accordance with the license terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Usage Restrictions</h2>
                        <p>
                            You agree not to use Disvoice for any purpose that is illegal or prohibited by these terms.
                            You are responsible for ensuring that your use of the library complies with the Terms of Service of the platforms
                            you interact with (e.g., Discord, YouTube, Spotify).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Disclaimer of Warranties</h2>
                        <p>
                            The library is provided "as is" without warranty of any kind, express or implied.
                            We do not warrant that the library will be error-free or that it will meet your specific requirements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>
                            In no event shall the authors or copyright holders be liable for any claim, damages, or other liability,
                            whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software.
                        </p>
                    </section>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-sm text-gray-500">
                    Last Updated: February 9, 2024
                </div>
            </div>
        </div>
    );
}
