"use client";
import "@/app/style.css";
import { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Cog,
    Bell,
    LogOut,
    Users,
    School,
    Eye,
    EyeOff,
    Trash2,
    Edit,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

// Fetcher function for useSWR
const fetcher = async (url, token) => {
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const error = new Error("An error occurred while fetching the data.");
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
};

export default function ParentProfile() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");
    const [showPassword, setShowPassword] = useState(false);

    // State for inline editing of a child
    const [editingChildId, setEditingChildId] = useState(null);
    const [editingChildData, setEditingChildData] = useState({});

    const token = Cookies.get("accessToken");

    // SWR Fetch for Parent Profile
    const { data: userData, error: userError } = useSWR(
        [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/`, token],
        ([url, token]) => fetcher(url, token),
    );

    // SWR Fetch for Student List
    const studentListKey = token
        ? [`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/`, token]
        : null;
    const { data: studentsData, error: studentsError } = useSWR(studentListKey, ([url, token]) =>
        fetcher(url, token),
    );

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
        avatar: "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
    });

    // Effect to update profile state when userData is fetched
    useEffect(() => {
        if (userData) {
            setProfile({
                firstName: userData.username || "Sarah",
                lastName: userData.last_name || "Johnson",
                email: userData.email || "sarah.johnson@example.com",
                phone: userData.phone || "(555) 123-4567",
                address: userData.address || "123 Main Street, Anytown, CA 90210",
                notes: userData.notes || "",
                avatar:
                    userData.avatar ||
                    "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=",
            });
        }
    }, [userData]);

    const notifications = [
        {
            id: 1,
            title: "School Concert",
            date: "May 25, 2025",
            message: "Annual spring concert at 6:00 PM in the auditorium.",
        },
        {
            id: 2,
            title: "Parent-Teacher Conference",
            date: "June 3, 2025",
            message: "Schedule your meeting with Emma's teacher.",
        },
        {
            id: 3,
            title: "Field Trip Permission",
            date: "May 27, 2025",
            message: "Jake's class field trip to the science museum needs your approval.",
        },
    ];

    // Function to handle profile updates
    const handleUpdateProfile = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/edit/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    first_name: profile.firstName,
                    last_name: profile.lastName,
                    email: profile.email,
                    phone: profile.phone,
                    address: profile.address,
                    notes: profile.notes,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Profile updated successfully!");
                mutate([`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/`, token]);
            } else {
                toast.error(data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Something went wrong!");
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                Cookies.remove("accessToken");
                Cookies.remove("userData");
                router.push("/login");
            } else {
                alert(data.message || "Logout failed!");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong!");
        }
    };

    const handleDeleteChild = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student's profile?")) {
            return;
        }
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/delete/${studentId}/`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (res.ok) {
                toast.success("Student profile deleted successfully!");
                mutate(studentListKey);
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to delete student.");
            }
        } catch (error) {
            console.error("Delete student error:", error);
            toast.error("Something went wrong!");
        }
    };

    const handleEditClick = (child) => {
        setEditingChildId(child.id);
        setEditingChildData({
            name: child.name,
            grade: child.grade,
            teacher: child.teacher,
            absences: child.absences,
        });
    };

    const handleUpdateChild = async (studentId) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/students/update/${studentId}/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingChildData),
                },
            );

            if (res.ok) {
                toast.success("Student details updated successfully!");
                setEditingChildId(null);
                mutate(studentListKey);
            } else {
                const data = await res.json();
                toast.error(data.message || "Failed to update details.");
            }
        } catch (error) {
            console.error("Update student error:", error);
            toast.error("Something went wrong!");
        }
    };

    if (userError) return <div>Failed to load profile.</div>;
    if (!userData) return <div>Loading...</div>;

    return (
        <>
            <Toaster position="top-right" richColors />
            <main className="parentprofile bg-[#fcf7ee] p-8">
                <div className="mx-auto grid max-w-screen-2xl gap-6 lg:grid-cols-4">
                    <Card className="parentsidebar sticky top-6 h-fit rounded-2xl border-2 border-[#fc800a] shadow-md">
                        <CardHeader className="flex flex-col items-center">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    src={profile.avatar}
                                    alt={`${profile.firstName} ${profile.lastName}`}
                                />
                                <AvatarFallback>
                                    {profile.firstName ? profile.firstName[0] : "U"}
                                    {profile.lastName ? profile.lastName[0] : ""}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="sidebarheader mt-4 text-lg font-bold">
                                {profile.firstName} {profile.lastName}
                            </CardTitle>
                            <CardDescription className="text-center font-medium">
                                Parent
                            </CardDescription>
                            <Badge className="mt-2" variant="outline">
                                Verified
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {["profile", "children", "notifications", "settings"].map((tab) => (
                                    <Button
                                        key={tab}
                                        variant="ghost"
                                        className={`w-full justify-start rounded-md font-medium capitalize ${
                                            activeTab === tab
                                                ? "bg-[#fc800a] text-white hover:bg-[#e97100]"
                                                : "text-gray-700 hover:bg-[#fc800a]/10"
                                        }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab === "profile" && <User className="mr-2 h-4 w-4" />}
                                        {tab === "children" && <Users className="mr-2 h-4 w-4" />}
                                        {tab === "notifications" && (
                                            <Bell className="mr-2 h-4 w-4" />
                                        )}
                                        {tab === "settings" && <Cog className="mr-2 h-4 w-4" />}
                                        {tab}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="w-full border-[#fc800a] font-semibold text-[#fc800a] hover:bg-[#fc800a]/10"
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Sign Out
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="parentmain lg:col-span-3">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-4 grid grid-cols-4">
                                <TabsTrigger value="profile" className="font-bold">
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger value="children" className="font-bold">
                                    Children
                                </TabsTrigger>
                                <TabsTrigger value="notifications" className="font-bold">
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger value="settings" className="font-bold">
                                    Settings
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="profile">
                                <Card className="rounded-xl border border-[#fc800a]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold">
                                            Personal Information
                                        </CardTitle>
                                        <CardDescription className="font-medium">
                                            Manage your personal details and contact information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 px-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="first" className="font-bold">
                                                First Name
                                            </Label>
                                            <Input
                                                id="first"
                                                value={profile.firstName}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        firstName: e.target.value,
                                                    })
                                                }
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last" className="font-bold">
                                                Last Name
                                            </Label>
                                            <Input
                                                id="last"
                                                value={profile.lastName}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        lastName: e.target.value,
                                                    })
                                                }
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="font-bold">
                                                Email Address
                                            </Label>
                                            <Input
                                                id="email"
                                                value={profile.email}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="font-bold">
                                                Phone Number
                                            </Label>
                                            <Input
                                                id="phone"
                                                value={profile.phone}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="address" className="font-bold">
                                                Home Address
                                            </Label>
                                            <Input
                                                id="address"
                                                value={profile.address}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        address: e.target.value,
                                                    })
                                                }
                                                className="font-medium"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-2">
                                            <Label htmlFor="notes" className="font-bold">
                                                Additional Notes
                                            </Label>
                                            <Textarea
                                                id="notes"
                                                value={profile.notes}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        notes: e.target.value,
                                                    })
                                                }
                                                className="min-h-20 font-medium"
                                                placeholder="Any additional information you'd like to share..."
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end gap-3 px-6 py-4">
                                        <Button variant="outline" className="px-6 font-semibold">
                                            Cancel
                                        </Button>
                                        <Button
                                            className="rounded-lg bg-[#fc800a] px-6 py-2 font-semibold text-white hover:bg-[#e97100]"
                                            onClick={handleUpdateProfile}
                                        >
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>

                            <TabsContent value="children">
                                <Card className="rounded-xl border border-[#fc800a]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold">
                                            Your Children
                                        </CardTitle>
                                        <CardDescription className="font-medium">
                                            View and manage your children's information
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-6">
                                        {studentsError && (
                                            <div>Failed to load children's data.</div>
                                        )}
                                        {!studentsData && !studentsError && (
                                            <div>Loading children...</div>
                                        )}

                                        {studentsData &&
                                            studentsData.map((child) => (
                                                <Card
                                                    key={child.id}
                                                    className="children-card bg-muted rounded-lg border border-[#fc800a]"
                                                >
                                                    <CardContent className="p-4">
                                                        {editingChildId === child.id ? (
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <Input
                                                                        value={
                                                                            editingChildData.full_name
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditingChildData({
                                                                                ...editingChildData,
                                                                                name: e.target
                                                                                    .value,
                                                                            })
                                                                        }
                                                                        placeholder="Full Name"
                                                                    />
                                                                    <Input
                                                                        value={
                                                                            editingChildData.grade
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditingChildData({
                                                                                ...editingChildData,
                                                                                grade: e.target
                                                                                    .value,
                                                                            })
                                                                        }
                                                                        placeholder="Grade"
                                                                    />
                                                                    <Input
                                                                        value={
                                                                            editingChildData.teacher
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditingChildData({
                                                                                ...editingChildData,
                                                                                teacher:
                                                                                    e.target.value,
                                                                            })
                                                                        }
                                                                        placeholder="Teacher"
                                                                    />
                                                                    <Input
                                                                        type="number"
                                                                        value={
                                                                            editingChildData.absences
                                                                        }
                                                                        onChange={(e) =>
                                                                            setEditingChildData({
                                                                                ...editingChildData,
                                                                                absences:
                                                                                    e.target.value,
                                                                            })
                                                                        }
                                                                        placeholder="Absences"
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        onClick={() =>
                                                                            setEditingChildId(null)
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </Button>
                                                                    <Button
                                                                        className="bg-[#fc800a] hover:bg-[#e97100]"
                                                                        onClick={() =>
                                                                            handleUpdateChild(
                                                                                child.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        Save
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-4">
                                                                <Avatar className="h-16 w-16">
                                                                    <AvatarImage
                                                                        src={
                                                                            child.image ||
                                                                            "/api/placeholder/100/100"
                                                                        }
                                                                        alt={child.name}
                                                                    />
                                                                    <AvatarFallback className="text-lg font-bold">
                                                                        {child.name
                                                                            ? child.name
                                                                                  .split(" ")
                                                                                  .map((n) => n[0])
                                                                            : "NN"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 space-y-1">
                                                                    <h3 className="text-lg font-bold">
                                                                        {child.full_name}
                                                                    </h3>
                                                                    <p className="text-muted-foreground text-sm font-medium">
                                                                        <span className="font-semibold">
                                                                            Grade:
                                                                        </span>{" "}
                                                                        {child.grade || "N/A"} |
                                                                        <span className="font-semibold">
                                                                            {" "}
                                                                            Teacher:
                                                                        </span>{" "}
                                                                        {child.teacher || "N/A"} |
                                                                        <span className="font-semibold">
                                                                            {" "}
                                                                            Absences:
                                                                        </span>{" "}
                                                                        {child.absences || 0}
                                                                    </p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                                                        onClick={() =>
                                                                            handleEditClick(child)
                                                                        }
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                                                        onClick={() =>
                                                                            handleDeleteChild(
                                                                                child.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}

                                        <div className="pt-2">
                                            <Link href="/parent/add-child">
                                                <Button
                                                    variant="outline"
                                                    className="border-[#fc800a] px-6 font-semibold text-[#fc800a] hover:bg-[#fc800a]/10"
                                                >
                                                    + Add Another Child
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications">
                                <Card className="rounded-xl border border-[#fc800a]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold">
                                            Recent Notifications
                                        </CardTitle>
                                        <CardDescription className="font-medium">
                                            Stay up to date with important school events and
                                            announcements
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4 px-6">
                                        {notifications.map((note) => (
                                            <Alert
                                                key={note.id}
                                                className="notification-alert border-l-4 border-[#fc800a] bg-orange-50"
                                            >
                                                <Calendar className="h-5 w-5 text-[#fc800a]" />
                                                <AlertTitle className="text-lg font-bold">
                                                    {note.title}
                                                </AlertTitle>
                                                <AlertDescription className="mt-1 font-medium text-gray-700">
                                                    <span className="font-semibold text-[#fc800a]">
                                                        {note.date}
                                                    </span>{" "}
                                                    - {note.message}
                                                </AlertDescription>
                                            </Alert>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings">
                                <Card className="rounded-xl border border-[#fc800a]">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl font-bold">
                                            Account Settings
                                        </CardTitle>
                                        <CardDescription className="font-medium">
                                            Adjust your preferences and security settings
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="settings-section space-y-6 px-6">
                                        <div className="settings-item space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <Label className="text-base font-bold">
                                                        Email Notifications
                                                    </Label>
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Receive updates via email
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                        <div className="settings-item space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <Label className="text-base font-bold">
                                                        SMS Notifications
                                                    </Label>
                                                    <p className="text-muted-foreground text-sm font-medium">
                                                        Get text message alerts
                                                    </p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                        <Separator className="my-6" />
                                        <div className="space-y-3">
                                            <Label className="text-base font-bold">
                                                Change Password
                                            </Label>
                                            <div className="password-container relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    defaultValue="123456"
                                                    className="pr-12 font-medium"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="password-toggle absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-end px-6 py-4">
                                        <Button
                                            className="rounded-lg bg-[#fc800a] px-6 py-2 font-semibold text-white hover:bg-[#e97100]"
                                            onClick={() =>
                                                toast.success("Settings updated successfully!")
                                            }
                                        >
                                            Update Settings
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </>
    );
}
