'use client'
import React, { useRef } from 'react'
import { gsap } from 'gsap'
import '../TruckButton.css'  // Make sure the relative path is correct

const TruckButton = ({ beforeAnimation, onComplete }) => {
  const buttonRef = useRef(null)
  const truckRef = useRef(null)
  const boxRef = useRef(null)

  const handleClick = () => {
    // If a validation function is provided, and it returns false, abort.
    if (beforeAnimation && !beforeAnimation()) return

    const button = buttonRef.current
    const truck = truckRef.current
    const box = boxRef.current

    // If not already done, start the animation
    if (!button.classList.contains('done')) {
      if (!button.classList.contains('animation')) {
        button.classList.add('animation')

        // Animate the box scaling and opacity
        gsap.to(button, {
          '--box-s': 1,
          '--box-o': 1,
          duration: 0.3,
          delay: 0.5,
        })

        // Move the box to its final X offset
        gsap.to(box, {
          x: 0,
          duration: 0.4,
          delay: 0.7,
        })

        // Animate a horizontal offset (for the truck-box “hinge” effect)
        gsap.to(button, {
          '--hx': -5,
          '--bx': 50,
          duration: 0.18,
          delay: 0.92,
        })

        // Animate the box’s Y offset into view
        gsap.to(box, {
          y: 0,
          duration: 0.1,
          delay: 1.15,
        })

        // Set initial truck Y variables
        gsap.set(button, {
          '--truck-y': 0,
          '--truck-y-n': -26,
        })

        // Animate the truck’s vertical position variables
        gsap.to(button, {
          '--truck-y': 1,
          '--truck-y-n': -25,
          duration: 0.2,
          delay: 1.25,
          onComplete() {
            // Create a timeline for the truck sliding animation
            gsap.timeline({
              onComplete() {
                button.classList.add('done')
                if (onComplete) onComplete()
              },
            })
              .to(truck, { x: 0, duration: 0.4 })
              .to(truck, { x: 40, duration: 1 })
              .to(truck, { x: 20, duration: 0.6 })
              .to(truck, { x: 96, duration: 0.4 })

            // Animate the progress bar (the pseudo-element) if desired
            gsap.to(button, {
              '--progress': 1,
              duration: 2.4,
              ease: 'power2.in',
            })
          },
        })
      }
    } else {
      // Reset for a possible re-run (if needed)
      button.classList.remove('animation', 'done')
      gsap.set(truck, { x: 4 })
      gsap.set(button, {
        '--progress': 0,
        '--hx': 0,
        '--bx': 0,
        '--box-s': 0.5,
        '--box-o': 0,
        '--truck-y': 0,
        '--truck-y-n': -26,
      })
      gsap.set(box, {
        x: -24,
        y: -6,
      })
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      type="button"
      className="truck-button"
      style={{
        '--box-s': 0.5,
        '--box-o': 0,
        '--truck-y': 0,
        '--truck-y-n': -26,
        '--hx': 0,
        '--bx': 0,
        '--progress': 0,
      }}
    >
      <span className="default">Complete Order</span>
      <span className="success">
        Order Placed
        <svg viewBox="0 0 12 10">
          <polyline points="1.5 6 4.5 9 10.5 1" />
        </svg>
      </span>
      <div className="truck" ref={truckRef}>
        <div className="wheel"></div>
        <div className="wheel"></div>
        <div className="back"></div>
        <div className="front"></div>
        <div className="box" ref={boxRef}></div>
      </div>
    </button>
  )
}

export default TruckButton
