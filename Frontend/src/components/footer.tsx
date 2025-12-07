import { useState, useEffect } from "react";
import "../css/global.css";

const Footer = () => {
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-IN", { hour12: true });
  };

  const [date, setDate] = useState<string>(formatDate(new Date()));
  const [time, setTime] = useState<string>(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setDate(formatDate(now));
      setTime(formatTime(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="footer">
      {/* Left side */}
      <div className="footer-left">
        © DEVELOPED BY IOTELLIGENCE SOFTWARE SOLUTIONS |{" "}
        <a className="footer-link" href="tel:+919158151405">
          +91 9158151405
        </a>{" "}
        | 2025
      </div>

      {/* Right side */}
      <div className="footer-right">
        <div>{date}</div>
        <div>{time}</div>
      </div>
    </footer>
  );
};

export default Footer;
``