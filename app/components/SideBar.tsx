import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'

const SideBar = ({ exportImage }: any) => {
    return (
        <div className="">
            <div className="text-right">
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-lg">Level</span>
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">10</div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                        <div className="w-4 h-4 bg-slate-900 rounded-sm"></div>
                    </div>
                    <div>
                        <div className="font-semibold">Artwork Hub</div>
                        <div className="text-sm text-slate-400">500 XP</div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" className="border-slate-600 bg-transparent">
                        Settings
                    </Button>
                    <Button onClick={exportImage} className="bg-cyan-600 hover:bg-cyan-700">
                        Export
                    </Button>
                </div>
            </div>
            <div className=" bg-slate-800 p-6 border-l border-slate-700">
                <div className="space-y-4">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Donate</Button>

                    <Card className="bg-slate-700 border-slate-600 p-4">
                        <h3 className="font-semibold mb-2">Profile Backgrounds</h3>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600 p-4">
                        <h3 className="font-semibold mb-2">Upload Codes</h3>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600 p-4">
                        <h3 className="font-semibold mb-2">Changelog</h3>
                    </Card>

                    {/* Promotional Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center">
                        <h3 className="font-bold text-lg mb-2">BEST STEAM AND</h3>
                        <h3 className="font-bold text-lg mb-2">DISCORD DESIGN</h3>
                        <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar