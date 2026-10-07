"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Download,
  Search,
  Eye,
  Loader2,
  Upload,
  FileUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface QuestionBank {
  id: string;
  name: string;
  description: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  status: "processing" | "ready" | "error";
  questionCount: number;
  category: string;
}

export default function RecruiterQuestionsPage() {
  const { user } = useAuth();
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: "",
    description: "",
    category: "Frontend",
    file: null as File | null
  });

  useEffect(() => {
    fetchQuestionBanks();
  }, []);

  const fetchQuestionBanks = async () => {
    try {
      const response = await fetch("/api/question-banks", { cache: 'no-store' });
      const data = await response.json();
      if (data.success) {
        setQuestionBanks(data.questionBanks);
      } else {
        toast({
          title: "Error",
          description: "Failed to load question banks",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching question banks:", error);
      toast({
        title: "Error",
        description: "Failed to load question banks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and select a file to upload.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", uploadData.file);
    formData.append("name", uploadData.name);
    formData.append("description", uploadData.description);
    formData.append("category", uploadData.category);
    if (user?.name) {
      formData.append("uploadedBy", user.name);
    }

    try {
      const response = await fetch("/api/question-banks", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Upload Successful",
          description: "Your question bank has been uploaded and recorded.",
        });
        setIsUploadOpen(false);
        setUploadData({ name: "", description: "", category: "Frontend", file: null });
        fetchQuestionBanks();
      } else {
        toast({
          title: "Upload Failed",
          description: data.error || "Failed to upload question bank",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred during upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const filteredQuestionBanks = questionBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || bank.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: QuestionBank["status"]) => {
    switch (status) {
      case "ready":
        return <Badge variant="default" className="bg-green-100 text-green-800">Ready</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Question Bank</h1>
            <p className="text-muted-foreground">
              Browse and use question banks for creating assessments
            </p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleUpload}>
                <DialogHeader>
                  <DialogTitle>Upload Question Bank</DialogTitle>
                  <DialogDescription>
                    Upload a PDF, Word, or Text document to generate questions.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Bank Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Python Backend Core"
                      value={uploadData.name}
                      onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={uploadData.category}
                      onValueChange={(v) => setUploadData({ ...uploadData, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief details about these questions..."
                      value={uploadData.description}
                      onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Document File</Label>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors",
                        uploadData.file ? "border-primary bg-primary/5" : "border-border"
                      )}
                      onClick={() => document.getElementById("file-upload")?.click()}
                    >
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setUploadData({ ...uploadData, file });
                        }}
                      />
                      {uploadData.file ? (
                        <>
                          <FileUp className="h-8 w-8 text-primary" />
                          <p className="text-sm font-medium">{uploadData.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(uploadData.file.size / 1024 / 1024).toFixed(2)} MB • Click to change
                          </p>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, or TXT (Max 10MB)</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUploadOpen(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading || !uploadData.file}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Start Processing"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Question Bank Library</CardTitle>
              <CardDescription>
                Browse available question banks for different categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search question banks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Data Science">Data Science</option>
                  <option value="DevOps">DevOps</option>
                </select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground mt-2">Loading question banks...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredQuestionBanks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium">No question banks found</p>
                        <p className="text-sm text-muted-foreground">
                          No question banks match your search criteria
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestionBanks.map((bank) => (
                      <TableRow key={bank.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{bank.name}</div>
                            <div className="text-sm text-muted-foreground">{bank.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{bank.category}</Badge>
                        </TableCell>
                        <TableCell>{bank.questionCount}</TableCell>
                        <TableCell>{getStatusBadge(bank.status)}</TableCell>
                        <TableCell>{bank.uploadDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" disabled={bank.status !== "ready"}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" disabled={bank.status !== "ready"}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}