import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      
      <main className="container-editorial min-h-screen flex flex-col items-center justify-center pt-16">
        <p className="label-small mb-4">EST. 2026</p>
        
        <h1 className="font-display text-6xl md:text-8xl font-medium text-center leading-none mb-8">
          IBRAX
        </h1>
        
        <p className="font-mono text-sm text-text-muted mb-12">
          Notes from the journey.
        </p>
        
        <div className="hairline w-full max-w-md" />
        
        <p className="mt-8 text-text-muted text-center max-w-md">
          A personal journal about college, code, projects, 
          and everything in between.
        </p>
      </main>

      <Footer />
    </>
  )
}