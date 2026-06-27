import React from "react";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AccentText from "@/components/AccentText";
import FieldError from "@/components/FieldError";
import {
  LeadFormField,
  LeadFormFields,
  LeadFormErrors,
} from "@/lib/form-validation";
import { validateLeadField, validateLeadForm } from "@/lib/form-validation";
import { formatPhoneInput } from "@/lib/form-validation";
import { isLeadFormValid } from "@/lib/form-validation";
import { submitLead, type PlayerSessionState } from "@/lib/api-client";

type Props = {
  onSuccess: (session: PlayerSessionState) => void;
};

function Form({ onSuccess }: Props) {
  const [values, setValues] = useState<LeadFormFields>({
    firstName: "",
    lastName: "",
    city: "",
    phone: "",
    consent: false,
    honeypot: "",
  });
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<LeadFormField, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateField = (field: LeadFormField, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (submitted) {
      setErrors((prev) => ({
        ...prev,
        [field]: validateLeadField(field, { ...values, [field]: value }),
      }));
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    setSubmitError(null);
    setTouched({
      firstName: true,
      lastName: true,
      city: true,
      phone: true,
      consent: true,
    });
    const nextErrors = validateLeadForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await submitLead(values);
      onSuccess(session);
    } catch (error) {
      const apiError = error as Error & { errors?: LeadFormErrors };
      if (apiError.errors) {
        setErrors(apiError.errors);
      }
      setSubmitError(
        apiError instanceof Error
          ? apiError.message
          : "Не удалось отправить форму",
      );
    } finally {
      setIsSubmitting(false);
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
    <div
      className="relative mx-auto h-screen w-full 
            bg-[url('/bg-form-mobile.png')] bg-cover bg-center bg-no-repeat
			md:bg-[url('/bg-form-main.png')]
            md:h-auto md:min-h-screen
            
        "
    >
      <img
        src="/form-border.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] md:hidden h-[588px] w-[328px] -translate-x-1/2 -translate-y-1/2"
      />

      <img
        src="/form-border-main.svg"
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 hidden md:block h-[588px] md:w-[578px]"
      />
      <div
        className="
                absolute left-1/2 top-1/2 h-[588px] 
                w-[328px] md:w-[578px] -translate-x-1/2 -translate-y-1/2
                overflow-y-auto overflow-x-hidden
                hide-scrollbar 
                rounded-none
                bg-black/10 backdrop-blur-md aria-hidden
                pb-[32px]
                "
      >
        <div className="relative z-10 flex flex-col items-stretch gap-2 pt-[24px] px-[16px] md:gap-1 md:px-[30px] md:pt-[19px]">
          <p className="text-cream-text text-[16px] md:text-[24px] text-center">
            Чтобы выйти на старт, активируй
          </p>
          <AccentText className="uppercase text-[18px] md:text-[36px] text-center">
            Driver Mode
          </AccentText>

          <div className="grid grid-cols-1 pt-[8px] gap-y-2 md:grid-cols-[1fr_376px] md:gap-y-4 md:mt-5 md:text-[20px]">
            <label
              htmlFor="first-name"
              className="flex items-center gap-2 text-left text-cream-text"
            >
              <img
                src="/icon-id.svg"
                alt=""
                loading="lazy"
                className="h-[16px] w-[16px] md:h-[24px] md:w-[24px] shrink-0"
                aria-hidden
              />
              Имя
            </label>
            <Input
              id="first-name"
              placeholder="Введи имя"
              value={values.firstName}
              error={getError("firstName")}
              onBlur={() => markTouched("firstName")}
              onChange={(e) => updateField("firstName", e.target.value)}
            ></Input>

            <label
              htmlFor="last-name"
              className="flex w-full items-center gap-2 text-left text-cream-text"
            >
              <img
                src="/icon-id.svg"
                alt=""
                loading="lazy"
                className="h-[16px] w-[16px] md:h-[24px] md:w-[24px] shrink-0"
                aria-hidden
              />
              Фамилия
            </label>
            <Input
              id="last-name"
              placeholder="Введи фамилию"
              value={values.lastName}
              error={getError("lastName")}
              onBlur={() => markTouched("lastName")}
              onChange={(e) => updateField("lastName", e.target.value)}
            ></Input>

            <label
              htmlFor="city"
              className="flex w-full items-center gap-2 text-left text-cream-text"
            >
              <img
                src="/icon-house.svg"
                alt=""
                loading="lazy"
                className="h-[16px] w-[16px]  md:h-[24px] md:w-[24px] shrink-0"
                aria-hidden
              />
              Город
            </label>
            <Input
              id="city"
              placeholder="Введи город"
              value={values.city}
              error={getError("city")}
              onBlur={() => markTouched("city")}
              onChange={(e) => updateField("city", e.target.value)}
            ></Input>

            <label
              htmlFor="phone"
              className="flex w-full items-center gap-2 text-left text-cream-text"
            >
              <img
                src="/icon-phone.svg"
                alt=""
                loading="lazy"
                className="h-[16px] w-[16px] md:h-[24px] md:w-[24px] shrink-0"
                aria-hidden
              />
              Телефон
            </label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (xxx) xxx xx xx"
              value={values.phone}
              error={getError("phone")}
              onBlur={() => markTouched("phone")}
              onChange={(e) =>
                updateField("phone", formatPhoneInput(e.target.value))
              }
            ></Input>
          </div>
          <div>
            <label
              htmlFor="consent"
              className="group flex w-full cursor-pointer items-start gap-3 text-left md:mt-[23px]"
            >
              <input
                id="consent"
                type="checkbox"
                className="peer sr-only"
                checked={values.consent}
                onChange={(e) => updateField("consent", e.target.checked)}
              />
              <span
                className={`${
                  consentError
                    ? "border-chili-red group-hover:border-chili-red"
                    : "border-cream-text group-hover:border-white peer-checked:border-cream-text peer-checked:group-hover:border-cream-text"
                }
                        relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
                        border-2 bg-transparent
                        peer-focus-visible:outline peer-focus-visible:outline-2
                        peer-focus-visible:outline-offset-2 peer-focus-visible:outline-custom-lime
                        [&_img]:opacity-0 peer-checked:[&_img]:opacity-100`}
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
              <span className="flex-1 text-left text-[12px] text-cream-text  md:text-[15px]">
                я согласен (-а) с{" "}
                <a className="underline">политикой конфиденциальности</a>{" "}
                и обработки персональных данных
              </span>
            </label>
            {consentError ? <FieldError>{consentError}</FieldError> : null}
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

          {submitError ? <FieldError>{submitError}</FieldError> : null}

          <Button
            className="md:mt-[28px]"
            onClick={handleSubmit}
            disabled={!isLeadFormValid(values) || isSubmitting}
          >
            <span className="md:hidden">активировать</span>
            <span className="hidden md:inline">Aктивировать Driver Mode</span>
          </Button>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12
                    bg-gradient-to-t from-black/20 to-transparent"
          />
        </div>
      </div>
      <div className="hidden xl:block absolute  bottom-0 right-0 w-[276px] h-[414px] z-50">
        <img
          src="/kodik-person.png"
          alt=""
          loading="lazy"
          className="absolute w-[276px] h-[414px] bottom-0 xl:right-[102px] 2xl:bottom-35 2xl:right-[302px]"
          aria-hidden
        />
        <img
          src="/vecta-person.png"
          alt=""
          loading="lazy"
          className="absolute w-[146px] h-[354px] bottom-0 xl:right-[74px] 2xl:bottom-35 2xl:right-[274px]"
          aria-hidden
        />
      </div>

      {/* <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12
                bg-gradient-to-t from-black/70 to-transparent"
            /> */}
    </div>
  );
}

export default Form;
