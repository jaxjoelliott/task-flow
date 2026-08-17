import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Services from './components/Services.jsx'
import About from './components/About.jsx'
import Merch from './components/Merch.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#services">
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Merch />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
