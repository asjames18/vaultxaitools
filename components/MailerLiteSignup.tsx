'use client';

import { useEffect } from 'react';

export default function MailerLiteSignup() {
  useEffect(() => {
    // Load MailerLite's universal script
    const script = document.createElement('script');
    script.src = 'https://static.mailerlite.com/js/universal.js';
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      {/* Replace YOUR_ACCOUNT_ID and YOUR_FORM_ID with your MailerLite details */}
      <div className="ml-form-embed"
           data-account="1670395"
           data-form="fx976w">
        <div className="ml-form-align-center">
          <div className="ml-form-embed-inner">
            {/* MailerLite form will render here */}
          </div>
        </div>
      </div>
    </div>
  );
} 