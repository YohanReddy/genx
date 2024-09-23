"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Image, Loader2, Video } from "lucide-react";
import { Client } from "@gradio/client";

export default function ContentGeneratorComponent() {
  const [activeTab, setActiveTab] = useState("image");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realistic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGeneratedContent(null);

    try {
      if (activeTab === "image") {
        const client = await Client.connect("black-forest-labs/FLUX.1-schnell");
        const result = await client.predict("/infer", {
          prompt: prompt,
          seed: 0,
          randomize_seed: true,
          width: 1920,
          height: 1080,
          num_inference_steps: 4,
        });

        const imageUrl = (result.data as { url: string }[])[0].url; // This assumes `result.data` contains an array with objects having the `url` property.
        setGeneratedContent(imageUrl);
      } else {
        // Simulating API call with setTimeout for video generation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const data = {
          url: "https://videos.pexels.com/video-files/6153453/6153453-uhd_2732_1440_25fps.mp4",
        };
        setGeneratedContent(data.url);
      }
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">AI Content Generator</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image">
            <Image className="mr-2 h-4 w-4" />
            Image
          </TabsTrigger>
          <TabsTrigger value="video">
            <Video className="mr-2 h-4 w-4" />
            Video
          </TabsTrigger>
        </TabsList>
        <TabsContent value="image" className="mt-4">
          <p className="text-sm text-muted-foreground">Generate stunning images with AI</p>
        </TabsContent>
        <TabsContent value="video" className="mt-4">
          <p className="text-sm text-muted-foreground">Create amazing videos using AI technology</p>
        </TabsContent>
      </Tabs>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            placeholder="Describe the image or video you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Style</Label>
          <RadioGroup value={style} onValueChange={setStyle} className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realistic" id="realistic" />
              <Label htmlFor="realistic">Realistic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cartoon" id="cartoon" />
              <Label htmlFor="cartoon">Cartoon</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="abstract" id="abstract" />
              <Label htmlFor="abstract">Abstract</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate {activeTab === "image" ? "Image" : "Video"}
        </Button>
      </form>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {generatedContent && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Generated Content</h2>
          {activeTab === "image" ? (
            <img src={generatedContent} alt="Generated content" className="w-full h-auto rounded-lg shadow-lg" />
          ) : (
            <video src={generatedContent} controls className="w-full h-auto rounded-lg shadow-lg">
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}
    </div>
  );
}