import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scale, UserIcon, HistoryIcon, LogOutIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";
import { useLogout } from "@/hooks/useLogout";
import { useAuthContext } from "@/hooks/useAuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const handlelogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <header className="flex  items-center  px-2 lg:px-2 h-12 pt-6">
      <Link className="flex justify-center items-center cursor-pointer" to="/">
        <Scale className="w-6 h-6" />
      </Link>
      <nav className="flex gap-4 sm:gap-6 ml-auto font-medium text-sm mx-4">
        <Link className="underline-offset-4 hover:underline transition hover:duration-200 cursor-pointer ease-in-out hidden sm:block" to="/search">
          Search Engine
        </Link>
        <Link className="underline-offset-4 hover:underline transition hover:duration-200 cursor-pointer ease-in-out hidden sm:block" to="/chatbot">
          Chatbot
        </Link>
        <Link className=" underline-offset-4 hover:underline transition hover:duration-200 cursor-pointer ease-in-out hidden sm:block" to="/aboutus">
          About Us!
        </Link>
      </nav>
      {user && (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>
                  <UserIcon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Profile</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>
                    <UserIcon className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">Jane Doe</h2>
                  <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Chat History</h3>
                <ScrollArea className="h-[200px]">
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2 text-sm">
                      <HistoryIcon className="w-4 h-4" />
                      <span>Personal Injury Case - 2 days ago</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                      <HistoryIcon className="w-4 h-4" />
                      <span>Property Dispute - 1 week ago</span>
                    </li>
                    <li className="flex items-center space-x-2 text-sm">
                      <HistoryIcon className="w-4 h-4" />
                      <span>Employment Law - 2 weeks ago</span>
                    </li>
                  </ul>
                </ScrollArea>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={handlelogout}>
                  <>
                    <LogOutIcon className="w-4 h-4 mr-2" />
                    Logout
                  </>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      {!user && (
        <>
          <Button size="sm" className="bg-blue-700 hover:bg-blue-700/90 mr-2" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/login">Sign In</Link>
          </Button>
        </>
      )}
    </header>
  );
};

export default Navbar;
