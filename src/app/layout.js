// app/layout.js
import "./globals.css";

export const metadata = {
  title: "OnlineTeachers1to1 | Learn with Expert Teachers",
  description:
    "OnlineTeachers1to1 connects students in Gulf countries with expert teachers for personalized 1-to-1 learning.",
  keywords: [
    "online learning",
    "Gulf countries",
    "1-to-1 tutoring",
    "primary education",
    "expert teachers",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
