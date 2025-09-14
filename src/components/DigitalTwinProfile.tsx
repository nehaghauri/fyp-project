import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Save, 
  RefreshCw,
  User,
  Brain,
  Mic,
  Palette,
  Shield,
  Download
} from "lucide-react";
import avatarImage from "@/assets/digital-twin-avatar.png";

interface DigitalTwinProfileProps {
  onBack: () => void;
}

const DigitalTwinProfile = ({ onBack }: DigitalTwinProfileProps) => {
  const [profile, setProfile] = useState({
    name: "Alex Digital Twin",
    personality: {
      creativity: [75],
      formality: [40],
      enthusiasm: [80],
      empathy: [90]
    },
    preferences: {
      voiceEnabled: true,
      learningMode: true,
      brandCollaboration: true,
      dataSharing: false
    }
  });

  const personalityTraits = [
    { key: 'creativity', label: 'Creativity', description: 'How creative your responses are' },
    { key: 'formality', label: 'Formality', description: 'Professional vs casual tone' },
    { key: 'enthusiasm', label: 'Enthusiasm', description: 'Energy level in conversations' },
    { key: 'empathy', label: 'Empathy', description: 'Emotional understanding and response' }
  ];

  const handlePersonalityChange = (key: string, value: number[]) => {
    setProfile(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [key]: value
      }
    }));
  };

  const handlePreferenceChange = (key: string, value: boolean) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Save profile logic would be implemented here
    console.log('Saving profile:', profile);
  };

  return (
    <div className="min-h-screen bg-gradient-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Digital Twin Profile</h1>
            <p className="text-muted-foreground">Customize your AI personality and preferences</p>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-gradient-primary">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        {/* Avatar Section */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Digital Twin Avatar</span>
            </CardTitle>
            <CardDescription>
              Your AI representation and identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img 
                  src={avatarImage} 
                  alt="Digital Twin Avatar"
                  className="w-24 h-24 rounded-full object-cover glow-effect"
                />
                <Button 
                  size="icon" 
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="twinName">Twin Name</Label>
                  <Input 
                    id="twinName"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-input/50 border-border/50"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Palette className="mr-2 h-4 w-4" />
                  Customize Appearance
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality Traits */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Personality Traits</span>
            </CardTitle>
            <CardDescription>
              Fine-tune your digital twin's personality characteristics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {personalityTraits.map((trait) => (
              <div key={trait.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="font-medium">{trait.label}</Label>
                    <p className="text-sm text-muted-foreground">{trait.description}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {profile.personality[trait.key as keyof typeof profile.personality][0]}%
                  </span>
                </div>
                <Slider
                  value={profile.personality[trait.key as keyof typeof profile.personality]}
                  onValueChange={(value) => handlePersonalityChange(trait.key, value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Preferences & Privacy</span>
            </CardTitle>
            <CardDescription>
              Control how your digital twin learns and interacts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Voice Interactions</Label>
                  <p className="text-sm text-muted-foreground">Enable voice input and responses</p>
                </div>
                <Switch 
                  checked={profile.preferences.voiceEnabled}
                  onCheckedChange={(value) => handlePreferenceChange('voiceEnabled', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Continuous Learning</Label>
                  <p className="text-sm text-muted-foreground">Allow your twin to learn from conversations</p>
                </div>
                <Switch 
                  checked={profile.preferences.learningMode}
                  onCheckedChange={(value) => handlePreferenceChange('learningMode', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Brand Collaboration</Label>
                  <p className="text-sm text-muted-foreground">Enable brand partnership suggestions</p>
                </div>
                <Switch 
                  checked={profile.preferences.brandCollaboration}
                  onCheckedChange={(value) => handlePreferenceChange('brandCollaboration', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-medium">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share anonymized insights with partners</p>
                </div>
                <Switch 
                  checked={profile.preferences.dataSharing}
                  onCheckedChange={(value) => handlePreferenceChange('dataSharing', value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/30">
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Twin Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalTwinProfile;