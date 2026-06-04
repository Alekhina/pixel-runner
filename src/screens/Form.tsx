import React from "react";
import { useState } from "react";

type Props = {
    onClick: () => void;
}

function Form({onClick}: Props) {
    const [disabled, setDisabled] = useState(false);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-2 p-6">
            <h1>Чтобы выйти на старт, активируй Driver Mode.</h1>
            <label>Имя</label>
            <input></input>
            <label>Фамилия</label>
            <input></input>
            <label>Город</label>
            <input></input>
            <label>Телефон</label>
            <input></input>
            <label>Согласен на обработку персональных данных</label>
            <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)}></input>
            <button disabled={!disabled} onClick={onClick} className="rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 px-8 py-3 text-white disabled:opacity-40">Активировать Driver Mode</button>
        </div>
    )
}

export default Form;
