function buildDiscoveryForm() {
  var form = FormApp.getActiveForm();

  form.setTitle("Client Website Discovery Form");
  form.setDescription("Help us build a website that gets you real leads and real results.\n\nPlease fill this out as thoroughly as you can. The more detail you give us, the better we can design a site that solves your problems, shows off your strengths, and brings in customers on autopilot. Takes about 10–15 minutes.");
  form.setConfirmationMessage("Thank you! We'll review your answers and follow up within 1–2 business days with a custom plan.");

  // ─── SECTION 1 — About You & Your Business ───────────────────────
  form.addSectionHeaderItem()
    .setTitle("Section 1 — About You & Your Business");

  form.addTextItem().setTitle("Your Full Name").setRequired(true);
  form.addDateItem().setTitle("Today's Date");
  form.addTextItem().setTitle("Business Name").setRequired(true);
  form.addTextItem().setTitle("Your Role / Title").setHelpText("Owner, CEO, Manager…");
  form.addTextItem().setTitle("Phone Number").setRequired(true);
  form.addTextItem().setTitle("Email Address").setRequired(true);
  form.addTextItem().setTitle("Current Website (if any)").setHelpText("Leave blank if you don't have one");
  form.addTextItem().setTitle("Years in Business");
  form.addTextItem().setTitle("Business Location / Service Area").setHelpText("City, state, or region you serve");
  form.addTextItem().setTitle("Industry").setHelpText("e.g. Plumbing, Landscaping, HVAC, Cleaning…");

  form.addParagraphTextItem()
    .setTitle("1. In one or two sentences, what does your business do?")
    .setHelpText("Pretend you're explaining it to someone you just met.")
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle("2. Who are your ideal customers?")
    .setHelpText("Age, gender, income, location, interests, job title, pain points — whatever fits.");

  form.addParagraphTextItem()
    .setTitle("3. What products or services do you offer? List the top 3–5.");

  form.addParagraphTextItem()
    .setTitle("4. Which service or product makes you the most money right now?");

  // ─── SECTION 2 — Goals ───────────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 2 — Goals for Your Website");

  form.addCheckboxItem()
    .setTitle("5. What's the #1 thing you want your new website to do for you?")
    .setHelpText("Check all that apply.")
    .setChoiceValues([
      "Get more leads / inquiries",
      "Sell products directly (e-commerce)",
      "Book appointments or consultations",
      "Build credibility & trust",
      "Showcase portfolio / past work",
      "Rank on Google for my services",
      "Automate customer support / FAQs",
      "Grow an email list",
      "Other"
    ]);

  form.addParagraphTextItem()
    .setTitle("6. If your website was wildly successful in 6 months, what would that look like?")
    .setHelpText("Example: 'I'm booking 20 new clients a month without cold calling.'");

  form.addParagraphTextItem()
    .setTitle("7. How many leads or sales per month would make this website 'worth it'?");

  // ─── SECTION 3 — Problems ────────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 3 — Problems You're Facing Right Now");

  form.addParagraphTextItem()
    .setTitle("8. What's the biggest problem in your business today?")
    .setHelpText("Be honest — not enough leads, too much manual work, bad reviews, no time, etc.");

  form.addParagraphTextItem()
    .setTitle("9. What's wrong with your current website (or why don't you have one)?");

  form.addParagraphTextItem()
    .setTitle("10. What tasks do you waste the most time on that a website could automate?")
    .setHelpText("Answering the same questions, taking bookings, sending quotes, collecting reviews, follow-ups, etc.");

  form.addParagraphTextItem()
    .setTitle("11. What questions do customers ask you over and over?")
    .setHelpText("These become your FAQ / chatbot content.");

  form.addParagraphTextItem()
    .setTitle("12. What objections stop people from buying from you?")
    .setHelpText("Price? Trust? Timing? Not sure what you do?");

  // ─── SECTION 4 — Strengths ───────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 4 — Your Strengths (What Makes You Great)");

  form.addParagraphTextItem()
    .setTitle("13. Why do your current customers choose you over someone else?");

  form.addParagraphTextItem()
    .setTitle("14. What do you do better than anyone else in your industry?");

  form.addParagraphTextItem()
    .setTitle("15. What's one thing customers always compliment you on?");

  form.addParagraphTextItem()
    .setTitle("16. Any awards, certifications, press mentions, or big-name clients we should feature?");

  form.addParagraphTextItem()
    .setTitle("17. Do you have testimonials, reviews, or case studies we can use?")
    .setHelpText("List where they are (Google, Yelp, Facebook, email screenshots, etc.) or paste them in.");

  // ─── SECTION 5 — Weaknesses ──────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 5 — Your Weaknesses (So We Can Fix Them)");

  form.addParagraphTextItem()
    .setTitle("18. What do you feel is weak or missing in your current marketing?");

  form.addParagraphTextItem()
    .setTitle("19. Where do you lose customers in your current process?")
    .setHelpText("At the first phone call? On the old website? When they compare prices?");

  form.addParagraphTextItem()
    .setTitle("20. Are there services you offer that customers don't know about?");

  form.addParagraphTextItem()
    .setTitle("21. What do you wish you had more time / money / knowledge to do?");

  // ─── SECTION 6 — Competitors ─────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 6 — Your Competitors");

  form.addParagraphTextItem()
    .setTitle("22. List 2–3 direct competitors (with websites if possible).");

  form.addParagraphTextItem()
    .setTitle("23. What do your competitors do BETTER than you?")
    .setHelpText("Don't worry — we'll use this to close the gap.");

  form.addParagraphTextItem()
    .setTitle("24. What do your competitors do WORSE than you?")
    .setHelpText("This is your opportunity. We'll highlight it on your site.");

  form.addParagraphTextItem()
    .setTitle("25. Any websites (inside or outside your industry) you love the look or feel of?")
    .setHelpText("Paste URLs and tell us what you like.");

  form.addParagraphTextItem()
    .setTitle("26. Any websites you HATE or want to avoid looking like?");

  // ─── SECTION 7 — Brand ───────────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 7 — Brand, Look & Feel");

  form.addTextItem()
    .setTitle("27. Describe your brand in 3–5 words.")
    .setHelpText("Example: modern, friendly, luxury, rugged, trustworthy, playful.");

  form.addParagraphTextItem()
    .setTitle("28. Do you have a logo, brand colors, or fonts we should use?")
    .setHelpText("If yes, email them to us after submitting this form.");

  form.addMultipleChoiceItem()
    .setTitle("29. Which style fits you best?")
    .setChoiceValues([
      "Clean & minimal (lots of white space)",
      "Bold & modern (big text, bright colors)",
      "Warm & friendly (inviting, human)",
      "Professional & corporate (trust-first)",
      "Luxury & premium (dark, elegant)",
      "Fun & playful (illustrations, personality)"
    ]);

  // ─── SECTION 8 — Pages & Content ─────────────────────────────────
  form.addPageBreakItem().setTitle("Section 8 — Pages & Content");

  form.addCheckboxItem()
    .setTitle("30. Which pages do you want on your site?")
    .setHelpText("Check all that apply.")
    .setChoiceValues([
      "Home",
      "About / Our Story",
      "Services or Products",
      "Pricing",
      "Portfolio / Gallery",
      "Testimonials / Reviews",
      "FAQ",
      "Blog / Resources",
      "Contact",
      "Booking / Scheduling",
      "Shop / E-commerce",
      "Client Login / Portal",
      "Other"
    ]);

  form.addParagraphTextItem()
    .setTitle("31. Do you have content ready (photos, copy, video) or do you need us to create it?");

  // ─── SECTION 9 — Lead Generation & Automation ────────────────────
  form.addPageBreakItem().setTitle("Section 9 — Lead Generation & Automation");

  form.addCheckboxItem()
    .setTitle("32. How do you want people to contact or buy from you?")
    .setHelpText("Check all that apply.")
    .setChoiceValues([
      "Contact form → email",
      "Phone call / click-to-call",
      "Text message / SMS",
      "Online booking / calendar",
      "Live chat or chatbot",
      "Buy directly (e-commerce checkout)",
      "Request a quote form",
      "Email newsletter signup"
    ]);

  form.addMultipleChoiceItem()
    .setTitle("33. Would you like an AI chatbot on your site to answer FAQs 24/7?")
    .setChoiceValues([
      "Yes — answer questions & capture leads",
      "Yes — but only after business hours",
      "Not sure, tell me more",
      "No"
    ]);

  form.addCheckboxItem()
    .setTitle("34. Which automations would help you most?")
    .setHelpText("Check all that apply.")
    .setChoiceValues([
      "Auto-reply email when someone fills a form",
      "Automatic appointment booking + reminders",
      "Lead follow-up sequence (emails/texts over 7–30 days)",
      "Review request automation (after a job is done)",
      "Abandoned cart / quote follow-up",
      "CRM integration (HubSpot, GoHighLevel, Zoho, etc.)",
      "Payment collection / invoicing",
      "Monthly analytics report delivered to your inbox"
    ]);

  form.addParagraphTextItem()
    .setTitle("35. What free offer or 'lead magnet' could you give visitors in exchange for their email?")
    .setHelpText("Examples: free quote, checklist, consultation, discount code, PDF guide.");

  form.addParagraphTextItem()
    .setTitle("36. Do you already run ads (Google, Meta, TikTok)? Want the site built to work with ads?");

  form.addParagraphTextItem()
    .setTitle("37. Which tools do you already use that the site should connect to?")
    .setHelpText("Examples: Stripe, Square, QuickBooks, Calendly, Mailchimp, HubSpot, GoHighLevel, Shopify.");

  // ─── SECTION 10 — Google ─────────────────────────────────────────
  form.addPageBreakItem().setTitle("Section 10 — Getting Found on Google");

  form.addParagraphTextItem()
    .setTitle("38. What would someone type into Google to find a business like yours?")
    .setHelpText("Example: 'emergency plumber in Dallas', 'wedding photographer Austin'");

  form.addParagraphTextItem()
    .setTitle("39. What cities, zip codes, or regions do you serve?");

  form.addMultipleChoiceItem()
    .setTitle("40. Do you have a Google Business Profile set up?")
    .setChoiceValues(["Yes", "No", "Not sure"]);

  // ─── SECTION 11 — Budget & Timeline ──────────────────────────────
  form.addPageBreakItem().setTitle("Section 11 — Budget & Timeline");

  form.addMultipleChoiceItem()
    .setTitle("41. When do you want this website live?")
    .setChoiceValues([
      "ASAP (within 2 weeks)",
      "Within 1 month",
      "Within 2–3 months",
      "Flexible — quality over speed"
    ]);

  form.addMultipleChoiceItem()
    .setTitle("42. What's your budget range for the project?")
    .setChoiceValues([
      "Under $1,000",
      "$1,000 – $3,000",
      "$3,000 – $7,000",
      "$7,000 – $15,000",
      "$15,000+",
      "Not sure yet — give me options"
    ]);

  form.addMultipleChoiceItem()
    .setTitle("43. Are you interested in ongoing maintenance, hosting, or monthly optimization?")
    .setChoiceValues(["Yes", "No", "Tell me more"]);

  // ─── SECTION 12 — Anything Else ──────────────────────────────────
  form.addPageBreakItem().setTitle("Section 12 — Anything Else");

  form.addParagraphTextItem()
    .setTitle("44. Is there anything else we should know about your business, your customers, or your goals?");

  form.addParagraphTextItem()
    .setTitle("45. How did you hear about us?");

  Logger.log("Done! All 45 questions added to your form.");
}
