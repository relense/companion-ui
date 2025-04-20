export type Question = {
  role: "assistant" | "user";
  content: string;
};

const basicOnboardingConversation = () => {
  const conversation: Question[] = [
    {
      role: "assistant",
      content:
        "Hello there! It's great to connect with you. I'm really looking forward to learning about your business and helping you with your outreach goals. To start things off, may I ask your name?",
    },
    { role: "user", content: "Miguel" },
    {
      role: "assistant",
      content:
        "Nice to meet you, Miguel! What role do you play in your company or business? Let's dive into how you make things happen there.",
    },
    { role: "user", content: "I am the founder" },
    {
      role: "assistant",
      content:
        "That's fantastic, Miguel! As the founder, you must have a unique perspective on your business. Could you share a quick one-liner about what your product or service helps people do?",
    },
    {
      role: "user",
      content: "Help people deal with the pain of cold outreach",
    },
    {
      role: "assistant",
      content:
        "That's a crucial service, Miguel! Helping people manage the pain of cold outreach is definitely valuable. What would you say is your biggest goal with outreach? Are you looking to expand your client base, increase brand awareness, or something else?",
    },
    {
      role: "user",
      content:
        "My biggest goal is to solve the creation of the email, linkedin dm, reddit dm or whatever that involves reaching out to someone or company out of nowhere and have success and response and a way to follow up",
    },
    {
      role: "assistant",
      content:
        "Got it, Miguel! So your focus is on creating effective outreach messages that get responses and have a strong follow-up strategy. Now, who's your dream customer? Who do you really aspire to reach out to with your services?",
    },
    {
      role: "user",
      content:
        "solo founders, freelancers and people selling a service to someone or company",
    },

    {
      role: "assistant",
      content:
        "Thanks for sharing that, Miguel! Solo founders, freelancers, and service sellers sound like an exciting group to work with. When someone first hears about your product or service, what do you think usually gets them excited or curious?",
    },

    {
      role: "user",
      content:
        "I guess the idea to not have to think criatively about making cold outreachs.  That they can feed for instance a company information or about someone they could do cold outreach and the app generates the email and always knows all information. Even to share info for a company the user just has to give some link to the company page",
    },

    {
      role: "assistant",
      content:
        "That's a compelling advantage, Miguel! Eliminating the creative burden and automating the process with minimal input is definitely exciting. Now, what would you say is the number one problem your product or service solves for these solo founders and freelancers?",
    },

    {
      role: "user",
      content: "Coming up with what to say in email and dms for cold outreach",
    },

    {
      role: "assistant",
      content:
        "Thanks, Miguel. Helping with what to say in emails and DMs can make a huge difference in cold outreach. Can you describe what success looks like after someone uses your product? How does it change their outreach experience?",
    },

    {
      role: "user",
      content:
        "For is to feel seen and to actually have a way to reach and to follow up",
    },

    {
      role: "assistant",
      content:
        "Thanks, Miguel. Helping with what to say in emails and DMs can make a huge difference in cold outreach. Can you describe what success looks like after someone uses your product? How does it change their outreach experience?",
    },

    { role: "user", content: "Email, linkedin and reddit at first" },

    {
      role: "assistant",
      content:
        "Perfect, Miguel! Email, LinkedIn, and Reddit are great platforms to start with. Before we wrap things up, is there anything else you'd like me to know about you, your business, or your goals that could help me support you even better in our efforts to craft outreach messages?",
    },
    { role: "user", content: "I dont think so" },
  ];

  return conversation;
};

const promptUtil = {
  basicOnboardingConversation,
};

export default promptUtil;
