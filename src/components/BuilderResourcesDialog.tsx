
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExternalLink, Github, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuilderResourcesDialogProps {
  children: React.ReactNode;
}

const BuilderResourcesDialog = ({ children }: BuilderResourcesDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Builder Resources
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Community Resources</h4>
              <p className="text-sm text-muted-foreground">
                A repository of various resources for Web3 development suggested by the community. 
                Resources supporting the Monad Office Hours Workshops can also be found here.
              </p>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <a 
                  href="https://github.com/monad-developers/community-resources" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Community Resources Repository
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Official Documentation</h4>
              <p className="text-sm text-muted-foreground">
                Complete developer documentation for building on Monad.
              </p>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                asChild
              >
                <a 
                  href="https://docs.monad.xyz/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Monad Documentation
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuilderResourcesDialog;
