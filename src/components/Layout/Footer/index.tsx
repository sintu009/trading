import React, { FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="py-6 bg-background border-t border-white/10">
      <div className="container px-4">
        <p className="text-center text-white/60">
          © {new Date().getFullYear()} CrypGo. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
