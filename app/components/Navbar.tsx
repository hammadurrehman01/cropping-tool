import { ChevronDown } from 'lucide-react'

const Navbar = () => {
    return (
        <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
                            <div className="w-4 h-4 bg-white rounded-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                        <span className="text-cyan-400 cursor-pointer">Home</span>
                        <div className="flex items-center space-x-1 cursor-pointer">
                            <span>Tools</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                        <div className="flex items-center space-x-1 cursor-pointer">
                            <span>More</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="text-sm text-cyan-400">Order Best Steam and Discord Design</div>
            </div>
        </nav>
    )
}

export default Navbar