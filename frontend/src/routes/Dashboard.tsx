import { SignedIn, SignedOut, SignInButton, UserButton, useSession } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useNavigate } from 'react-router-dom'


export default function Dashboard() {
    const [backgroundDivs, setBackgroundDivs] = useState([])
    const session = useSession()
    const navigate = useNavigate()

    useEffect(() => {
        if (!session.isSignedIn) {
            navigate('/')        
        }
        const divs: any = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            size: Math.random() * 60 + 20,
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 95}%`
        }))
        setBackgroundDivs(divs)
    }, [])
    return (
        <div className='h-screen bg-teal-600 text-white'>
            <nav className='flex justify-between px-4 py-3 bg-teal-700'>
                <h1 className="text-3xl font-bold text-center mb-2 z-10">
                    Product-<span className="text-yellow-300">Hunter</span>
                </h1>
                <div>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>
            <div className='px-4 py-6 flex justify-between'>
                <div className='grid grid-cols-3'></div>
                <Dialog>
                    <DialogTrigger className='bg-yellow-400 px-3 py-1 text-black rounded-xl z-10 font-medium'>New Hunter</DialogTrigger>
                    <DialogContent className='bg-teal-600'>
                        <DialogHeader>
                            <DialogTitle className='text-white text-2xl font-semibold text-center'>Create a new <span className='text-yellow-400 font-bold text-3xl tracking-wide'>Hunter</span></DialogTitle>
                            <DialogDescription className='flex flex-col justify-center'>
                                <div className='flex flex-col mt-4'>
                                    <label htmlFor="" className='text-white font-medium'>Name</label>
                                    <input type="text" placeholder='Laptop...' className='rounded-xl px-2 py-1 mt-1 bg-teal-500 text-white placeholder-white' />
                                </div>
                                <div className='flex flex-col mt-4'>
                                    <label htmlFor="" className='text-white font-medium'>Name</label>
                                    <input type="url" placeholder='https://www.flip...' className='rounded-xl px-2 py-1 mt-1 bg-teal-500 text-white placeholder-white' />
                                </div>
                                <button className='bg-yellow-400 px-3 py-1 font-medium rounded-xl text-base mx-auto mt-4 text-black'>Create</button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

            </div>
            {backgroundDivs.map((div: any) => (
                <div
                    key={div.id}
                    className="fixed rounded-full bg-teal-500 opacity-20 animate-float z-0"
                    style={{
                        width: `${div.size}px`,
                        height: `${div.size}px`,
                        top: div.top,
                        left: div.left,
                        animationDuration: div.animationDuration,
                    }}
                />
            ))}
        </div>
    )
}
