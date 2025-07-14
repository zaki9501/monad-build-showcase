import projectDefi from "@/assets/project-defi.jpg";
import projectNft from "@/assets/project-nft.jpg";
import projectGaming from "@/assets/project-gaming.jpg";

export const mockProjects = [
  {
    id: "1",
    name: "MonadSwap",
    description: "A decentralized exchange built for high-speed trading on Monad. Features advanced AMM protocols and yield farming opportunities.",
    builder: {
      name: "Alice Chen",
      discord: "alice_dev",
      twitter: "alice_builds"
    },
    thumbnail: projectDefi,
    githubUrl: "https://github.com/alice/monadswap",
    liveUrl: "https://monadswap.app",
    tags: ["DeFi", "AMM", "Trading", "Yield Farming"],
    mission: "Mission 2"
  },
  {
    id: "2", 
    name: "Monad Punks",
    description: "A unique NFT collection with on-chain generation and staking rewards. Built entirely on Monad with gas-efficient smart contracts.",
    builder: {
      name: "Bob Martinez",
      discord: "bob_nft_king",
      twitter: "bob_creates"
    },
    thumbnail: projectNft,
    githubUrl: "https://github.com/bob/monad-punks",
    liveUrl: "https://monadpunks.io",
    tags: ["NFTs", "Art", "Staking", "Gaming"],
    mission: "Mission 1"
  },
  {
    id: "3",
    name: "ChainQuest",
    description: "An on-chain RPG game where players battle, collect items, and trade assets. Leveraging Monad's speed for real-time gameplay.",
    builder: {
      name: "Charlie Wong",
      discord: "charlie_gamer",
      twitter: "charlie_plays"
    },
    thumbnail: projectGaming,
    githubUrl: "https://github.com/charlie/chainquest",
    liveUrl: "https://chainquest.gg",
    tags: ["Gaming", "RPG", "NFTs", "Real-time"],
    mission: "Mission 3"
  },
  {
    id: "4",
    name: "MonadLend",
    description: "A lending protocol offering competitive rates and innovative collateral options. Built with security and efficiency in mind.",
    builder: {
      name: "Diana Kim",
      discord: "diana_defi",
      twitter: "diana_builds"
    },
    thumbnail: projectDefi,
    githubUrl: "https://github.com/diana/monadlend",
    tags: ["DeFi", "Lending", "Protocol", "Collateral"],
    mission: "Mission 2"
  },
  {
    id: "5",
    name: "Monad Music",
    description: "A decentralized music platform where artists can mint, sell, and stream their music as NFTs. Royalty distribution built-in.",
    builder: {
      name: "Eve Johnson",
      discord: "eve_music",
      twitter: "eve_tunes"
    },
    thumbnail: projectNft,
    githubUrl: "https://github.com/eve/monad-music",
    liveUrl: "https://monadmusic.app",
    tags: ["NFTs", "Music", "Streaming", "Royalties"],
    mission: "Mission 1"
  },
  {
    id: "6",
    name: "FastBridge",
    description: "A cross-chain bridge utilizing Monad's speed to enable rapid asset transfers between different blockchain networks.",
    builder: {
      name: "Frank Wilson",
      discord: "frank_bridge",
      twitter: "frank_cross"
    },
    thumbnail: projectDefi,
    githubUrl: "https://github.com/frank/fastbridge",
    tags: ["Bridge", "Cross-chain", "Infrastructure", "Speed"],
    mission: "Mission 4"
  }
];

export const availableTags = [
  "DeFi",
  "NFTs", 
  "Gaming",
  "Bridge",
  "Infrastructure",
  "Trading",
  "Art",
  "Music",
  "Lending",
  "Staking",
  "AMM",
  "Protocol",
  "Cross-chain",
  "Real-time",
  "Yield Farming",
  "RPG",
  "Streaming",
  "Royalties",
  "Collateral",
  "Speed"
];