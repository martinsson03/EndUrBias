"use client"

import { Input } from "@/components/shadcn/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/shadcn/ui/nativeSelect";
import { FormEvent, useState } from "react";

type ApplyJobClientProps = {
    id?: string
};

// The form that the user will submit to the job note.
export default function ApplyJobClient({ id }: ApplyJobClientProps) {
    // Set all the form inputs:
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname]   = useState("");
    const [gender, setGender]       = useState("");
    const [email, setEmail]         = useState("");
    const [phone, setPhone]         = useState("");
    const [cv, setCv]               = useState<File | null>(null);

    // When you have submitted the form, this will run.
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault(); // Prevent the framework from taking further actions.

        // Handle the inputs!
    }
    
    return (
        <div className="flex flex-col items-center gap-5">
            <h4 className="text-center font-bold">Application form</h4>

            <form onSubmit={handleSubmit} id={id ?? ""} className="w-full max-w-250 flex flex-col gap-3 pb-10">
                <div className="flex gap-7">
                    <div className="grow">
                        <label htmlFor="firstname">Firstname</label>
                        <Input type="text" id="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)}></Input>
                    </div>

                    <div className="grow">
                        <label htmlFor="lastname">Lastname</label>
                        <Input type="text" id="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)}></Input>
                    </div>
                </div>

                <div className="flex gap-7">
                    <div className="grow">
                        <label htmlFor="email">Email</label>
                        <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
                    </div>

                    <div className="grow max-w-50">
                        <label htmlFor="gender">Gender</label>
                        <NativeSelect id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                            <NativeSelectOption value="">Select gender</NativeSelectOption>
                            <NativeSelectOption value="male">Male</NativeSelectOption>
                            <NativeSelectOption value="female">Female</NativeSelectOption>
                            <NativeSelectOption value="other">Other</NativeSelectOption>
                        </NativeSelect>
                    </div>
                </div>
            </form>
        </div>
    );
}