import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"


const Header = () => {
    return (
        <header className="bg-white text-black p-4 flex justify-between items-center">
            <h1 className="text-xl">AI Notetaker</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        variant="default" 
                        size="lg" 
                        className="cursor-pointer"
                    >Sign Up
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign Up</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        <Input type="email" placeholder="Email" />
                        <Input type="password" placeholder="Password" />
                        <Button type="submit">Sign Up</Button>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </header>
    )
}

export default Header 