import React from "react";

type Props = {
    onClick: () => void,
}

function Start({onClick}: Props) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-6">
            <h1>Игры для взрослых. Пора за руль.</h1>
            <h2>Пройди путь до Кибертрака Вектор и открой скидку до 5000 ₽ на обучение.</h2>
            <button onClick={onClick} className="rounded-xl cursor-pointer bg-green-500 hover:bg-green-600 px-8 py-3 text-white disabled:opacity-40">Начать игру</button>
        </div>
    )
}

export default Start;
