import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Camera, Shield, Bell, Palette } from "lucide-react";

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState("account");

    const handleSave = (section) => {
        toast.success(`Your ${section} settings have been updated successfully.`);
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1">
                    <TabsTrigger value="account" className="data-[state=active]:bg-background">Account</TabsTrigger>
                    <TabsTrigger value="appearance" className="data-[state=active]:bg-background">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-background">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-background">Security</TabsTrigger>
                </TabsList>

                {/* Account Tab */}
                <TabsContent value="account" className="space-y-6">
                    {/* Profile Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Camera className="h-5 w-5" />
                                Profile
                            </CardTitle>
                            <CardDescription>Update your personal information and profile picture.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/placeholder.svg" alt="Profile Picture" />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">Profile Picture</h4>
                                    <p className="text-sm text-muted-foreground">JPG, GIF or PNG. Max size of 3MB.</p>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">Upload</Button>
                                        <Button size="sm" variant="outline">Remove</Button>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" defaultValue="Admin" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" defaultValue="User" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" defaultValue="admin@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input id="role" readOnly value="Administrator" disabled />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => handleSave("profile")}>Save Changes</Button>
                        </CardFooter>
                    </Card>

                    {/* Company Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Update company details shown on official communications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="companyName">Company Name</Label>
                                    <Input id="companyName" defaultValue="HireAI Evolve" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" type="url" defaultValue="https://hireai.example.com" />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" defaultValue="123 Recruitment St, San Francisco, CA 94107" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => handleSave("company")}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" />
                                Appearance
                            </CardTitle>
                            <CardDescription>Customize the appearance of the dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Enable dark mode for the admin dashboard.</p>
                                    </div>
                                    <Switch id="theme" />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-base">Compact Mode</Label>
                                        <p className="text-sm text-muted-foreground">Use compact spacing for tables and cards.</p>
                                    </div>
                                    <Switch id="density" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => handleSave("appearance")}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription>Configure when and how you receive notifications.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email." },
                                { id: "newUsers", label: "New Users", desc: "Notify when new users register." },
                                { id: "jobApplications", label: "Job Applications", desc: "Notify for new job applications." },
                                { id: "securityAlerts", label: "Security Alerts", desc: "Receive security-related notifications." },
                            ].map((item) => (
                                <div key={item.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">{item.label}</Label>
                                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                                        </div>
                                        <Switch id={item.id} defaultChecked />
                                    </div>
                                    <Separator />
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => handleSave("notifications")}>Save Preferences</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security Settings
                            </CardTitle>
                            <CardDescription>Update your password and security preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">Current Password</Label>
                                    <Input id="currentPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input id="newPassword" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" type="password" />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={() => handleSave("security")}>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
