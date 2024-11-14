import { SignedIn, SignedOut, SignInButton, UserButton, useSession, useUser } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Check, ChevronsUpDown, ShoppingCart, Tag } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'


export default function Dashboard() {
    const [backgroundDivs, setBackgroundDivs] = useState([])
    const [open, setOpen] = useState(false)
    const [userHunter, setUserHunters] = useState<{ id: number, user: string, name: string, product_url: string, source: string, price: string }[]>()
    const [hunter, setHunter] = useState<{ name: string, product_url: string, source: string, price: string }>({ name: "", product_url: "", source: "", price: "" })
    const [value, setValue] = useState("")
    const user = useUser()
    const { toast } = useToast()
    const navigate = useNavigate()

    const options = [
        {
            value: "amazon",
            label: "Amazon",
        },
        {
            value: "flipkart",
            label: "Flipkart",
        },
        {
            value: "mintra",
            label: "Mintra",
        },
        {
            value: "ajio",
            label: "Ajio",
        },
    ]

    useEffect(() => {
        if (!user.isSignedIn) {
            navigate('/')
        }
        const divs: any = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            size: Math.random() * 60 + 20,
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 95}%`
        }))
        setBackgroundDivs(divs)
        fetchUserHunters()
    }, [user.isSignedIn])

    const fetchUserHunters = async () => {
        if (user.user?.emailAddresses[0].emailAddress) {
            try {
                const req = await fetch(`${import.meta.env.VITE_PORT}/product/user-products/${user.user?.emailAddresses[0].emailAddress}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                const res = await req.json()
                if (req.status != 200) {
                    throw new Error(res.message)
                }
                setUserHunters(res)
            } catch (error: any) {
                console.log(error.message)
            }
        }
    }

    const submitHunter = async ({ name, product_url, source, price }: { name: string, product_url: string, source: string, price: string }) => {
        if (user.user?.emailAddresses[0].emailAddress) {
            try {
                const req = await fetch(`${import.meta.env.VITE_PORT}/product/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name, product_url, source, user: user.user?.emailAddresses[0].emailAddress, price
                    })
                })
                const res = await req.json()
                if (req.status != 200) {
                    throw new Error(res.message)
                }
                setUserHunters((prev = []) => [...prev, res])
            } catch (error: any) {
                toast({description: error.message})
            }
        }
    }

    const deleteHunter = async (id: number) => {
        if (user.user?.emailAddresses[0].emailAddress != undefined) {
            try {
                const req = await fetch(`${import.meta.env.VITE_PORT}/product/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': user.user?.emailAddresses[0].emailAddress
                    }
                })
                const res = await req.json()
                if (req.status != 200) {
                    throw new Error(res.message)
                }
                setUserHunters((prev = []) => [...prev?.filter((x) => x.id != res.id)])
            } catch (error: any) {
                toast({description: error.message})
            }
        }

    }

    return (
        <div className='h-screen bg-teal-600 text-white'>
            <nav className='flex justify-between px-4 py-3 bg-teal-700'>
                <h1 className="text-3xl font-bold text-center mb-2 z-10">
                    Product-<span className="text-yellow-300">Hunter</span>
                </h1>
                <div className='mt-1 mr-1'>
                    <SignedOut>
                        <SignInButton />
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </nav>
            <div className='px-4 py-6 flex justify-between gap-4'>
                <div className='grid grid-cols-3 gap-10'>
                    {userHunter && userHunter.map((x) => {
                        return (
                            <div key={`product-${x.id}`} className='bg-teal-700 relative px-3 py-2' style={{ borderRadius: "4px" }}>
                                <div className='flex justify-between px-2'>
                                    <h3 className='text-lg'>{x.name}</h3>
                                    <span className='bg-yellow-400 px-2 py-1 rounded-xl text-sm font-medium text-black'>{x.source}</span>
                                </div>
                                <span className='flex items-center text-2xl font-semibold mb-3 tracking-tight mt-2 px-2'>
                                    <Tag className='h-6 mr-2 mt-1' />
                                    {x.price}
                                </span>
                                <p className='bg-teal-800 py-1 px-2 mx-2 my-3' style={{ borderRadius: '5px' }}>Looks like there are currently no discounts on this product.</p>
                                <div className='flex justify-between'>
                                    <a className='w-full mx-2' href={x.product_url} target='_blank'><Button className='w-full' style={{ borderRadius: "6px" }}>Visit</Button></a>
                                    <Button onClick={() => deleteHunter(x.id)} className='w-full mx-2' variant='destructive' style={{ borderRadius: "6px" }}>Delete</Button>
                                </div>
                            </div>
                        )
                    })}
                    <div className='bg-teal-700 relative px-3 py-2' style={{ borderRadius: '5px' }}>
                        <div className='flex justify-between px-2'>
                            <h2 className='text-white text-xl tracking-tight font-semibold text-center'>Create a new <span className='text-yellow-400 font-bold text-2xl tracking-wide'>Hunter</span></h2>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-[120px] h-7 justify-between bg-yellow-400 text-black hover:bg-teal-600"
                                        style={{ borderRadius: "8px" }}
                                    >
                                        {value
                                            ? options.find((option) => option.value === value)?.label
                                            : "Select"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command className='bg-teal-600'>
                                        <CommandList>
                                            <CommandGroup>
                                                {options.map((option) => (
                                                    <CommandItem
                                                        className='hover:bg-teal-700 text-gray-200 font-medium data-[selected=true]:bg-teal-700'
                                                        key={option.value}
                                                        value={option.value}
                                                        onSelect={(currentValue) => {
                                                            setValue(currentValue === value ? "" : currentValue)
                                                            setHunter((prev) => ({
                                                                ...prev,
                                                                'source': currentValue
                                                            }))
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                value === option.value ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {option.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <input name='name' onChange={(e) => setHunter((prev) => ({
                            ...prev,
                            "name": e.target.value
                        }))} type="text" placeholder='Laptop...' className='bg-teal-800 py-1 text-base text-gray-200 w-3/5 placeholder:text-gray-400 px-1 mx-2 my-3' style={{ borderRadius: "8px" }} />
                        <div className='flex justify-between my-1'>
                            <span className='flex items-center text-2xl font-semibold mx-2'>
                                <Tag className='h-6 mr-2' />
                                <input name='name' onChange={(e) => setHunter((prev) => ({
                                    ...prev,
                                    "price": e.target.value
                                }))} type="text" placeholder='999' className='bg-teal-800 py-1 text-base text-gray-200 w-3/5 placeholder:text-gray-400 px-1' style={{ borderRadius: "8px" }} />
                            </span>
                            <span className='flex items-center text-2xl font-semibold mx-2'>
                                <ShoppingCart className='h-6 mr-2' />
                                <input type="url" placeholder='https://www.flip...' onChange={(e) => setHunter((prev) => ({
                                    ...prev,
                                    'product_url': e.target.value
                                }))} className='bg-teal-800 py-1 px-1 text-base text-gray-200 w-4/5 placeholder:text-gray-400' style={{ borderRadius: "8px" }} />
                            </span>
                        </div>
                        <Button onClick={() => { submitHunter(hunter) }} className='w-full mt-4' style={{ borderRadius: "6px" }}>Create</Button>
                    </div>
                </div>
                {/* <Dialog>
                    <DialogTrigger className='bg-yellow-400 w-32 px-3 py-1 h-fit text-black rounded-xl z-10 font-medium'>New Hunter</DialogTrigger>
                    <DialogContent className='bg-teal-600'>
                        <DialogHeader>
                            <DialogTitle className='text-white text-2xl font-semibold text-center'>Create a new <span className='text-yellow-400 font-bold text-3xl tracking-wide'>Hunter</span></DialogTitle>
                            <DialogDescription className='flex flex-col justify-center'>
                                <div className='flex flex-col mt-4'>
                                    <label htmlFor="" className='text-white font-medium'>Name</label>
                                    <input name='name' onChange={(e) => setHunter((prev) => ({
                                        ...prev,
                                        "name": e.target.value
                                    }))} type="text" placeholder='Laptop...' className='px-2 py-1 mt-1 bg-teal-500 text-white placeholder-white' style={{ borderRadius: "8px" }} />
                                </div>
                                <div className='flex flex-col mt-4'>
                                    <label htmlFor="" className='text-white font-medium'>Url</label>
                                    <input type="url" placeholder='https://www.flip...' onChange={(e) => setHunter((prev) => ({
                                        ...prev,
                                        'product_url': e.target.value
                                    }))} className='px-2 py-1 mt-1 bg-teal-500 text-white placeholder-white' style={{ borderRadius: "8px" }} />
                                </div>
                                <div className='flex justify-between mt-4 items-end'>
                                    <div className='flex flex-col'>
                                        <label htmlFor="" className='text-white font-medium'>Price</label>
                                        <input type="number" placeholder='999' onChange={(e) => setHunter((prev) => ({
                                            ...prev,
                                            'price': e.target.value
                                        }))} className='px-2 py-1 mt-1 bg-teal-500 text-white placeholder-white' style={{ borderRadius: "8px" }} />
                                    </div>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-[200px] justify-between bg-teal-500 text-white hover:bg-teal-600"
                                                style={{ borderRadius: "8px" }}
                                            >
                                                {value
                                                    ? options.find((option) => option.value === value)?.label
                                                    : "Select platform..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[200px] p-0">
                                            <Command className='bg-teal-400'>
                                                <CommandList>
                                                    <CommandGroup>
                                                        {options.map((option) => (
                                                            <CommandItem
                                                                className='hover:bg-teal-500 data-[selected=true]:bg-teal-500'
                                                                key={option.value}
                                                                value={option.value}
                                                                onSelect={(currentValue) => {
                                                                    setValue(currentValue === value ? "" : currentValue)
                                                                    setHunter((prev) => ({
                                                                        ...prev,
                                                                        'source': currentValue
                                                                    }))
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        value === option.value ? "opacity-100" : "opacity-0"
                                                                    )}
                                                                />
                                                                {option.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <button onClick={() => { submitHunter(hunter) }} className='bg-yellow-400 px-3 py-1 font-medium rounded-xl text-base mx-auto mt-4 text-black' style={{ borderRadius: "8px" }}>Create</button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog> */}

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
            <Toaster/>
        </div>
    )
}
