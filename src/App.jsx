import { useState, useEffect } from "react";

let count = 0;

const MovingDiv = () => {
  const [snake, setSnake] = useState([{ left: 100, top: 100 }]); // Snake body 
  const [direction, setDirection] = useState({ x: 1, y: 0 }); // Initial direction (right)
  const [food, setFood] = useState({ left: 0, top: 0 });
  const [gameOver, setGameOver] = useState(false);
  const speed = 20;
  const containerSize = { width: 400, height: 400 };

  // Generate food position
  const generateFood = (snake) => {
    let newFood;
    let isOnSnake;
    do {
      newFood = {
        left: Math.floor(Math.random() * (containerSize.width / speed)) * speed,
        top: Math.floor(Math.random() * (containerSize.height / speed)) * speed,
      };
      isOnSnake = snake.some(segment => segment.left === newFood.left && segment.top === newFood.top);
    } while (isOnSnake);
    return newFood;
  };

  useEffect(() => {
    setFood(generateFood(snake));
  }, []);

  // Handle arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      let newDirection = { x: 0, y: 0 };

      switch (e.keyCode) {
        case 37:
        case 65: // Left arrow
          newDirection = { x: -1, y: 0 };
          break;
        case 38:
        case 87: // Up arrow
          newDirection = { x: 0, y: -1 };
          break;
        case 39:
        case 68: // Right arrow
          newDirection = { x: 1, y: 0 };
          break;
        case 40:
        case 83: // Down arrow
          newDirection = { x: 0, y: 1 };
          break;
        default:
          break;
      }

      // Prevent reversing direction
      if (direction.x + newDirection.x !== 0 || direction.y + newDirection.y !== 0) {
        setDirection(newDirection);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Move the snake
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] }; // Copy the head
        const newHead = {
          left: head.left + direction.x * speed,
          top: head.top + direction.y * speed,
        };

        // Check for boundary collision
        if (
          newHead.left < 0 ||
          newHead.top < 0 ||
          newHead.left >= containerSize.width ||
          newHead.top >= containerSize.height
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check for self-collision
        if (prevSnake.some(segment => segment.left === newHead.left && segment.top === newHead.top)) {
          setGameOver(true);
          return prevSnake;
        }

        // Check for food collision
        if (newHead.left === food.left && newHead.top === food.top) {
          count++;
          // Add new head to the snake and generate new food
          const newSnake = [newHead, ...prevSnake];
          setFood(generateFood(newSnake));
          return newSnake;
        } else {
          // Move the snake forward (remove the tail)
          return [newHead, ...prevSnake.slice(0, -1)];
        }
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div
        className="app"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "20px" }}>Score: {count}</div>
        <div
          style={{
            backgroundColor: "lightblue",
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
            position: "relative",
            overflow: "hidden",
            border: "2px solid black",
          }}
        >
          {gameOver && (
            <div
              style={{
                position: "absolute",
                width: "100%",
                textAlign: "center",
                color: "red",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Game Over
            </div>
          )}
          {/* Render snake */}
          {snake.map((segment, index) => (
            <div
              key={index}
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: index === 0 ? "darkgreen" : "green",
                position: "absolute",
                left: `${segment.left}px`,
                top: `${segment.top}px`,
                transition: "left 0.2s linear, top 0.2s linear",
              }}
            />
          ))}
          {/* Render food */}
          <div
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: "red",
              position: "absolute",
              left: `${food.left}px`,
              top: `${food.top}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MovingDiv;
