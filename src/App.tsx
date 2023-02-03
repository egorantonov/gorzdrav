import logo from './logo.svg'
import { Counter } from './features/counter/Counter'
import './App.css'
import { Route, Routes } from 'react-router'
import { Page1 } from './pages/page1'
import { Page2 } from './pages/page2'
import { Page3 } from './pages/page3'
import { Home } from './pages/home'
import { Nav } from './components/Nav'

function App() {
  return (
    <div className="App">
      <header className="">
        <p>WORK IN PROGRESS</p>
      </header>
      <main>
        <Nav />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/page1' element={<Page1 />} />
          <Route path='/page2' element={<Page2 />}/>
          <Route path='/page3' element={<Page3 />}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
