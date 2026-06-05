import React from "react";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AccentText from "@/components/AccentText";

type Props = {
    onClick: () => void;
}

function Form({onClick}: Props) {
    const [disabled, setDisabled] = useState(false);

    return (
        <div className="relative mx-auto h-[640px] w-[360px] overflow-hidden
            bg-[url('/bg-form-mobile.png')] bg-cover bg-center bg-no-repeat
        ">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[328px] -translate-x-1/2 -translate-y-1/2
            rounded-none border-2 border-white/40
            bg-black/10 backdrop-blur-md aria-hidden"></div>
            <div className="relative z-10 flex h-full flex-col items-stretch justify-center gap-2 p-6">
                <p className="text-cream-text text-[16px] text-center">Чтобы выйти на старт, активируй</p>
                <AccentText className="uppercase text-[24px] text-center">Driver Mode</AccentText>

                <label htmlFor="first-name"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-id.svg"
                        alt=""
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Имя
                </label>
                <Input id="first-name" placeholder="Введи имя"></Input>

                <label htmlFor="last-name"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-id.svg"
                        alt=""
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Фамилия
                </label>
                <Input id="last-name" placeholder="Введи фамилию"></Input>

                <label htmlFor="city"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-house.svg"
                        alt=""
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Город
                </label>
                <Input id="city" placeholder="Введи город"></Input>

                <label htmlFor="phone"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-phone.svg"
                        alt=""
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Телефон
                </label>
                <Input id="phone" placeholder="+7 (xxx) xxx xx xx"></Input>

                <label htmlFor="consent" className="flex w-full cursor-pointer items-start gap-3 text-left">
                    <input id="consent" type="checkbox" className="peer sr-only" onChange={(e) => setDisabled(e.target.checked)} checked={disabled} />
                    <span
                        className="
                        relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
                        border-2 border-cream-text bg-transparent
                        peer-focus-visible:outline peer-focus-visible:outline-2
                        peer-focus-visible:outline-offset-2 peer-focus-visible:outline-custom-lime
                        [&_img]:opacity-0 peer-checked:[&_img]:opacity-100
                        "
                        aria-hidden
                    >
                        <img
                        src="/check.svg"
                        alt=""
                        className="h-4 w-4 transition-opacity duration-150"
                        />
                    </span>
                    {/* <span className="mt-0.5 h-5 w-5 shrink-0 border-2 border-cream-text bg-transparent peer-checked:bg-custom-lime" /> */}
                    <span className="flex-1 text-left text-[12px] text-cream-text">я согласен (-а) с <a className="underline">политикой конфиденциальности</a> и обработки персональных данных</span>
                </label>

                {/* <label className="text-cream-text text-[12px]">я согласен (-а) с политикой конфиденциальности и обработки персональных данных</label>
                <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)}></input> */}
                <Button disabled={!disabled} onClick={onClick}>Активировать Driver Mode</Button>
            </div>
        </div>
    )
}

export default Form;
