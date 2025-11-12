import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Save, 
  RefreshCw,
  User,
  Brain,
  Sparkles,
  MessageCircle,
  TestTube
} from "lucide-react";
import avatarImage from "@/assets/digital-twin-avatar.png";

const PersonalityPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Default profile configuration
  const getDefaultProfile = () => ({
    name: user?.twinName || "My Digital Twin",
    bio: "A helpful AI assistant that represents me",
    personality: {
      creativity: 75,
      formality: 40,
      enthusiasm: 80,
      empathy: 90
    },
    preferences: {
      voiceEnabled: true,
      learningMode: true,
      emotionalResponses: true,
      proactiveHelp: false
    },
    communicationStyle: "friendly"
  });

  // Initialize profile from localStorage or defaults
  const getInitialProfile = () => {
    const savedProfile = localStorage.getItem('digitalTwinProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        console.log('Loaded saved profile:', parsed);
        return parsed;
      } catch (error) {
        console.error('Failed to parse saved profile:', error);
        return getDefaultProfile();
      }
    }
    return getDefaultProfile();
  };

  const [profile, setProfile] = useState(getInitialProfile);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isSaved, setIsSaved] = useState(false);


  const personalityTraits = [
    { 
      key: 'creativity', 
      label: 'Creativity', 
      description: 'How imaginative and creative your twin\'s responses are',
      lowLabel: 'Practical',
      highLabel: 'Creative'
    },
    { 
      key: 'formality', 
      label: 'Formality', 
      description: 'Professional vs casual communication style',
      lowLabel: 'Casual',
      highLabel: 'Formal'
    },
    { 
      key: 'enthusiasm', 
      label: 'Enthusiasm', 
      description: 'Energy level in conversations',
      lowLabel: 'Calm',
      highLabel: 'Energetic'
    },
    { 
      key: 'empathy', 
      label: 'Empathy', 
      description: 'Emotional understanding and supportive responses',
      lowLabel: 'Direct',
      highLabel: 'Empathetic'
    }
  ];

  const handlePersonalityChange = (key: string, value: number[]) => {
    setProfile(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        [key]: value[0]
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

  const handleTestPersonality = () => {
    // Mock response based on personality traits
    const { creativity, formality, enthusiasm, empathy } = profile.personality;
    
    let response = "";
    
    if (formality > 70) {
      response = "Greetings. I would be delighted to assist you with your inquiry. ";
    } else if (formality > 40) {
      response = "Hello! I'd be happy to help you with that. ";
    } else {
      response = "Hey! Sure thing, I can help! ";
    }

    if (enthusiasm > 70) {
      response += "I'm really excited to work with you on this! ";
    } else if (enthusiasm > 40) {
      response += "Let me see what I can do. ";
    } else {
      response += "Let me take a look. ";
    }

    if (empathy > 70) {
      response += "I understand this is important to you, and I'm here to support you every step of the way.";
    } else if (empathy > 40) {
      response += "I'll make sure to address your concerns.";
    } else {
      response += "Here's what we'll do.";
    }

    setTestResponse(response);
  };

  const handleSave = () => {
    // In a real app, save to backend/database
    console.log('Saving profile:', profile);
    localStorage.setItem('digitalTwinProfile', JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

//   const handleReset = () => {
//     setProfile({
//       name: user?.twinName || "My Digital Twin",
//       bio: "A helpful AI assistant that represents me",
//       personality: {
//         creativity: 75,
//         formality: 40,
//         enthusiasm: 80,
//         empathy: 90
//       },
//       preferences: {
//         voiceEnabled: true,
//         learningMode: true,
//         emotionalResponses: true,
//         proactiveHelp: false
//       },
//       communicationStyle: "friendly"
//     });
//   };
    const handleReset = () => {
        const defaultProfile = getDefaultProfile();
        setProfile(defaultProfile);
        localStorage.removeItem('digitalTwinProfile'); // Clear saved data
    };

  const getPersonalityDescription = () => {
    const { creativity, formality, enthusiasm, empathy } = profile.personality;
    
    let desc = "Your digital twin is ";
    
    if (creativity > 70) desc += "highly creative and imaginative, ";
    else if (creativity > 40) desc += "balanced and practical, ";
    else desc += "straightforward and logical, ";
    
    if (formality > 70) desc += "very professional and formal, ";
    else if (formality > 40) desc += "casually professional, ";
    else desc += "friendly and casual, ";
    
    if (enthusiasm > 70) desc += "extremely enthusiastic, ";
    else if (enthusiasm > 40) desc += "moderately energetic, ";
    else desc += "calm and composed, ";
    
    if (empathy > 70) desc += "and deeply empathetic.";
    else if (empathy > 40) desc += "and reasonably supportive.";
    else desc += "and solution-focused.";
    
    return desc;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Customize Your Digital Twin</h1>
              <p className="text-muted-foreground text-sm">
                Shape your AI's personality and behavior
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary">
              <Save className="mr-2 h-4 w-4" />
              {isSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar Card */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Twin Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <img 
                      src={avatarImage} 
                      alt="Digital Twin Avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-purple-200"
                    />
                    <Button 
                      size="icon" 
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twinName">Twin Name</Label>
                  <Input
                    id="twinName"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="My Digital Twin"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Describe your digital twin..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Personality Summary */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5" />
                  Personality Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {getPersonalityDescription()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Personality Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personality Traits */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Personality Traits
                </CardTitle>
                <CardDescription>
                  Adjust these sliders to shape your twin's communication style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {personalityTraits.map((trait) => (
                  <div key={trait.key} className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Label className="font-medium text-base">{trait.label}</Label>
                        <p className="text-sm text-muted-foreground mt-1">{trait.description}</p>
                      </div>
                      <span className="text-lg font-bold text-primary min-w-[60px] text-right">
                        {profile.personality[trait.key as keyof typeof profile.personality]}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <Slider
                        value={[profile.personality[trait.key as keyof typeof profile.personality]]}
                        onValueChange={(value) => handlePersonalityChange(trait.key, value)}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{trait.lowLabel}</span>
                        <span>{trait.highLabel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Preferences & Behavior
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label className="font-medium">Voice Interactions</Label>
                    <p className="text-sm text-muted-foreground">Enable voice input and responses</p>
                  </div>
                  <Switch 
                    checked={profile.preferences.voiceEnabled}
                    onCheckedChange={(value) => handlePreferenceChange('voiceEnabled', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label className="font-medium">Continuous Learning</Label>
                    <p className="text-sm text-muted-foreground">Learn from conversations to improve</p>
                  </div>
                  <Switch 
                    checked={profile.preferences.learningMode}
                    onCheckedChange={(value) => handlePreferenceChange('learningMode', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label className="font-medium">Emotional Responses</Label>
                    <p className="text-sm text-muted-foreground">Use emojis and emotional language</p>
                  </div>
                  <Switch 
                    checked={profile.preferences.emotionalResponses}
                    onCheckedChange={(value) => handlePreferenceChange('emotionalResponses', value)}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="space-y-1">
                    <Label className="font-medium">Proactive Help</Label>
                    <p className="text-sm text-muted-foreground">Suggest actions and recommendations</p>
                  </div>
                  <Switch 
                    checked={profile.preferences.proactiveHelp}
                    onCheckedChange={(value) => handlePreferenceChange('proactiveHelp', value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Test Personality */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test Your Twin's Personality
                </CardTitle>
                <CardDescription>
                  See how your twin would respond with current settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Enter a test message</Label>
                  <Input
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="e.g., Can you help me with something?"
                  />
                </div>
                <Button 
                  onClick={handleTestPersonality}
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Generate Sample Response
                </Button>
                {testResponse && (
                  <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm font-medium mb-1">Sample Response:</p>
                    <p className="text-sm text-muted-foreground italic">"{testResponse}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityPage;