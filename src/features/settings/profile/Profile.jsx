import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {useUser} from "@/hooks/useUser.js";


export default function ProfilePage() {

  const { data: user } = useUser();

  // Handle form submission for personal info
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    // Handle saving personal info (not implemented here)
    alert("Save personal info functionality not implemented yet");
  };



  return (
      <div className="container mx-auto py-6 space-y-8">
        <div className="flex">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>


        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal information and how others see you on the
              platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-24 h-24">
                  <AvatarImage
                      src={"/placeholder.svg?height=96&width=96"}
                      alt="Profile"
                  />
                  <AvatarFallback>{user?.firstName?.[0] || ""}{user?.lastName?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="grid gap-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" defaultValue={user?.firstName || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" defaultValue={user?.lastName || ""} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+20 109 171 42 32" defaultValue={user?.phone || ""} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself"
                  className="min-h-[120px]"
                  defaultValue={user?.role || ""}
              />
              <p className="text-sm text-muted-foreground">
                This will be displayed on your profile
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSavePersonalInfo}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
  );
}