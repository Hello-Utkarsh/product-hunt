import { useEffect, useState } from 'react'
import './App.css'
import { Bell, Tag } from 'lucide-react'

function App() {
  const [backgroundDivs, setBackgroundDivs] = useState([])
  const coordinates = [
    { top: 5, left: 20 },
    { top: 11, left: 45 },
    { top: 25, left: 76 },
    { top: 26, left: 55 },
    { top: 45, left: 86 },
    { top: 83, left: 17 },
    { top: 68, left: 34 },
    { top: 72, left: 80 },
    { top: 87, left: 58 },
    { top: 10, left: 78 },
    { top: 20, left: 4 },
    { top: 27, left: 25 },
    { top: 41, left: 5 },
    { top: 73, left: 50 },
    { top: 64, left: 6 },
    { top: 70, left: 7 },
    { top: 84, left: 70 }
  ];

  const label = [[["Headphone", "$60 — 50% off 🎧"], 'floating_product_tag'],
  ["Hot Price Drop: MacBook Air now $799!", 'floating_element'],
  [["💸 Camera Gear:", "Lenses from $199"], 'floating_product_tag'],
  ["Just in! Smartwatch $120 -40%", 'floating_element'],
  [["Laptop Blowout:", "Just $450 💻"], 'floating_product_tag'],
  ["Grab It Fast! 🎮 Gaming Console $299", 'floating_element'],
  [["Limited Deal:", "Earbuds $25"], 'floating_product_tag'],
  ["50% Off Keyboard — Only $45!", 'notification'],
  ["⏳ Time-Sensitive Offers!", 'notification'],
  ["Deal Alert 🚨: Fitness Tracker $60", 'notification'],
  ["Save Now! Portable Speaker $30", 'floating_element'],
  ["Ultimate Bargain: Monitor at $110", 'floating_element'],
  ["Flash Sale: Chromebook $220 📱", 'floating_element'],
  ["Trending Discount: Gaming Mouse $30", 'floating_element'],
  ["Power Bank $15 ⚡️ Limited Time!", 'notification']]

  const notification = (index: number, top: number, left: number, text: string) => {
    return (
      <p
        key={`label-${index}`}
        className={`flex absolute animate-float items-center w-fit rounded-xl px-2 py-1 z-10 font-medium bg-yellow-400 text-gray-900`}
        style={{ top: `${top}%`, left: `${left}%` }}
      >
        <Bell className="h-5 w-5 mr-2" />
        {text}
      </p>
    )
  }

  const floating_element = (index: number, top: number, left: number, text: string) => {
    return (
      <p
        key={`label-${index}`}
        className={`flex absolute animate-float delay-500 items-center w-fit rounded-xl px-2 py-1 z-10 font-medium bg-white text-teal-600`}
        style={{ top: `${top}%`, left: `${left}%` }}
      >
        {text}
      </p>
    )
  }

  const floating_product_tag = (index: number, top: number, left: number, text: string[]) => {
    return (
      <p
        key={`label-${index}`}
        className={`flex absolute animate-float delay-200 items-center w-fit rounded-xl px-2 py-1 z-10 font-medium bg-white text-teal-600`}
        style={{ top: `${top}%`, left: `${left}%` }}
      >
        <Tag className="h-5 w-5 mr-2" />
        {text[0]} <br /> {text[1]}
      </p>
    )
  }

  const div_function: { [key: string]: (index: number, top: number, left: number, text: any) => JSX.Element } = {
    'notification': (index: number, top: number, left: number, text: string) => notification(index, top, left, text),
    'floating_element': (index: number, top: number, left: number, text: string) => floating_element(index, top, left, text),
    'floating_product_tag': (index: number, top: number, left: number, text: string[]) => floating_product_tag(index, top, left, text)
  };

  useEffect(() => {
    const divs: any = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      top: `${Math.random() * 90}%`,
      left: `${Math.random() * 95}%`
    }))
    setBackgroundDivs(divs)
  }, [])
  return (
    <div className='h-screen bg-teal-600 flex justify-center items-center text-white'>
      {label.map((x: (string | string[])[], index: number) => {
        const { top, left } = coordinates[index];



        return div_function[x[1] as string](index, top, left, x[0]);
      })}
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
      <div className='flex flex-col justify-center items-center z-20'>
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6">
          Track Prices, <span className="text-yellow-300">Save Big</span>
        </h1>
        <p className='text-2xl text-pretty mx-auto'>Set alerts for your favorite products and never miss a price drop. Shop smarter, save more.</p>
        <button className='px-3 py-1 bg-yellow-400 text-black rounded-xl mt-2 text-xl'>Get Started</button>
      </div>
    </div>
  )
}

export default App
