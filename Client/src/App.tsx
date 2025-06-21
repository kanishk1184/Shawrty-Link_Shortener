import { useState } from "react"
import Background from "./components/Background"
import { FaRegCopy } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { TiTickOutline } from "react-icons/ti";

function App() {
  const [link, setLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shortenUrl, setShortenUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function isValidUrl(): boolean {
    try {
      new URL(link);
      return true;
    } catch {
      return false;
    }
  }

  const handleSubmit: ()=> Promise<void> = async ()=>{
    setIsSubmitting(true);
    setError("");
    
    // Check if it is a url
    if (isValidUrl()){
      try{
        const res = await fetch('https://shawrty-hgdz.onrender.com/create', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({url: link})
        });
  
        const data: {shortenUrl: string} = await res.json();
        setShortenUrl(data.shortenUrl);
      }
      catch{
        setError("Something wrong, Please try again");
      }
    }
    else{
      setError("Give a valid URL");
    }

    setIsSubmitting(false);
  }
  const handleCopy: ()=> Promise<void> =async ()=>{
    setError("");
    try{
      await navigator.clipboard.writeText(shortenUrl);
      setCopied(true);
      setTimeout(()=> setCopied(false), 4000);
    }
    catch (err){
      setError("Copy Failed");
    }

  }

  return (
    <>
      <Background />
        <div className="relative z-10 flex flex-col w-screen items-center gap-18 mt-10 text-white">
          <h1 className="heading text-5xl md:text-6xl text-center"><span className="text-blue-500">Shawrty</span>-The Link Shortener</h1>
          <div className="inputs flex flex-wrap gap-5 w-full justify-center">
            <div className="flex flex-col">
              <input type="text" placeholder="What's the link?" value={link} onChange={(e) => {
                if (error) setError("");
                if (shortenUrl) setShortenUrl("");
                setLink(e.target.value)
              }} className="w-[90vw] lg:w-[60vw] h-10 text-xl md:text-2xl px-3 py-6 outline-none backdrop:blur-2xl rounded-lg border border-[rgba(102,51,238,0.7)] focus:shadow-[0_0_10px_rgba(102,51,238,0.7),0_0_30px_rgba(102,51,238,0.4),0_0_50px_rgba(102,51,238,0.2)] transition-all duration-300 ease-out focus:placeholder:text-lg placeholder:transition-all"/>
              <AnimatePresence>
              {error && <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} transition={{duration: 0.3, ease: "easeOut"}} className="md:text-lg text-red-500 px-2">{error}</motion.div>}
              </AnimatePresence>
            </div>
            <motion.button whileTap={{scale: 0.85, transition: {duration: 0.2, type: "spring"}}} className="bg-[#6633ee] h-[45px] md:h-[50px] text-lg md:text-xl px-6 py-2 rounded-lg font-semibold tracking-wide not-disabled:shadow-[0_0_10px_rgba(102,51,238,0.6),0_0_20px_rgba(102,51,238,0.4)] not-disabled:hover:shadow-[0_0_20px_rgba(102,51,238,0.8),0_0_40px_rgba(102,51,238,0.3)] transition-all duration-300 ease-out not-disabled:hover:cursor-pointer not-disabled:hover:scale-105 disabled:cursor-not-allowed disabled:bg-gray-500" disabled={isSubmitting || link === ""} onClick={handleSubmit}>
              Shorten URL
            </motion.button>
          </div>
          {/* Render the link and cpy btn only when shortened url is available */}
          <AnimatePresence>
          {shortenUrl && 
            <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -20}} transition={{duration: 0.5, type: "spring"}} className="shortenedLink flex flex-col items-center gap-3">
              <p className="text-xl md:text-2xl text-wrap text-center">Here is your link: <a href={shortenUrl} className="underline text-blue-500" target="_blank">{shortenUrl}</a></p>
              <motion.button layout whileTap={{scale: 0.85, transition: {duration: 0.2, type: "spring"}}} className={`${copied? " bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6),0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_20px_rgba(34,197,94,0.8),0_0_40px_rgba(34,197,94,0.3)]":" bg-[#6633ee] shadow-[0_0_10px_rgba(102,51,238,0.6),0_0_20px_rgba(102,51,238,0.4)] hover:shadow-[0_0_20px_rgba(102,51,238,0.8),0_0_40px_rgba(102,51,238,0.3)]"} text-lg md:text-xl px-6 py-2 rounded-lg font-semibold tracking-wide transition-all duration-300 ease-out hover:cursor-pointer hover:scale-105 flex items-center justify-center overflow-hidden`} onClick={handleCopy}>
                <AnimatePresence mode="wait">
                  {copied? <motion.div key="copied" initial={{y: "-120%"}} animate={{y: 0}} exit={{y: "120%"}} transition={{duration: 0.2, type: "spring"}} className="flex items-center gap-1 justify-center"><TiTickOutline size={25} /><span>Copied</span></motion.div>: <motion.div key="notCopied" initial={{y: "-120%"}} animate={{y: 0}} exit={{y: "120%"}} transition={{duration: 0.2, type: "spring"}} className="flex items-center gap-1 justify-center"><FaRegCopy size={18}/><span>Copy to Clipboard</span></motion.div>}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          }
          </AnimatePresence>
        </div>
    </>
  )
}

export default App
