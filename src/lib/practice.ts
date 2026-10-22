export type PracticeCategory =
  | "Cloud concepts"
  | "Architecture"
  | "Pricing & SLA"
  | "Security & governance";

export interface PracticeQuestion {
  id: string;
  category: PracticeCategory;
  question: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
}

export const PRACTICE_CATEGORIES: PracticeCategory[] = [
  "Cloud concepts",
  "Architecture",
  "Pricing & SLA",
  "Security & governance",
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "q1",
    category: "Cloud concepts",
    question:
      "A SACCO in Nakuru wants to move its member records to the cloud but avoid buying servers upfront. Paying only for the compute it actually uses is an example of which model?",
    options: [
      "Capital expenditure (CapEx)",
      "Operational expenditure (OpEx) with consumption-based pricing",
      "Perpetual licensing",
      "Fixed annual contract",
    ],
    answer: 1,
    explanation:
      "Like paying for a boda boda ride per trip instead of buying a motorbike, cloud is OpEx: you pay for what you consume. CapEx means buying hardware upfront.",
  },
  {
    id: "q2",
    category: "Cloud concepts",
    question:
      "During results day, Safaricom's traffic triples for two hours then returns to normal. Which cloud benefit handles this automatically?",
    options: [
      "Fault tolerance",
      "Elasticity",
      "Disaster recovery",
      "High availability",
    ],
    answer: 1,
    explanation:
      "Elasticity = resources grow and shrink automatically with demand, like a Jumia warehouse adding casual staff for Black Friday and releasing them after.",
  },
  {
    id: "q3",
    category: "Cloud concepts",
    question:
      "Which service model gives you the MOST responsibility for managing the underlying infrastructure?",
    options: ["SaaS", "PaaS", "IaaS", "Serverless"],
    answer: 2,
    explanation:
      "IaaS (e.g. Azure Virtual Machines) is like renting a house — you manage the inside (OS, apps, data). SaaS (e.g. Microsoft 365) is like hailing a matatu; you just ride.",
  },
  {
    id: "q4",
    category: "Cloud concepts",
    question:
      "The shared responsibility model: in a PaaS service like Azure App Service, who patches the operating system?",
    options: [
      "The customer",
      "Microsoft (the cloud provider)",
      "Both equally, always",
      "Nobody — PaaS has no OS",
    ],
    answer: 1,
    explanation:
      "The provider always manages the physical layer; with PaaS the OS and platform patching is Microsoft's job too. You handle your app, code and data — like renting a furnished shop where the landlord fixes the building.",
  },
  {
    id: "q5",
    category: "Architecture",
    question:
      "Which two Azure services would a Nigerian fintech most likely use to host a web app and store its transaction records? (Choose the correct pair)",
    options: [
      "Azure Virtual Desktop and Azure DevOps",
      "Azure App Service and Azure SQL Database",
      "Azure Active Directory and Azure Sentinel",
      "Azure Functions and Azure Key Vault",
    ],
    answer: 1,
    explanation:
      "App Service hosts web apps without managing servers; Azure SQL Database stores structured records — like the shop (app) and the ledger (database) of a duka.",
  },
  {
    id: "q6",
    category: "Architecture",
    question:
      "An app for users in Nairobi and Kampala suffers slow responses. Which Azure feature should the team prioritise when choosing where to deploy?",
    options: [
      "Availability Sets",
      "Region selection — e.g. South Africa North (Johannesburg)",
      "Resource tags",
      "Azure Policy",
    ],
    answer: 1,
    explanation:
      "Choose the region closest to your users to reduce latency — like opening a shop where your customers live, not in another town. Africa's regions are South Africa North (Johannesburg) and South Africa West (Cape Town).",
  },
  {
    id: "q7",
    category: "Architecture",
    question:
      "A company wants to organise billing and access for its finance, HR and engineering departments in one Azure account. What should it create?",
    options: [
      "One resource group per department under a single subscription",
      "Separate subscriptions (or management groups) per department",
      "One availability zone per department",
      "Separate Azure AD tenants per department only",
    ],
    answer: 1,
    explanation:
      "Subscriptions (grouped by management groups) separate billing and access — like a chama keeping separate books for each project. Resource groups only organise resources within a subscription.",
  },
  {
    id: "q8",
    category: "Architecture",
    question:
      "What is the difference between an Azure region and an Availability Zone?",
    options: [
      "They are the same thing",
      "A region is a geographic area; Availability Zones are separate datacenters within it",
      "An Availability Zone is bigger than a region",
      "Regions only exist in the US",
    ],
    answer: 1,
    explanation:
      "A region is a geographic area (like South Africa North); Availability Zones are isolated datacenters inside it with independent power and networking — like KPLC outages not hitting branches that have their own backup generators.",
  },
  {
    id: "q9",
    category: "Pricing & SLA",
    question:
      "Kenya Power's token meter charges you per unit consumed. Which Azure pricing model works the same way?",
    options: [
      "Reserved instances (1–3 years)",
      "Pay-as-you-go / metered billing",
      "Free tier only",
      "Spot pricing only",
    ],
    answer: 1,
    explanation:
      "Pay-as-you-go meters usage like a KPLC token meter: pay per compute-second or GB. Reserved instances are like paying a year's rent upfront for a big discount.",
  },
  {
    id: "q10",
    category: "Pricing & SLA",
    question:
      "A billing team wants to predict monthly Azure costs and set a hard spending alert for each department. Which tool fits?",
    options: [
      "Azure Cost Management + Budgets",
      "Azure Advisor",
      "Azure Service Health",
      "Azure Monitor logs only",
    ],
    answer: 0,
    explanation:
      "Cost Management tracks and forecasts spend; Budgets raise alerts at thresholds — like your M-Pesa app warning you when your balance passes a limit you set.",
  },
  {
    id: "q11",
    category: "Pricing & SLA",
    question:
      "A mission-critical payment API must stay reachable even if one datacenter fails. Which SLA-focused design helps most?",
    options: [
      "Deploy the app across multiple Availability Zones",
      "Use the cheapest VM size",
      "Disable auto-scaling",
      "Store backups in the same datacenter",
    ],
    answer: 0,
    explanation:
      "Spreading across Availability Zones keeps the app up when one datacenter goes down — that's what the 99.99% SLA level assumes. Putting backups in the same datacenter defeats the purpose.",
  },
  {
    id: "q12",
    category: "Security & governance",
    question:
      "You must ensure no one creates Azure resources in regions outside Africa. Which service enforces this rule automatically?",
    options: [
      "Azure Monitor",
      "Azure Policy",
      "Azure Sentinel",
      "Microsoft Defender for Cloud",
    ],
    answer: 1,
    explanation:
      "Azure Policy defines and enforces rules (like 'only allow South Africa North/West') across your subscriptions — like county by-laws that apply to every shop automatically.",
  },
  {
    id: "q13",
    category: "Security & governance",
    question:
      "Where should a team store database connection strings and API keys securely in Azure?",
    options: [
      "In app source code on GitHub",
      "In Azure Key Vault",
      "In a resource tag",
      "In an email to the team",
    ],
    answer: 1,
    explanation:
      "Azure Key Vault stores secrets, keys and certificates with controlled access — like a bank locker instead of writing your PIN on a note stuck to the door.",
  },
  {
    id: "q14",
    category: "Security & governance",
    question:
      "Which Azure service manages who can do what to which resources (e.g. only finance admins can touch billing resources)?",
    options: [
      "Azure RBAC (role-based access control)",
      "Azure Load Balancer",
      "Azure Firewall pricing tiers",
      "Azure Site Recovery",
    ],
    answer: 0,
    explanation:
      "RBAC assigns roles (Owner, Contributor, Reader…) to users or groups — like a SACCO where only the treasurer signs withdrawals, members just view statements.",
  },
  {
    id: "q15",
    category: "Security & governance",
    question:
      "Microsoft Defender for Cloud primarily helps you to…",
    options: [
      "Design user interfaces",
      "Detect threats and get security posture recommendations",
      "Reduce compute costs",
      "Migrate on-premises servers",
    ],
    answer: 1,
    explanation:
      "Defender for Cloud watches your resources, flags threats and recommends fixes — like a security guard checking every door of the mall and reporting which one was left open.",
  },
];
