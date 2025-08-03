import { Button } from "@/components/ui/button"

const Header = () => {
    return (
        <header className="bg-white text-secondary p-4 flex justify-between items-center">
            <h1 className="text-xl">AI Notetaker</h1>
            <Button variant="default" size="lg" className="cursor-pointer">Sign Up</Button>
        </header>
    )
}

export default Header 