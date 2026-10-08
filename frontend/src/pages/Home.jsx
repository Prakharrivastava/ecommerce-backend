import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
// import Footer from '../components/Footer' <-- IS IMPORT KO HATA DEIN

const Home = () => {
  return (
    <div>
      <Hero />
      <Features />
      {/* <Footer /> <-- IS LINE KO BHI HATA DEIN */}
    </div>
  )
}

export default Home