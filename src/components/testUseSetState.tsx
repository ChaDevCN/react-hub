import { useSetState } from "../hooks/useSetState";
import { useState } from "react";
export const TestUseSetState = () => {
    const { state, setRefState, getRefState } = useSetState({
        count: 0,
        name: 'John',
    });
    const [num,setNum] = useState(0);
    const handleIncrement = () => {
        console.log('before', getRefState());
        setRefState((prev) => ({ ...prev, count: prev.count + 1 }));
        console.log('after setRefState', getRefState());
        setNum(num + 1);
        console.log('after setNum', num, getRefState());
    }
    const handleDecrement = () => {
        setRefState((prev) => ({ ...prev, count: prev.count - 1 }));
        console.log('handleDecrement', getRefState());

    }
    const handleChangeName = () => {
        setRefState((prev) => ({ ...prev, name: 'Jane' }));
        console.log('handleChangeName', getRefState());

    }
    return (
        <div>
            <h1>Test Use Set State</h1>
            <button onClick={handleIncrement}>Increment</button>
            <button onClick={handleDecrement}>Decrement</button>
            <button onClick={handleChangeName}>Change Name</button>
            <p>Count: {state.count}</p>
            <p>Name: {state.name}</p>
            <p>Num: {num}</p>
            <p>Ref State: {getRefState().count}</p>
        </div>
    )
}