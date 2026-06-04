import React from "react";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";

type Props = {
    onClick: () => void;
}

function Form({onClick}: Props) {
    const [disabled, setDisabled] = useState(false);

    return (
        <div className="flex min-h-screen w-[360px] h-[640px] mx-auto bg-[url('/bg-form-mobile.png')] bg-cover bg-center bg-no-repeat flex-col items-center justify-center gap-2 p-6">
            <h1>Чтобы выйти на старт, активируй Driver Mode.</h1>
            <label className="text-cream-text">Имя</label>
            <Input></Input>
            <label className="text-cream-text">Фамилия</label>
            <Input></Input>
            <label className="text-cream-text">Город</label>
            <Input></Input>
            <label className="text-cream-text">Телефон</label>
            <Input></Input>
            <label className="text-cream-text">я согласен (-а) с политикой конфиденциальности и обработки персональных данных</label>
            <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)}></input>
            <Button disabled={!disabled} onClick={onClick}>Активировать Driver Mode</Button>
        </div>
    )
}

export default Form;
