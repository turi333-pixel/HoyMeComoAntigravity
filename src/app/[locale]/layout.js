import { Outfit, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata = {
    title: "HoyMeComo - What to Cook Today",
    description: "Find the perfect meal for your macros.",
};

import Header from "@/components/Header";

export default async function LocaleLayout({
    children,
    params
}) {
    const { locale } = await params;
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={`${outfit.variable} ${inter.variable}`}>
                <NextIntlClientProvider messages={messages}>
                    <Header locale={locale} />
                    <main style={{ minHeight: '100vh', padding: '1rem' }}>
                        {children}
                    </main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
