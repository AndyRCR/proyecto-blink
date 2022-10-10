import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons"
import React, { useContext, useEffect, useState } from 'react'
import ResultItem from '../ResultItem/ResultItem'
import { results } from './ExampleResults'
import './ResultsCarousel.css'
import Benefits from '../Benefits/Benefits'
import { GlobalContext } from '../../context/GlobalStateContext'

const ResultsCarousel = () => {

  const { obtainResults } = useContext(GlobalContext)

  const [position, setPosition] = useState(0)
  const [newResults, setNewResults] = useState(results.map((el, index) => { return { ...el, pos: index } }))
  const [resize, setResize] = useState(window.innerWidth < 900)

  const pixelToInt = (pixels) => {
    return parseInt(pixels.slice(0, pixels.indexOf('p')))
  }

  const handleResize = () => {
    const carousel = document.querySelector('.carousel')
    const style = window.getComputedStyle(document.querySelector('.carousel .result'))
    const width = style.getPropertyValue('width')
    setResize(window.innerWidth < 900)
    carousel.style.width = `${pixelToInt(width) * 4 + 16 * 4}px`
  }

  const moveRight = () => {
    if (position > 0) {
      setNewResults(newResults.map(el => {
        return {
          ...el,
          pos: el.pos + 1
        }
      }
      ))
    }

    const style = window.getComputedStyle(document.querySelector('.carousel .result'))
    const width = style.getPropertyValue('width')

    setPosition(position < 1 ? position : position - 1)
    document.querySelectorAll('.carousel .result').forEach(item => {
      item.style.transform = position <= 0
        ? `translateX(${pixelToInt(width) * Math.abs(position) + 16 * Math.abs(position)}px)`
        : `translateX(${pixelToInt(width) * position + 16 * position}px)`
    })
  }

  const moveLeft = () => {
    if (position < results.length - 1) {
      setNewResults(newResults.map(el => {
        return {
          ...el,
          pos: el.pos - 1
        }
      }
      ))
    }

    const style = window.getComputedStyle(document.querySelector('.carousel .result'))
    const width = style.getPropertyValue('width')

    setPosition(position > results.length - 2 ? position : position + 1)
    document.querySelectorAll('.carousel .result').forEach(item => {
      item.style.transform = `translateX(-${pixelToInt(width) * position + 16 * position}px)`
    })
  }

  useEffect(() => {
    // obtainResults()
    if(results.length > 0){
      const carousel = document.querySelector('.carousel')
      const width = document.querySelector('.carousel .result').clientWidth
      carousel.style.width = `${width * 4 + 16 * 4}px`
  
      document.querySelectorAll('.carousel .result').forEach(item => {
        item.style.transform = `translateX(-${width * position + 16 * position}px)`
      })

      document.querySelectorAll('.carousel .pinFix.visible').forEach(item => {
        item.style.transform = `translateX(-${width * position + 16 * position}px)`
      })
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [position, resize, newResults])

  return (
    <div className='resultsCarousel' style={{ width: resize ? 'fit-content' : '100%' }}>
      {results.length > 0 ? (
        <>
          <Benefits />
          <div className='scrollButton' onClick={moveRight}>
            <FontAwesomeIcon className='scrollIcon' icon={faAngleLeft} />
          </div>
          <div className='carousel'>
            {newResults.map((res, i) => {
              return (
                <ResultItem res={res} i={i} pos={res.pos} key={`result ${i}`} />
              )
            })}
          </div>
          <div className='scrollButton' onClick={moveLeft}>
            <FontAwesomeIcon className='scrollIcon' icon={faAngleRight} />
          </div>
        </>
      ):(
        <h1>Cargando</h1>
      )}
    </div>
  )
}

export default ResultsCarousel