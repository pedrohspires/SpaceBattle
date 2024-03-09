import { useEffect, useRef, useState } from "react";
import { playerType } from "./types/player.d";
import { shootType } from "./types/shoot.d";

type actionsType = {
    [key: string]: () => void
}

function App() {
    const [player, setPlayer] = useState<playerType>({
        x: window.innerWidth * 0.5 - 20,
        y: window.innerHeight - (window.innerHeight * 0.15),
        life: 5
    });
    const [shoot, setShoot] = useState<shootType>();
    const intervalShootRef = useRef<number>();
    const stepSize = 10;

    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardClick);
    }, []);

    useEffect(() => {
        if (shoot?.y && shoot?.y < 0) {
            setShoot(undefined);
            clearInterval(intervalShootRef.current);
        }
    }, [shoot]);

    const handleKeyboardClick = (event: KeyboardEvent) => {
        console.log(event.key)
        const action = actions[event.key];
        action && action();
    }

    const actions: actionsType = {
        a: () => setPlayerPosition({ x: player.x - stepSize }),
        w: () => setPlayerPosition({ y: player.y - stepSize }),
        d: () => setPlayerPosition({ x: player.x + stepSize }),
        s: () => setPlayerPosition({ y: player.y + stepSize }),
        ' ': () => makeShoot(),
        'Enter': () => makeShoot()
    }

    const makeShoot = () => {
        let newShoot: shootType = {
            x: player.x + 18,
            y: player.y
        }

        intervalShootRef.current = setInterval(() => setShoot({ ...newShoot, y: --newShoot.y }), 16);
    }

    const setPlayerPosition = ({ x, y }: { x?: number, y?: number }) => {
        if (x && x < 0) return;
        if (y && y < window.innerHeight * 0.7) return;
        if (x && x + 40 > window.innerWidth) x = window.innerWidth - 40;
        if (y && y + 40 > window.innerHeight) y = window.innerHeight - 40;

        player.x = typeof x == "number" ? x : player.x;
        player.y = typeof y == "number" ? y : player.y;
        setPlayer({ ...player });
    }

    return (
        <div className='w-screen h-screen bg-gray-900 relative overflow-hidden'>
            <div className="absolute w-10 aspect-square bg-green-500" style={{
                left: player.x,
                top: player.y
            }} />

            {shoot && (
                <div className="absolute w-2 aspect-square bg-red-500" style={{
                    left: shoot?.x,
                    top: shoot?.y
                }} />
            )}
        </div>
    )
}

export default App
