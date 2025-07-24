import projectDefi from "@/assets/project-defi.jpg";
import projectNft from "@/assets/project-nft.jpg";
import projectGaming from "@/assets/project-gaming.jpg";
import P1x3lzImg from "@/assets/projects/P1x3lz.png";
import FlappyTrumpImg from "@/assets/projects/Flapy -trump.png";
import ChogVsCatgirlImg from "@/assets/projects/Chog-vs-catgirl.png";
import MontipImg from "@/assets/projects/Montip.png";
import RetroBlockExpImg from "@/assets/projects/Retro Block Exp..png";
import MonairImg from "@/assets/projects/Monair.png";
import TestnetExpImg from "@/assets/projects/Testnet Exp.png";
import TestnetMetricsHubImg from "@/assets/projects/Testnet Metrics Hub.png";
import GithubLogo from "@/assets/projects/github.png";
import NfThingImg from "@/assets/projects/NfThing.png";
import MoNftImg from "@/assets/projects/MoNft.png";
import NadtoolsImg from "@/assets/projects/Nadtools.png";
import NADMONImg from "@/assets/projects/NADMON.png";
import BlonksImg from "@/assets/projects/Blonks.png";
import MoodArtImg from "@/assets/projects/MoodArt.png";

function normalizeTwitter(twitter) {
  if (!twitter) return "";
  const trimmed = twitter.trim();
  if (trimmed.toLowerCase().startsWith("http")) return trimmed;
  return `https://x.com/${trimmed.replace(/^@/, "")}`;
}

export const mockProjects = [
  {
    id: "1",
    name: "P1x3lz",
    description: "P1x3lz - r/place style game on Farcaster ",
    builder: {
      name: "shirumo_lab",
      discord: "",
      twitter: normalizeTwitter("Shirumo_lab")
    },
    thumbnail: P1x3lzImg,
    githubUrl: "",
    liveUrl: "https://farcaster.xyz/miniapps/L1SuwsoofH7Q/p1x3lz",
    tags: ["Miniapp", "Pixel Art", "Winner"],
    mission: "Break Monad v2: Farcaster Edition"
  },
  {
    id: "2",
    name: "Flappy Trump",
    description: "A Flappy Bird-inspired on Monad Testnet",
    builder: {
      name: "Kshitij Gajapure",
      discord: "",
      twitter: normalizeTwitter("KshitijGajapure")
    },
    thumbnail: FlappyTrumpImg,
    githubUrl: "",
    liveUrl: "https://farcaster.xyz/miniapps/v21qItMnSK7y/flappy-trump",
    tags: ["Game", "Miniapp", "Runner-up"],
    mission: "Break Monad v2: Farcaster Edition"
  },
  {
    id: "3",
    name: "Chog vs CatGirls",
    description: " Chog vs CatGirls Fight Meow, or Die Ugly",
    builder: {
      name: "zekeosborn",
      discord: "",
      twitter: normalizeTwitter("zekeosborn")
    },
    thumbnail: ChogVsCatgirlImg,
    githubUrl: "",
    liveUrl: "https://farcaster.xyz/miniapps/8izMbIunWy2Y/chog-vs-cat-girls",
    tags: ["Game", "Miniapp", "Third Place"],
    mission: "Break Monad v2: Farcaster Edition"
  },
  {
    id: "4",
    name: "MonTip",
    description: "A tipping miniapp Tip your favorite casts with Testnet MON.",
    builder: {
      name: "manisai001",
      discord: "",
      twitter: normalizeTwitter("manisai001")
    },
    thumbnail: MontipImg,
    githubUrl: "",
    liveUrl: "https://farcaster.xyz/miniapps/nlTxSg9aEUXH/montip",
    tags: ["Tipping", "Miniapp", "Finalist"],
    mission: "Break Monad v2: Farcaster Edition"
  },
  {
    id: "5",
    name: "DevHub",
    description: "DevHub - Monad Visualizer and winner of Mission 4 (Visualizers Track)",
    builder: {
      name: "0xkadzu",
      discord: "",
      twitter: normalizeTwitter("0xkadzu")
    },
    thumbnail: projectDefi, // No custom image provided
    githubUrl: "",
    liveUrl: "https://devhub.kadzu.dev/",
    tags: ["Visualizer", "Winner", "Mission 4"],
    mission: "Visualizer & Dashboard (Mission 4)"
  },
  {
    id: "6",
    name: "Retro Block Exp.",
    description: "Retro Block Explorer - Retro plane visualizer, runner-up in Mission 4 (Visualizers Track)",
    builder: {
      name: "GurhanKutsal",
      discord: "",
      twitter: normalizeTwitter("GurhanKutsal")
    },
    thumbnail: RetroBlockExpImg,
    githubUrl: "",
    liveUrl: "https://retro-plane-vis.onrender.com/",
    tags: ["Visualizer", "Runner-up", "Mission 4"],
    mission: "Visualizer & Dashboard (Mission 4)"
  },
  {
    id: "7",
    name: "Monair",
    description: "Monair - Monad Testnet Visualizer, third place in Mission 4 (Visualizers Track)",
    builder: {
      name: "prematrkurtcuk",
      discord: "",
      twitter: normalizeTwitter("prematrkurtcuk")
    },
    thumbnail: MonairImg,
    githubUrl: "",
    liveUrl: "https://monair.vercel.app/",
    tags: ["Visualizer", "Third Place", "Mission 4"],
    mission: "Visualizer & Dashboard (Mission 4)"
  },
  {
    id: "8",
    name: "Testnet Exp",
    description: "Testnet Explorer - Monad Testnet Dashboard, winner of Mission 4 (Dashboards Track)",
    builder: {
      name: "solodanETH",
      discord: "",
      twitter: normalizeTwitter("solodanETH")
    },
    thumbnail: TestnetExpImg,
    githubUrl: "",
    liveUrl: "https://flipsidecrypto.xyz/solodan_/monad-testnet-explorer-xDbcKc",
    tags: ["Dashboard", "Winner", "Mission 4"],
    mission: "Visualizer & Dashboard (Mission 4)"
  },
  {
    id: "9",
    name: "Testnet Metrics Hub",
    description: "Testnet Metrics Hub - Monad Testnet Metrics Dashboard, runner-up in Mission 4 (Dashboards Track)",
    builder: {
      name: "devasherarch",
      discord: "",
      twitter: normalizeTwitter("devasherarch")
    },
    thumbnail: TestnetMetricsHubImg,
    githubUrl: "",
    liveUrl: "https://flipsidecrypto.xyz/devasher/monad-testnet-metrics-hub-rkpM32",
    tags: ["Dashboard", "Runner-up", "Mission 4"],
    mission: "Visualizer & Dashboard (Mission 4)"
  },
  {
    id: "10",
    name: "nadcp_dot_fun",
    description: "nadcp_dot_fun - MCP Madness tool",
    builder: {
      name: "velkan_gst",
      discord: "",
      twitter: normalizeTwitter("velkan_gst")
    },
    thumbnail: GithubLogo,
    githubUrl: "https://github.com/velikanghost/nadcp_dot_fun",
    liveUrl: "",
    tags: ["MCP", "Tool", "Mission 2"],
    mission: "Mission 2"
  },
  {
    id: "11",
    name: "MonadHub-MCP",
    description: "MonadHub-MCP - MCP Madness tool",
    builder: {
      name: "Piki_eth",
      discord: "",
      twitter: normalizeTwitter("Piki_eth")
    },
    thumbnail: GithubLogo,
    githubUrl: "https://github.com/zaki9501/MonadHub-MCP",
    liveUrl: "",
    tags: ["MCP", "Tool", "Mission 2"],
    mission: "Mission 2"
  },
  {
    id: "12",
    name: "monad-mcp-server (vib3ai)",
    description: "monad-mcp-server by vib3ai - MCP Madness tool",
    builder: {
      name: "nadaidotfun",
      discord: "",
      twitter: normalizeTwitter("nadaidotfun")
    },
    thumbnail: GithubLogo,
    githubUrl: "https://github.com/vib3ai/monad-mcp-server",
    liveUrl: "",
    tags: ["MCP", "Tool", "Mission 2"],
    mission: "Mission 2"
  },
  {
    id: "13",
    name: "monad-mcp-server (AnasXDev)",
    description: "monad-mcp-server by AnasXDev - MCP Madness tool",
    builder: {
      name: "AnasXDev",
      discord: "",
      twitter: normalizeTwitter("AnasXDev")
    },
    thumbnail: GithubLogo,
    githubUrl: "",
    liveUrl: "",
    tags: ["MCP", "Tool", "Mission 2"],
    mission: "Mission 2"
  },
  {
    id: "14",
    name: "mcp-santi",
    description: "mcp-santi - MCP Madness tool",
    builder: {
      name: "gabriell_santi",
      discord: "",
      twitter: normalizeTwitter("gabriell_santi")
    },
    thumbnail: GithubLogo,
    githubUrl: "https://github.com/SantiSjp/mcp-santi",
    liveUrl: "",
    tags: ["MCP", "Tool", "Mission 2"],
    mission: "Mission 2"
  },
  // Mission 5: Make NFTs Great Again - NFT Tooling Track
  {
    id: "15",
    name: "NFThing",
    description: "NFThing - Comprehensive NFT tooling platform, winner of Mission 5 NFT Tooling track",
    builder: {
      name: "gabriell_santi & shaianeviana",
      discord: "",
      twitter: normalizeTwitter("gabriell_santi")
    },
    thumbnail: projectNft,
    githubUrl: "",
    liveUrl: "https://nfthing-beta.vercel.app/",
    tags: ["NFT", "Tooling", "Winner", "Mission 5"],
    mission: "Make NFTs Great Again (Mission 5)"
  },
  {
    id: "16",
    name: "MoNFT",
    description: "MoNFT - NFT tools and utilities platform, runner-up in Mission 5 NFT Tooling track",
    builder: {
      name: "rosinxyz",
      discord: "",
      twitter: normalizeTwitter("rosinxyz")
    },
    thumbnail: projectNft,
    githubUrl: "",
    liveUrl: "https://www.monft.tools/",
    tags: ["NFT", "Tooling", "Runner-up", "Mission 5"],
    mission: "Make NFTs Great Again (Mission 5)"
  },
  {
    id: "17",
    name: "NadTools",
    description: "NadTools - NFT development and management tools, third place in Mission 5 NFT Tooling track",
    builder: {
      name: "tonashiro_",
      discord: "",
      twitter: normalizeTwitter("tonashiro_")
    },
    thumbnail: projectNft,
    githubUrl: "",
    liveUrl: "https://tools-liart-phi.vercel.app/",
    tags: ["NFT", "Tooling", "Third Place", "Mission 5"],
    mission: "Make NFTs Great Again (Mission 5)"
  },
  // Mission 5: Make NFTs Great Again - NFT Collections Track
  {
    id: "18",
    name: "Nadmon",
    description: "Nadmon - NFT collection platform, winner of Mission 5 NFT Collections track",
    builder: {
      name: "0xkadzu",
      discord: "",
      twitter: normalizeTwitter("0xkadzu")
    },
    thumbnail: projectNft,
    githubUrl: "",
    liveUrl: "https://nadmon.kadzu.dev/",
    tags: ["NFT", "Collection", "Winner", "Mission 5"],
    mission: "Make NFTs Great Again (Mission 5)"
  },
  {
    id: "19",
    name: "Blonks",
    description: "Blonks - Unique NFT collection, runner-up in Mission 5 NFT Collections track",
    builder: {
      name: "velkan_gst",
      discord: "",
      twitter: normalizeTwitter("velkan_gst")
    },
    thumbnail: projectNft,
    githubUrl: "",
    liveUrl: "https://blonks.vercel.app/",
    tags: ["NFT", "Collection", "Runner-up", "Mission 5"],
    mission: "Make NFTs Great Again (Mission 5)"
  },
  {
    id: "20",
    name: "Moodart",
    description: "Moodart - Artistic NFT collection, third place in Mission 5 NFT Collections track",
    builder: {
      name: "Davethompson100",
      discord: "",
      twitter: normalizeTwitter("Davethompson100")
    },
    thumbnail: projectNft,
    githubUrl: "",
    liveUrl: "https://moodart.vercel.app/",
    tags: ["NFT", "Collection", "Third Place", "Mission 5"],
    mission: "Make NFTs Great Again (Mission 5)"
  }
];

export const availableTags = [
  "Miniapp",
  "Game",
  "Pixel Art",
  "Tipping",
  "Winner",
  "Runner-up",
  "Third Place",
  "Finalist",
  "Visualizer",
  "Dashboard",
  "Mission 4",
  "MCP",
  "Tool",
  "Mission 2",
  "NFT",
  "Tooling",
  "Collection",
  "Mission 5",
  "AI",
  "GPT",
  "AGENT",
  "CHATBOT"
];
