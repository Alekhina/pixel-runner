import React from "react";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AccentText from "@/components/AccentText";
import { LeadFormField, LeadFormFields, LeadFormErrors } from "@/lib/form-validation";
import { validateLeadField, validateLeadForm } from "@/lib/form-validation";
import { formatPhoneInput } from "@/lib/form-validation";
import { isLeadFormValid } from "@/lib/form-validation";
// import 

type Props = {
    onClick: () => void;
}

function Form({onClick}: Props) {
    const [values, setValues] = useState<LeadFormFields>({
        firstName: "",
        lastName: "",
        city: "",
        phone: "+7",
        consent: false,
        honeypot: "",
    });
    const [errors, setErrors] = useState<LeadFormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [touched, setTouched] = useState<Partial<Record<LeadFormField, boolean>>>({});

    const updateField = (field: LeadFormField, value: string | boolean) => {
        setValues((prev) => ({ ...prev, [field]: value }));
        if (submitted) {
            setErrors((prev) => ({
            ...prev,
            [field]: validateLeadField(field, { ...values, [field]: value }),
            }));
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setTouched({
            firstName: true,
            lastName: true,
            city: true,
            phone: true,
            consent: true,
        });
        const nextErrors = validateLeadForm(values);
        if (Object.keys(nextErrors).length === 0) {
            onClick();
        }
    };

    
    const getError = (field: LeadFormField) => {
        if (!submitted && !touched[field]) return undefined;
        return validateLeadField(field, values);
    };

    const markTouched = (field: LeadFormField) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const consentError = getError("consent");

    return (
        <div className="relative mx-auto h-[640px] w-[360px] overflow-hidden
            bg-[url('/bg-form-mobile.png')] bg-cover bg-center bg-no-repeat
        ">
        <img
            src="/form-border.svg"
            alt=""
            aria-hidden
            loading="lazy"
            className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[600px] w-[328px] -translate-x-1/2 -translate-y-1/2"
        />
            <div className="
                absolute left-1/2 top-1/2 h-[600px] 
                w-[328px] -translate-x-1/2 -translate-y-1/2
                overflow-y-auto overflow-x-hidden
                hide-scrollbar 
                rounded-none
                bg-black/10 backdrop-blur-md aria-hidden
                pb-[32px]
                "
            >
            <div className="relative z-10 flex flex-col items-stretch gap-2 pt-[24px] px-[16px]">
                <p className="text-cream-text text-[16px] text-center">Чтобы выйти на старт, активируй</p>
                <AccentText className="uppercase text-[24px] text-center">Driver Mode</AccentText>

                <label htmlFor="first-name"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-id.svg"
                        alt=""
                        loading="lazy"
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Имя
                </label>
                <Input id="first-name" placeholder="Введи имя" value={values.firstName} error={getError("firstName")} onBlur={() => markTouched("firstName")} onChange={(e) => updateField("firstName", e.target.value)}></Input>

                <label htmlFor="last-name"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-id.svg"
                        alt=""
                        loading="lazy"
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Фамилия
                </label>
                <Input id="last-name" placeholder="Введи фамилию" value={values.lastName} error={getError("lastName")} onBlur={() => markTouched("lastName")}  onChange={(e) => updateField("lastName", e.target.value)}></Input>

                <label htmlFor="city"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-house.svg"
                        alt=""
                        loading="lazy"
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Город
                </label>
                <Input id="city" placeholder="Введи город" value={values.city} error={getError("city")} onBlur={() => markTouched("city")} onChange={(e) => updateField("city", e.target.value)}></Input>

                <label htmlFor="phone"
                    className="flex w-full items-center gap-2 text-left text-cream-text"
                >
                    <img
                        src="/icon-phone.svg"
                        alt=""
                        loading="lazy"
                        className="h-[16px] w-[16px] shrink-0"
                        aria-hidden
                    />
                    Телефон
                </label>
                <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 (xxx) xxx xx xx" value={values.phone} error={getError("phone")} onBlur={() => markTouched("phone")} onChange={(e) => updateField("phone", formatPhoneInput(e.target.value))}></Input>

                <div>
                <label htmlFor="consent" className="flex w-full cursor-pointer items-start gap-3 text-left">
                    <input id="consent" type="checkbox" className="peer sr-only" checked={values.consent} onChange={(e) => updateField("consent", e.target.checked)}/>
                    <span
                        className={
                        `${consentError ? "border-red-500" : "border-cream-text"}
                        relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
                        border-2 border-cream-text bg-transparent
                        peer-focus-visible:outline peer-focus-visible:outline-2
                        peer-focus-visible:outline-offset-2 peer-focus-visible:outline-custom-lime
                        [&_img]:opacity-0 peer-checked:[&_img]:opacity-100`
                    }
                        aria-hidden
                    >
                        <img
                        src="/check.svg"
                        alt=""
                        loading="lazy"
                        className="h-4 w-4 transition-opacity duration-150"
                        />
                    </span>
                    {/* <span className="mt-0.5 h-5 w-5 shrink-0 border-2 border-cream-text bg-transparent peer-checked:bg-custom-lime" /> */}
                    <span className="flex-1 text-left text-[12px] text-cream-text">я согласен (-а) с <a className="underline">политикой конфиденциальности</a> и обработки персональных данных</span>
                </label>
                {consentError ? (
                    <p className="-mt-1 text-[12px] text-red-500">{consentError}</p>
                ) : null}
                </div>

                <input
                    type="text"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    value={values.honeypot}
                    onChange={(e) => updateField("honeypot", e.target.value)}
                />

                {/* <Button onClick={handleSubmit} disabled={!isLeadFormValid(values)}>Активировать Driver Mode</Button> */}
                <Button onClick={handleSubmit}>Активировать Driver Mode</Button>
                
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12
                    bg-gradient-to-t from-black/20 to-transparent"
                />
            </div>
            </div>
            {/* <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12
                bg-gradient-to-t from-black/70 to-transparent"
            /> */}
        </div>
    )
}

export default Form;
