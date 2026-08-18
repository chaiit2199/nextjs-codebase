export const customMetadata = {
    metadataBase: new URL("https://ccode.vn"),
    title: { default: "CCode — Blog Lập Trình & Chia Sẻ Code Base", template: "%s | CCode"},
    description: "Chia sẻ kiến thức lập trình, cấu trúc code base chuẩn, hướng dẫn Next.js, React và kinh nghiệm phát triển phần mềm tối ưu.",
    keywords: ["CCode",  "Code Base", "Next.js", "React", "Lập trình web", "Frontend Development", "Clean Code", "Blog lập trình"],
    authors: [{ name: "CCode", url: "https://ccode.vn" }],
    creator: "CCode",
    publisher: "CCode",
    applicationName: "CCode",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
  
    alternates: {
      canonical: "./",
    },
  
    openGraph: {
      title: "CCode — Blog Lập Trình & Chia Sẻ Code Base",
      description:
        "Chia sẻ kiến thức lập trình, cấu trúc code base chuẩn, hướng dẫn Next.js, React và kinh nghiệm phát triển phần mềm.",
      url: "https://ccode.vn",
      siteName: "CCode",
      locale: "vi_VN",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "CCode Blog & Code Base",
        },
      ],
    },
  
    twitter: {
      card: "summary_large_image",
      title: "CCode — Blog Lập Trình & Chia Sẻ Code Base",
      description:
        "Chia sẻ kiến thức lập trình, cấu trúc code base chuẩn và kinh nghiệm lập trình Next.js / React.",
      images: ["/og-image.png"],
      creator: "@ccode",
    },
  
    icons: {
      icon: [{ url: "/icons/favicon.png", type: "image/png" }],
      shortcut: "/icons/favicon.png",
      apple: "/icons/favicon.png",
    },
};