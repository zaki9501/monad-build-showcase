import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const initialForm = {
  name: "",
  description: "",
  xUsername: "",
  discord: "",
  mission: "",
  tags: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
};

const Hero = () => {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/30 to-primary-glow/20 py-20 lg:py-32">
      {/* Background Image */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-background/90" />
      <div className="container relative px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Community Builds on Monad
          </div>
          {/* Main Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl mb-6">
            Discover{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Community Builds
            </span>{" "}
            on Monad
          </h1>
          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
            Explore innovative projects built by the Monad community during missions. 
            From DeFi protocols to NFT platforms, discover what builders are creating 
            on the fastest EVM blockchain.
          </p>
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-dark hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Explore Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                >
                  Submit Your Build
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Your Build</DialogTitle>
                  <DialogDescription>
                    Share your Monad project with the community! Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <div className="font-semibold mb-1">Thank you for your submission!</div>
                    <div className="text-muted-foreground text-sm">We'll review your project soon.</div>
                  </div>
                ) : (
                  <form
                    action="https://formspree.io/f/xanbwlry"
                    method="POST"
                    className="space-y-4"
                    onSubmit={() => setSubmitted(true)}
                  >
                    <input type="hidden" name="_replyto" value="Pikidevs@gmail.com" />
                    <Input
                      name="name"
                      placeholder="Project Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                    <Textarea
                      name="description"
                      placeholder="Project Description"
                      value={form.description}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="xUsername"
                      placeholder="Builder X (Twitter) Username"
                      value={form.xUsername}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="discord"
                      placeholder="Discord Username (optional)"
                      value={form.discord}
                      onChange={handleChange}
                    />
                    <Input
                      name="mission"
                      placeholder="Mission (e.g. Mission 4)"
                      value={form.mission}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="tags"
                      placeholder="Tags (comma separated)"
                      value={form.tags}
                      onChange={handleChange}
                    />
                    <Input
                      name="githubUrl"
                      placeholder="GitHub URL"
                      value={form.githubUrl}
                      onChange={handleChange}
                    />
                    <Input
                      name="liveUrl"
                      placeholder="Live URL"
                      value={form.liveUrl}
                      onChange={handleChange}
                    />
                    <Input
                      name="imageUrl"
                      placeholder="Image URL (optional)"
                      value={form.imageUrl}
                      onChange={handleChange}
                    />
                    <DialogFooter>
                      <Button type="submit" className="w-full">Submit</Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost" className="w-full" onClick={() => setForm(initialForm)}>Cancel</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">14</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">14</div>
              <div className="text-sm text-muted-foreground">Builders</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">5</div>
              <div className="text-sm text-muted-foreground">Missions</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;