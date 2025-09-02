
import { ArrowLeft, Calendar, Trophy, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const missions = [
  {
    id: 1,
    title: "Crazy Contract Challenge",
    description: "Showcase your smart contract expertise by creating a single contract that approaches the 128 KB compiled bytecode limit on Monad. Maximize contract size through innovation and efficiency while maintaining functionality.",
    deadline: "April 11th 2025",
    status: "completed",
    rules: [
      "Single smart contract file required",
      "Must be as close to 128kb limit as possible (submissions under 100kb disqualified)",
      "No unnecessary code for size inflation",
      "Must be verified on Monad explorer",
      "Contract must serve a useful purpose (not just bloated random data storage)",
      "Extra credit for creative and entertaining contracts"
    ],
    submission: "Submit in the comments of the original post",
    prizes: []
  },
  {
    id: 2,
    title: "MCP Madness",
    description: "Harness cutting-edge AI tools to develop an MCP server that integrates with Monad Testnet. Push the boundaries of what's possible with AI-blockchain integration.",
    deadline: "Wednesday, 30 April 2025 22:30",
    status: "completed",
    rules: [],
    submission: "Use the provided submission form",
    prizes: [
      "1st place: 3000 Testnet MON",
      "2nd place: 2000 Testnet MON", 
      "3rd place: 1000 Testnet MON",
      "4th place: 500 Testnet MON",
      "All participants: 50 Testnet MON"
    ]
  },
  {
    id: 3,
    title: "Social Graph Mini-Apps",
    description: "Explore the potential of applications with access to users' social connections. Create innovative mini-apps that leverage social graph data in unique ways.",
    deadline: "22nd May 2025, 17:00 UTC",
    status: "completed",
    rules: [],
    submission: "Submit via the official form",
    prizes: [
      "1st place: 15000 Testnet MON",
      "2nd place: 10000 Testnet MON",
      "3rd place: 5000 Testnet MON", 
      "4th place: 2500 Testnet MON",
      "All participants: 250 Testnet MON"
    ],
    resources: ["https://monad-foundation.notion.site/mini-apps"],
    submissionForm: "https://tally.so/r/w2VGDM"
  },
  {
    id: 4,
    title: "Testnet Visualizers & Dashboards",
    description: "Create compelling visualizations and dashboards for Monad Testnet data. Two distinct tracks allow for custom frontends or Flipside-powered dashboards.",
    deadline: "June 4 - June 18",
    status: "completed",
    rules: [
      "Dashboard/visualization must be publicly accessible",
      "Information displayed should be accurate and functional",
      "Should not display individual farming rankings",
      "Extra points for creative/humorous implementations",
      "Bonus for incorporating Monad lore (monanimals, etc.)"
    ],
    tracks: [
      {
        name: "Track 1: Custom Frontends",
        description: "Build your own frontend showcasing blocks, transactions, activity, and more",
        prizes: [
          "1st place: 3000 Testnet MON",
          "2nd place: 2000 Testnet MON",
          "3rd place: 1000 Testnet MON",
          "Valid participation: 250 Testnet MON"
        ]
      },
      {
        name: "Track 2: Flipside Dashboards", 
        description: "Use Flipside to create dashboards displaying Monad Testnet insights",
        prizes: [
          "1st place: 3000 Testnet MON",
          "2nd place: 2000 Testnet MON",
          "Valid participation: 250 Testnet MON"
        ]
      }
    ],
    submission: "Submit via the official form",
    submissionForm: "https://tally.so/r/n9yK0Y",
    resources: ["https://github.com/monad-developers/protocols"]
  },
  {
    id: 5,
    title: "NFT Innovation Challenge",
    description: "Develop groundbreaking NFTs and create tools that address real problems. Focus on novel mechanics and unique implementations rather than basic collections.",
    deadline: "June 23 - July 7",
    status: "completed",
    rules: [
      "All submissions must be open source",
      "Teams of 2-3 people or individual participation allowed",
      "No basic PFP collections accepted",
      "NFT projects should be unique and innovative",
      "Collections/tools should not pursue financial gains",
      "Extra credit for completely novel approaches",
      "Bonus for incorporating Monad lore elements"
    ],
    tracks: [
      {
        name: "Track 1: NFTs",
        description: "Create NFTs with innovative mechanics (artist-dev pairing available)",
        prizes: [
          "1st place: 3000 Testnet MON",
          "2nd place: 2000 Testnet MON", 
          "3rd place: 1000 Testnet MON",
          "Quality participation: 250 Testnet MON"
        ]
      },
      {
        name: "Track 2: NFT Tooling",
        description: "Build NFT tools (no sniper bots or unfair advantage tools)",
        prizes: [
          "1st place: 3000 Testnet MON",
          "2nd place: 2000 Testnet MON",
          "3rd place: 1000 Testnet MON", 
          "Quality participation: 250 Testnet MON"
        ]
      }
    ],
    submission: "Submit via the official form",
    submissionForm: "https://tally.so/r/mDE6bX",
    resources: ["https://monad-foundation.notion.site/mission-5"]
  },
  {
    id: 6,
    title: "Multisynq Applications & Games",
    description: "Build innovative applications and games utilizing Multisynq technology. Create novel integrations that interact with Monad Testnet in creative ways.",
    deadline: "July 14 - July 27",
    status: "completed",
    rules: [
      "Project must be open source",
      "Must use Multisynq in an innovative way",
      "Must interact with Monad Testnet",
      "Extra points for creative and unconventional approaches"
    ],
    submission: "Submit via the official form",
    submissionForm: "https://tally.so/r/mBoPxY",
    prizes: [
      "1st place: 5000 Testnet MON",
      "2nd place: 4000 Testnet MON",
      "3rd place: 3000 Testnet MON",
      "4th place: 2000 Testnet MON",
      "5th place: 1000 Testnet MON",
      "Valid participation: 300 Testnet MON"
    ],
    resources: ["https://monad-foundation.notion.site/multisynq-resources"]
  },
    {
    id: 7,
    title: "Monad Game Jam",
    description: "Build games with a HUGE leaderboard intergrating Monad Games ID",
    deadline: "Aug 13 - Aug 31",
    status: "completed",
    rules: [
      "All submissions must be open source",
      "Properly intergrate Monad Games ID",
      "Teams of 2-3 people or individual participation allowed",
      "Do not build r/place clones",
      "Build games that are novel experiences"
    ],
    tracks: [
      {
        name: "Track 1: New Games",
        description: "Build New Games with Monad Games ID intergration",
        prizes: [
          "1st place: 4000 Testnet MON",
          "2nd place: 3000 Testnet MON", 
          "3rd place: 2000 Testnet MON",
          "Quality participation: 250 Testnet MON"
        ]
      },
      {
        name: "Track 2: Existing Games",
        description: "Intergrate Existing Games with Monad Games ID",
        prizes: [
          "1st place: 3000 Testnet MON",
          "2nd place: 2000 Testnet MON",
          "3rd place: 1000 Testnet MON", 
          "Quality participation: 250 Testnet MON"
        ]
      }
    ],
    submission: "Submit via the official form",
    submissionForm: " https://tally.so/r/wz6PDa",
    resources: ["https://monad-foundation.notion.site/Mission-7-Monad-Game-Jam-Resources-24d6367594f280268926d344bc82c67a"]
  }
];

const MonadMissions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Showcase
            </Link>
          </Button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Monad Missions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore all previous and ongoing missions designed to showcase innovation and creativity within the Monad ecosystem.
            </p>
          </div>

          {/* Missions Grid */}
          <div className="space-y-8">
            {missions.map((mission) => (
              <Card key={mission.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl">Mission {mission.id}</CardTitle>
                        <Badge 
                          variant={mission.status === 'ongoing' ? 'default' : 'secondary'}
                          className={mission.status === 'ongoing' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                        >
                          {mission.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-primary">{mission.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {mission.deadline}
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {mission.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Rules */}
                  {mission.rules && mission.rules.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Rules & Requirements
                      </h4>
                      <ul className="space-y-2">
                        {mission.rules.map((rule, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tracks */}
                  {mission.tracks && (
                    <div>
                      <h4 className="font-semibold mb-3">Competition Tracks</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {mission.tracks.map((track, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <h5 className="font-medium">{track.name}</h5>
                            <p className="text-sm text-muted-foreground">{track.description}</p>
                            {track.prizes && track.prizes.length > 0 && (
                              <div>
                                <h6 className="text-xs font-medium mb-2 flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  Prizes
                                </h6>
                                <ul className="space-y-1">
                                  {track.prizes.map((prize, prizeIndex) => (
                                    <li key={prizeIndex} className="text-xs text-muted-foreground">
                                      {prize}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prizes (for missions without tracks) */}
                  {mission.prizes && mission.prizes.length > 0 && !mission.tracks && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Prizes
                      </h4>
                      <ul className="space-y-2">
                        {mission.prizes.map((prize, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                            {prize}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources & Submission - Only show for ongoing missions */}
                  {mission.status === 'ongoing' && (
                    <div className="flex flex-wrap gap-4 pt-4 border-t">
                      {mission.submissionForm && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={mission.submissionForm} target="_blank" rel="noopener noreferrer">
                            Submission Form
                            <ExternalLink className="h-3 w-3 ml-2" />
                          </a>
                        </Button>
                      )}
                      {mission.resources && mission.resources.map((resource, index) => (
                        <Button key={index} variant="ghost" size="sm" asChild>
                          <a href={resource} target="_blank" rel="noopener noreferrer">
                            Resources
                            <ExternalLink className="h-3 w-3 ml-2" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MonadMissions;
